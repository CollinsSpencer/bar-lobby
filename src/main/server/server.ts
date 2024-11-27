import { TachyonClient } from "tachyon-client";
import { serverConfig } from "@main/config/server";

/**
 * This class is a extension of the TachyonClient class.
 * It is used to communicate with the server.
 * All communication with the server should be done through this class.
 *
 * this includes matchmaking, chat, direct messages, and other lobby related functions.
 */
export class BarServerAPI extends TachyonClient<"user"> {
    constructor() {
        super("user", {
            host: serverConfig.host,
            port: serverConfig.port ?? 443,
            ssl: serverConfig.ssl ?? true,
            logging: serverConfig.logging ?? true,
            requestHandlers: {
                "battle/start": async (data) => {
                    return {
                        status: "success",
                    };
                },
            },
        });
    }

    public onConnectionClosed(callback: () => void) {
        this.socket.addEventListener("close", () => {
            console.error("Connection closed");
            callback();
        });
    }
}

export const barServerAPI = new BarServerAPI();
