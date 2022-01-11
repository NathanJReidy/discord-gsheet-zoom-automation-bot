import { Client, Message } from "discord.js";
export declare class DiscordBotService {
    startAdminBot(): Promise<void>;
    messageDiscordUsersWithoutBookedCall(client: Client<boolean>, usernames: string[], message: Message<boolean>): Promise<Message<boolean> | undefined>;
}
