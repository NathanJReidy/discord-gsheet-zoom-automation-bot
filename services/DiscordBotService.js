import { Client, Intents } from "discord.js";
import dotenv from "dotenv";
import axios from "axios";
import { DiscordService } from "./DiscordService.js";
import { GoogleSheetsService } from "./GoogleSheetsService.js";
dotenv.config();

export class DiscordBotService {
  async startAdminBot() {
    const client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
      ],
    });
    const id = process.env.TEST_GUILD_ID;
    const prefix = "!";

    client.login(process.env.DISCORD_BOT_TOKEN);

    client.on("messageCreate", async function (message) {
      if (message.author.bot) return;
      if (!message.content.startsWith(prefix)) return;

      const commandBody = message.content.slice(prefix.length);
      const args = commandBody.split(" ");
      const command = args.shift().toLowerCase();

      const discordService = new DiscordService();
      const discordBotService = new DiscordBotService();
      const allDiscordUsernames = await discordService.getAllDiscordUsernames();
      const allDiscordUserIds = await discordService.getAllDiscordUserIds();

      const googleSheetsService = new GoogleSheetsService();
      const allSpreadSheetDiscordUsernames =
        await googleSheetsService.getAllSpreadSheetDiscordUsernames();

      const allDiscordUsernamesWithoutBookedCall =
        await discordService.findDiscordUsernamesWithoutBookedCall(
          allDiscordUsernames,
          allSpreadSheetDiscordUsernames
        );
      // Turn these into switch statements instead of if statements?
      if (command === "clean") {
        // const timeTaken = Date.now() - message.createdTimestamp;
        // console.log(`This message had a latency of ${timeTaken}ms.`);
        message.reply(
          `The following Discord users have not booked an onboarding call: ${allDiscordUsernames}`
        );
      }

      if (command === "notify") {
        message.reply(
          `The following Discord users have not booked an onboarding call: ${allDiscordUsernames}. Do you want me to remind them to book (yes/no)?`
        );
        discordBotService.messageDiscordUsersWithoutBookedCall(
          client,
          allDiscordUsernamesWithoutBookedCall,
          message
        );
        // if yes, send each discord username in the array a message reminding them to book a call or they will be executed within 7 days.
      }

      if (command === "execute") {
        message.reply(
          `The following Discord users have not booked an onboarding call: ${allDiscordUsernames}. Do I have permission to publicly execute them (yes/no)?`
        );
      }

      // if channel.id !== #administrative then disable commands and return a
      // message saying this bot is only available to admins
      // if channel.id === #administrative then allow all commands
      //   const guild = client.guilds.cache.find((guild) => guild.id === id);
      //   if (!guild) {
      //     throw new Error(`Can't find any guild with the ID "${id}"`);
      //   }
      //   const allDiscordMembers = await guild.members.fetch();
      //   const allDiscordMembersUsernames = allDiscordMembers.map(
      //     (member) => member.user.username
      //   );
    });
  }

  async messageDiscordUsersWithoutBookedCall(client, usernames, message) {
    const discordService = new DiscordService();
    const allDiscordUserIdsWithoutBookedCall =
      await discordService.getDiscordIdsFromUsernames(usernames);

    for (const discordUserId of allDiscordUserIdsWithoutBookedCall) {
      const user = await client.users.fetch(discordUserId);
      if (!user)
        return message.channel.send(`User with id ${discordUserId} not found`);

      try {
        await user.send(
          "Reminder: You must book an onboarding call to stay in Theopetra. You have 7 days to book a call or we will publicly execute you ;)"
        );
      } catch (error) {
        // message.channel.send(
        //   "User has DMs closed or has no mutual servers with the bot:("
        // );

        // This is currently being triggered once because the 'Discord Testing'
        // bot is included in the array of allDiscordUserIds, and obviously someone
        // cannot message themself. The bot tries to message itself and throws this error.
        // To fix this, all I need to do is add a conditional if statement to make sure
        // the username/userId does not equal that of the bot.
        console.log(`error is ${error}`);
      }
    }
  }
}
