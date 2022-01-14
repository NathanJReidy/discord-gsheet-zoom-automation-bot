import { Client, Intents, Message } from "discord.js";
import dotenv from "dotenv";
import { DiscordService } from "./DiscordService";
import { GoogleSheetsService } from "./GoogleSheetsService";
dotenv.config();

export class DiscordBotService {
  private static instance: DiscordBotService;
  public static async get(): Promise<DiscordBotService> {
    if (!DiscordBotService.instance) {
      DiscordBotService.instance = new DiscordBotService();
    }
    return DiscordBotService.instance;
  }

  private constructor() {}

  public async startAdminBot() {
    const client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
      ],
    });
    // const id = process.env.TEST_GUILD_ID;
    const prefix = "!";

    client.login(process.env.DISCORD_BOT_TOKEN);

    client.on("messageCreate", async function (message) {
      if (message.author.bot) return;
      if (!message.content.startsWith(prefix)) return;

      const commandBody = message.content.slice(prefix.length);
      const args = commandBody.split(" ");
      const command = (args.shift() as string).toLowerCase();

      const discordService = await DiscordService.get();
      const discordBotService = await DiscordBotService.get();
      const allDiscordUsernames = await discordService.getAllDiscordUsernames();
      // const allDiscordUserIds = await discordService.getAllDiscordUserIds();
      const allDiscordGuildChannels =
        await discordService.getAllDiscordGuildChannels();

      // The bot will only work for people in the channelNameWithBotPermission specified below
      const channelNameWithBotPermission = "general";
      const channelIdWithBotPermission = allDiscordGuildChannels
        .filter((channel: any) => channel.name === channelNameWithBotPermission)
        .map((channel: any) => channel.id)
        .shift();

      const googleSheetsService = await GoogleSheetsService.get();
      const allSpreadSheetDiscordUsernames =
        await googleSheetsService.getAllSpreadSheetDiscordUsernames();

      const allDiscordUsernamesWithoutBookedCall =
        await discordService.findDiscordUsernamesWithoutBookedCall(
          allDiscordUsernames,
          allSpreadSheetDiscordUsernames
        );

      if (message.channelId === channelIdWithBotPermission) {
        switch (command) {
          case "notbooked":
            message.reply(
              `The following Discord users have not booked an onboarding call: ${allDiscordUsernames}`
            );
            break;
          case "notify":
            message.reply(
              `The following Discord users have not booked an onboarding call: ${allDiscordUsernames}. I have now sent a message to each of them reminding them to book a call.`
            );
            discordBotService.messageDiscordUsersWithoutBookedCall(
              client,
              allDiscordUsernamesWithoutBookedCall,
              message
            );
            break;
          case "help":
            message.reply(
              `You can issue the following commands: 

              !notbooked - this will tell you which Discord users have not booked an onboarding call.
              !notify - this will send a message to each Discord user without a booked onboarding call, reminding them to book.
              `
            );
            break;
          // TODO: add functionality for bot to remove users from Discord
          case "execute":
            // message.reply(
            //   `The following Discord users have not booked an onboarding call: ${allDiscordUsernames}. Do I have permission to publicly execute them (yes/no)?`
            // );
            break;
        }
      } else if (command && message.channelId !== channelIdWithBotPermission) {
        message.reply(
          `You do not have permission to use this Bot. Only those in the ${channelNameWithBotPermission} channel can use it.`
        );
      }
    });
  }

  public async messageDiscordUsersWithoutBookedCall(
    client: Client<boolean>,
    usernames: string[],
    message: Message<boolean>
  ): Promise<Message<boolean> | undefined> {
    const discordService = await DiscordService.get();
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
        return;
      } catch (error) {
        // message.channel.send(
        //   "User has DMs closed or has no mutual servers with the bot:("
        // );

        // This is currently being triggered once because the 'Discord Testing'
        // bot is included in the array of allDiscordUserIds, and obviously someone
        // cannot message themself. The bot tries to message itself and throws this error.
        // TODO: To fix this, all I need to do is add a conditional if statement to make sure
        // the username/userId does not equal that of the bot.

        throw new Error(`error is ${error}`);
      }
    }

    return;
  }
}
