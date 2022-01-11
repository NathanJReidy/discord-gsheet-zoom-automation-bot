export declare class DiscordService {
    getAllDiscordUsernames(): Promise<any>;
    /**
     * This returns the people who have accepted a Discord invitation
     * but have not booked an onboarding call
     * */
    findDiscordUsernamesWithoutBookedCall(discordUsernames: any, gsheetDiscordUsernames: any): Promise<any>;
    getAllDiscordUserIds(): Promise<any>;
    getAllDiscordUsers(): Promise<any>;
    getDiscordIdsFromUsernames(usernames: string[]): Promise<any>;
    getAllDiscordGuildChannels(): Promise<any>;
}
