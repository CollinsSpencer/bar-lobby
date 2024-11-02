import axios from "axios";
import * as fs from "fs";
import * as glob from "glob-promise";
import { removeFromArray } from "$/jaz-ts-utils/object";
import { Octokit } from "@octokit/rest";
import * as path from "path";
import { EngineAI, EngineVersion } from "@main/content/engine/engine-version";
import { DownloadInfo } from "../downloads";
import { parseLuaTable } from "@main/utils/parse-lua-table";
import { parseLuaOptions } from "@main/utils/parse-lua-options";
import { logger } from "@main/utils/logger";
import { extract7z } from "@main/utils/extract-7z";
import { contentSources } from "@main/config/content-sources";
import { AbstractContentAPI } from "@main/content/abstract-content";
import { CONTENT_PATH } from "@main/config/app";

const log = logger("engine-content.ts");

export const engineVersionRegex = /^(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)-(?<revision>\d+)-g(?<sha>[0-9a-f]+) (?<branch>.*)$/i;
export const gitEngineTagRegex = /^.*?\{(?<branch>.*?)\}(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)-(?<revision>\d+)-g(?<sha>[0-9a-f]+)$/i;

export class EngineContentAPI extends AbstractContentAPI<EngineVersion> {
    protected readonly engineDirs = path.join(CONTENT_PATH, "engine");
    protected readonly ocotokit = new Octokit();

    public override async init() {
        try {
            log.info("Initializing engine content API");
            await fs.promises.mkdir(this.engineDirs, { recursive: true });
            const files = await fs.promises.readdir(this.engineDirs, { withFileTypes: true });
            const dirs = files.filter((file) => file.isDirectory()).map((dir) => dir.name);
            log.info(`Found ${dirs.length} installed engine versions`);
            for (const dir of dirs) {
                log.info(`-- Engine ${dir}`);
                const ais = await this.parseAis(dir);
                this.installedVersions.push({ id: dir, lastLaunched: new Date(), ais });
            }
        } catch (err) {
            log.error(err);
        }
        return this;
    }

    public isVersionInstalled(id: string): boolean {
        return this.installedVersions.some((installedVersion) => installedVersion.id === id);
    }

    public async downloadEngine(engineVersion: string) {
        try {
            if (this.isVersionInstalled(engineVersion)) {
                return;
            }
            const releaseTag = this.engineVersionToGitEngineTag(engineVersion);
            const { data } = await this.ocotokit.rest.repos.getReleaseByTag({
                owner: contentSources.engineGitHub.owner,
                repo: contentSources.engineGitHub.repo,
                tag: releaseTag,
            });
            if (!data) {
                throw new Error(`Couldn't find engine release for tag: ${engineVersion}`);
            }
            const archStr = process.platform === "win32" ? "windows" : "linux";
            const asset = data.assets.find((asset) => asset.name.includes(archStr) && asset.name.includes("portable"));
            if (!asset) {
                throw new Error("Failed to fetch engine release asset");
            }
            const engineName = this.gitEngineTagToEngineVersionString(releaseTag);
            const downloadInfo: DownloadInfo = {
                type: "engine",
                name: engineName,
                currentBytes: 0,
                totalBytes: 1,
            };
            this.currentDownloads.push(downloadInfo);
            this.downloadStarted(downloadInfo);
            log.info(`Downloading engine: ${engineName}`);
            const downloadResponse = await axios({
                url: asset.browser_download_url,
                method: "get",
                responseType: "arraybuffer",
                headers: { "Content-Type": "application/7z" },
                onDownloadProgress: (progress) => {
                    downloadInfo.currentBytes = progress.loaded;
                    downloadInfo.totalBytes = progress.total;
                    this.downloadProgress(downloadInfo);
                },
            });
            const engine7z = downloadResponse.data as ArrayBuffer;
            const downloadedFilePath = path.join(this.engineDirs, asset.name);
            const engineDestinationPath = path.join(this.engineDirs, engineName);
            log.info(`Extracting <${asset.name}> to ${engineDestinationPath}`);
            await fs.promises.mkdir(this.engineDirs, { recursive: true });
            await fs.promises.writeFile(downloadedFilePath, Buffer.from(engine7z), { encoding: "binary" });
            await extract7z(downloadedFilePath, engineDestinationPath);
            await fs.promises.unlink(downloadedFilePath);
            removeFromArray(this.currentDownloads, downloadInfo);
            log.info(`Extracted engine <${asset.name}>`);
            await this.downloadComplete(downloadInfo);
            log.info(`Downloaded engine: ${engineName}`);
            return engineName;
        } catch (err) {
            log.error(err);
        }
    }

    public async uninstallVersion(version: EngineVersion | string) {
        if (typeof version === "object") {
            version = version.id;
        }
        const engineDir = path.join(this.engineDirs, version);
        await fs.promises.rm(engineDir, { force: true, recursive: true });
        const index = this.installedVersions.findIndex((installedVersion) => installedVersion.id === version);
        this.installedVersions.splice(index, 1);
    }

    protected sortVersions() {
        this.installedVersions.sort((a, b) => {
            const aParts = this.parseEngineVersionParts(a.id);
            const bParts = this.parseEngineVersionParts(b.id);
            if (aParts.major > bParts.major) {
                return 1;
            } else if (aParts.major < bParts.major) {
                return -1;
            }
            if (aParts.revision > bParts.revision) {
                return 1;
            } else if (aParts.revision < bParts.revision) {
                return -1;
            }
            return 0;
        });
    }

    protected engineVersionToGitEngineTag(engineVersionString: string) {
        const { major, minor, patch, revision, sha, branch } = engineVersionString.match(engineVersionRegex)!.groups!;
        return `spring_bar_{${branch.toUpperCase()}}${major}.${minor}.${patch}-${revision}-g${sha}`;
    }

    protected gitEngineTagToEngineVersionString(gitEngineTag: string) {
        const { major, minor, patch, revision, sha } = gitEngineTag.match(gitEngineTagRegex)!.groups!;
        return `${major}.${minor}.${patch}-${revision}-g${sha} BAR${major}`;
    }

    protected parseEngineVersionParts(engineVersionString: string) {
        const { major, minor, patch, revision, sha, branch } = engineVersionString.match(engineVersionRegex)!.groups!;
        return {
            major: parseInt(major),
            minor: parseInt(minor),
            patch: parseInt(patch),
            revision: parseInt(revision),
            sha,
            branch,
        };
    }

    protected override async downloadComplete(downloadInfo: DownloadInfo) {
        log.debug(`Download complete: ${downloadInfo.name}`);
        this.installedVersions.push({ id: downloadInfo.name, lastLaunched: new Date(), ais: [] });
        super.downloadComplete(downloadInfo);
    }

    protected async parseAis(engineVersion: string): Promise<EngineAI[]> {
        const ais: EngineAI[] = [];
        const aisPath = path.join(this.engineDirs, engineVersion, "AI", "Skirmish");
        const aiDirs = await fs.promises.readdir(aisPath);
        for (const aiDir of aiDirs) {
            try {
                const ai = await this.parseAi(path.join(aisPath, aiDir));
                ais.push(ai);
            } catch (err) {
                console.error(`Error parsing AI: ${aiDir}`, err);
            }
        }
        return ais;
    }

    protected async parseAi(aiPath: string): Promise<EngineAI> {
        const aiDefinitions = await glob.promise(`${aiPath}/**/{AIInfo.lua,AIOptions.lua}`, { windowsPathsNoEscape: true });
        const aiInfoPath = aiDefinitions.find((filePath) => filePath.endsWith("AIInfo.lua"));
        const aiOptionsPath = aiDefinitions.find((filePath) => filePath.endsWith("AIOptions.lua"));
        if (aiInfoPath === undefined) {
            throw new Error(`AIInfo.lua not found in ${aiPath}`);
        }
        if (aiOptionsPath === undefined) {
            throw new Error(`AIOptions.lua not found in ${aiPath}`);
        }
        const aiInfoFile = await fs.promises.readFile(aiInfoPath);
        const aiInfoFields = parseLuaTable(aiInfoFile);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aiInfo: Record<string, any> = {};
        for (const field of aiInfoFields) {
            aiInfo[field.key] = field.value;
        }
        const aiOptionsFile = await fs.promises.readFile(aiOptionsPath);
        const aiOptions = parseLuaOptions(aiOptionsFile);
        return {
            shortName: aiInfo.shortName,
            name: aiInfo.name,
            description: aiInfo.description,
            version: aiInfo.version,
            options: aiOptions,
        };
    }

    //TODO move this check to front
    // protected async cleanupOldVersions() {
    //     log.info("Cleaning up old engine versions");
    //     const maxDays = 90;
    //     const oldestDate = new Date();
    //     oldestDate.setDate(oldestDate.getDate() - maxDays);
    //     const versionsToRemove = await cacheDb.selectFrom("engineVersion").where("lastLaunched", "<", oldestDate).select("id").execute();
    //     for (const version of versionsToRemove) {
    //         await this.uninstallVersion(version.id);
    //     }
    // }
}

export const engineContentAPI = new EngineContentAPI();
