import { TachyonClientOptions } from "tachyon-client";

export const serverConfig: Partial<TachyonClientOptions<"user">> = {
    // host: "server4.beyondallreason.info",
    // port: 8202,
    host: "127.0.0.1",
    port: 4000,
    ssl: false,
    // logging: true,
    // clientId: "generic_lobby",
};
