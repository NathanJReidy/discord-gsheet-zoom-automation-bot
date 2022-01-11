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
    async getAllDiscordUsernames() {
        const response = await axios_1.default.get(`${process.env.DISCORD_BASE_URL}/guilds/${process.env.TEST_GUILD_ID}/members?query=""&limit=1000`, {
            headers: {
                Content_Type: "application/json",
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            },
        });
        const allDiscordUsernames = response.data.map((member) => member.user.username);
        return allDiscordUsernames;
    }
    /**
     * This returns the people who have accepted a Discord invitation
     * but have not booked an onboarding call
     * */
    async findDiscordUsernamesWithoutBookedCall(discordUsernames, gsheetDiscordUsernames) {
        const discordUsernamesWithoutBookedCall = discordUsernames.filter((x) => !gsheetDiscordUsernames.includes(x));
        return discordUsernamesWithoutBookedCall;
    }
    async getAllDiscordUserIds() {
        const response = await axios_1.default.get(`${process.env.DISCORD_BASE_URL}/guilds/${process.env.TEST_GUILD_ID}/members?query=""&limit=1000`, {
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
        const response = await axios_1.default.get(`${process.env.DISCORD_BASE_URL}/guilds/${process.env.TEST_GUILD_ID}/members?query=""&limit=1000`, {
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
        const response = await axios_1.default.get(`${process.env.DISCORD_BASE_URL}/guilds/${process.env.TEST_GUILD_ID}/channels`, {
            headers: {
                Content_Type: "application/json",
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            },
        });
        const allDiscordGuildChannels = response.data.map((guildChannel) => guildChannel);
        return allDiscordGuildChannels;
    }
}
exports.DiscordService = DiscordService;
//# sourceMappingURL=DiscordService.js.map