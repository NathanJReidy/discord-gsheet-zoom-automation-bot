"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
class DiscordService {
    constructor() { }
    static async get() {
        if (!DiscordService.instance) {
            DiscordService.instance = new DiscordService();
        }
        return DiscordService.instance;
    }
    async getAllDiscordUsernames() {
        const response = await axios_1.default.get(`${process.env.DISCORD_BASE_URL}/guilds/${process.env.GUILD_ID}/members?query=""&limit=1000`, {
            headers: {
                Content_Type: "application/json",
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            },
        });
        const allDiscordUsernames = response.data
            .map((member) => member.user.username)
            .filter((username) => username != process.env.DISCORD_BOT_NAME); // exclude the Discord Bot from the returned allDiscordUsernames
        return allDiscordUsernames;
    }
    /**
     * This returns the people who have accepted a Discord invitation
     * but have not booked an onboarding call
     * */
    async findDiscordUsernamesWithoutBookedCall(discordUsernames, gsheetDiscordUsernames) {
        const formattedDiscordUsernames = discordUsernames.map((i) => i.split(" ").join("").toLowerCase()); // remove spaces and make lowercase
        const formattedGsheetDiscordUsernames = gsheetDiscordUsernames.map((i) => i.split(" ").join("").toLowerCase()); // remove spaces and make lowercase
        const discordUsernamesWithoutBookedCall = formattedDiscordUsernames.filter((x) => !formattedGsheetDiscordUsernames.includes(x));
        return discordUsernamesWithoutBookedCall;
    }
    async getAllDiscordUserIds() {
        const response = await axios_1.default.get(`${process.env.DISCORD_BASE_URL}/guilds/${process.env.GUILD_ID}/members?query=""&limit=1000`, {
            headers: {
                Content_Type: "application/json",
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            },
        });
        const allDiscordUserIds = response.data.map((member) => member.user.id);
        if (!allDiscordUserIds) {
            throw new Error("There was no result for allDiscordUserIds");
        }
        return allDiscordUserIds;
    }
    async getAllDiscordUsers() {
        const response = await axios_1.default.get(`${process.env.DISCORD_BASE_URL}/guilds/${process.env.GUILD_ID}/members?query=""&limit=1000`, {
            headers: {
                Content_Type: "application/json",
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            },
        });
        const allDiscordUsers = response.data.map((member) => member.user);
        if (!allDiscordUsers) {
            throw new Error("There was no result for allDiscordUsers");
        }
        return allDiscordUsers;
    }
    async getDiscordIdsFromUsernames(usernames) {
        const allDiscordUsers = await this.getAllDiscordUsers();
        const discordUsersFilteredByUsernames = allDiscordUsers.filter((user) => usernames.includes(user.username));
        const discordUserIdsFilteredByUsernames = discordUsersFilteredByUsernames.map((user) => user.id);
        return discordUserIdsFilteredByUsernames;
    }
    async getAllDiscordGuildChannels() {
        const response = await axios_1.default.get(`${process.env.DISCORD_BASE_URL}/guilds/${process.env.GUILD_ID}/channels`, {
            headers: {
                Content_Type: "application/json",
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            },
        });
        const allDiscordGuildChannels = response.data.map((guildChannel) => guildChannel);
        return allDiscordGuildChannels;
    }
    /**
     * This returns all Discord Usernames in the server.
     * Use this method instead of getAllDiscordUsernames
     * if your server has more than 100 members
     * */
    async getAllDiscordUsernamesWithoutMaxLimit() {
        let allDiscordUsernames = [];
        let lastUserId = 0;
        while (true) {
            const response = await axios_1.default.get(`${process.env.DISCORD_BASE_URL}/guilds/${process.env.GUILD_ID}/members?query=""&limit=1000&after=${lastUserId}`, {
                headers: {
                    Content_Type: "application/json",
                    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                },
            });
            if (!response.data || response.data.length === 1) {
                return allDiscordUsernames;
            }
            const allDiscordUsernamesFromResponse = response.data
                .map((member) => member.user.username)
                .filter((username) => username != process.env.DISCORD_BOT_NAME); // exclude the Discord Bot from the returned allDiscordUsernames
            allDiscordUsernames.push(...allDiscordUsernamesFromResponse);
            lastUserId = Math.max.apply(null, response.data.map((member) => member.user.id)); // assign the highest user id in the array
        }
    }
}
exports.DiscordService = DiscordService;
//# sourceMappingURL=DiscordService.js.map