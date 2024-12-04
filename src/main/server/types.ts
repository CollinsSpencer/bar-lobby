import type { TachyonActor, GetCommandIds, GetCommandData, GetCommands } from "tachyon-protocol";

export type CommandHandler<CommandId extends GetCommandIds<"server", TachyonActor, "request">> = {
    (data: GetCommandData<GetCommands<"server", TachyonActor, "request", CommandId>>): Promise<Omit<GetCommands<TachyonActor, "server", "response", CommandId>, "type" | "commandId" | "messageId">>;
};
