import { TachyonClientOptions } from "tachyon-client";

export const serverConfig: Partial<TachyonClientOptions<"user">> = {
    host: "server4.beyondallreason.info",

    // Integration server
    // host: "server5.beyondallreason.info",

    // For local dev
    // host: "127.0.0.1",
    // port: 4000,
    // ssl: false,
    // logging: true,
};
