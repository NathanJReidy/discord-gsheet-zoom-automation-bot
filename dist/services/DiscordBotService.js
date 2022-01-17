"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordBotService = void 0;
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const DiscordService_1 = require("./DiscordService");
const GoogleSheetsService_1 = require("./GoogleSheetsService");
dotenv_1.default.config();
class DiscordBotService {
    constructor() { }
    static async get() {
        if (!DiscordBotService.instance) {
            DiscordBotService.instance = new DiscordBotService();
        }
        return DiscordBotService.instance;
    }
    async startAdminBot() {
        const client = new discord_js_1.Client({
            intents: [
                discord_js_1.Intents.FLAGS.GUILDS,
                discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
                discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
            ],
        });
        const prefix = "!";
        client.login(process.env.DISCORD_BOT_TOKEN);
        client.on("messageCreate", async function (message) {
            if (message.author.bot)
                return;
            if (!message.content.startsWith(prefix))
                return;
            const commandBody = message.content.slice(prefix.length);
            const args = commandBody.split(" ");
            const command = args.shift().toLowerCase();
            const discordService = await DiscordService_1.DiscordService.get();
            const discordBotService = await DiscordBotService.get();
            const allDiscordUsernames = await discordService.getAllDiscordUsernames();
            const allDiscordUsernamesLength = allDiscordUsernames.length;
            const allDiscordGuildChannels = await discordService.getAllDiscordGuildChannels();
            // The bot will only work for people in the channelNameWithBotPermission specified below
            const channelNameWithBotPermission = process.env.CHANNEL_NAME_WITH_BOT_PERMISSION;
            const channelIdWithBotPermission = allDiscordGuildChannels
                .filter((channel) => channel.name === channelNameWithBotPermission)
                .map((channel) => channel.id)
                .shift();
            const googleSheetsService = await GoogleSheetsService_1.GoogleSheetsService.get();
            const allSpreadSheetDiscordUsernames = await googleSheetsService.getAllSpreadSheetDiscordUsernames();
            const allDiscordUsernamesWithoutBookedCall = await discordService.findDiscordUsernamesWithoutBookedCall(allDiscordUsernames, allSpreadSheetDiscordUsernames);
            if (message.channelId === channelIdWithBotPermission) {
                switch (command) {
                    case "notbooked":
                        message.reply(`${allDiscordUsernamesLength} Discord users have not booked an onboarding call: ${allDiscordUsernames}`);
                        break;
                    case "notify":
                        message.reply(`${allDiscordUsernamesLength} Discord users have not booked an onboarding call: ${allDiscordUsernames}. I have now sent a message to each of them reminding them to book a call.`);
                        discordBotService.messageDiscordUsersWithoutBookedCall(client, allDiscordUsernamesWithoutBookedCall, message);
                        break;
                    case "help":
                        message.reply(`You can issue the following commands: 

              !notbooked - this will tell you which Discord users have not booked an onboarding call.
              !notify - this will send a message to each Discord user without a booked onboarding call, reminding them to book.
              `);
                        break;
                    // TODO: add functionality for bot to remove users from Discord
                    case "execute":
                        // message.reply(
                        //   `The following Discord users have not booked an onboarding call: ${allDiscordUsernames}. Do I have permission to publicly execute them (yes/no)?`
                        // );
                        break;
                }
            }
            else if (command && message.channelId !== channelIdWithBotPermission) {
                message.reply(`You do not have permission to use this Bot. Only those in the ${channelNameWithBotPermission} channel can use it.`);
            }
        });
    }
    async messageDiscordUsersWithoutBookedCall(client, usernames, message) {
        const discordService = await DiscordService_1.DiscordService.get();
        const allDiscordUserIdsWithoutBookedCall = await discordService.getDiscordIdsFromUsernames(usernames);
        for (const discordUserId of allDiscordUserIdsWithoutBookedCall) {
            const user = await client.users.fetch(discordUserId);
            if (!user)
                return message.channel.send(`User with id ${discordUserId} not found`);
            try {
                await user.send("Reminder: You must book an onboarding call to stay in Theopetra. You have 7 days to book a call or we will publicly execute you ;)");
                return;
            }
            catch (error) {
                throw new Error(`error is ${error}`);
            }
        }
        return;
    }
}
exports.DiscordBotService = DiscordBotService;
//# sourceMappingURL=DiscordBotService.js.map