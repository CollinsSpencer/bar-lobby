import { CommandHandler } from "@main/server/types";

export const battleStart: CommandHandler<"battle/start"> = async function () {
    return {
        status: "success",
    };
};
