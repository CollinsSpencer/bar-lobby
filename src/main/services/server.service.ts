import { ipcMain } from "electron";
import { barServerAPI } from "@main/server/server";

async function init() {}

function registerIpcHandlers(mainWindow: Electron.BrowserWindow) {
    ipcMain.handle("server:connect", async (_, token: Parameters<typeof barServerAPI.connect>[0]) => {
        try {
            await barServerAPI.connect(token);
            barServerAPI.onConnectionClosed(() => mainWindow.webContents.send("server:connection-closed"));
        } catch (e) {
            console.error(e);
        }
    });
    ipcMain.handle("server:request", async (_, ...params: Parameters<typeof barServerAPI.request>) => barServerAPI.request(...params));
    ipcMain.handle("server:sendEvent", (_, event: Parameters<typeof barServerAPI.sendEvent>[0]) => barServerAPI.sendEvent(event));
    ipcMain.handle("server:onEvent", (_, commandId: Parameters<typeof barServerAPI.onEvent>[0]) => barServerAPI.onEvent(commandId));
    ipcMain.handle("server:nextEvent", (_, commandId: Parameters<typeof barServerAPI.nextEvent>[0]) => barServerAPI.nextEvent(commandId));
    ipcMain.handle("server:onResponse", (_, commandId: Parameters<typeof barServerAPI.onResponse>[0]) => barServerAPI.onResponse(commandId));
    ipcMain.handle("server:isConnected", () => barServerAPI.isConnected());
    ipcMain.handle("server:disconnect", () => barServerAPI.disconnect());
    ipcMain.handle("server:getServerBaseUrl", () => barServerAPI.getServerBaseUrl());
    ipcMain.handle("server:auth", async (_, options: Parameters<typeof barServerAPI.auth>[0]) => barServerAPI.auth({ ...options }));
    ipcMain.handle("server:register", async (_, options: Parameters<typeof barServerAPI.register>[0]) => barServerAPI.register(options));
}

const serverService = {
    init,
    registerIpcHandlers,
};

export default serverService;
