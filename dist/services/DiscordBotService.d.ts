import { Client, Message } from "discord.js";
export declare class DiscordBotService {
    private static instance;
    static get(): Promise<DiscordBotService>;
    private constructor();
    startAdminBot(): Promise<void>;
    messageDiscordUsersWithoutBookedCall(client: Client<boolean>, usernames: string[], message: Message<boolean>): Promise<Message<boolean> | undefined>;
}
