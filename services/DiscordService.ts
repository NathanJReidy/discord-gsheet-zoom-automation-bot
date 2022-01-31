import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

export class DiscordService {
  private static instance: DiscordService;
  public static async get(): Promise<DiscordService> {
    if (!DiscordService.instance) {
      DiscordService.instance = new DiscordService();
    }
    return DiscordService.instance;
  }

  private constructor() {}

  public async getAllDiscordUsernames(): Promise<any> {
    let allDiscordUsernames: any[] = [];
    let lastUserId = 0;
    while (true) {
      const response = await axios.get(
        `${process.env.DISCORD_BASE_URL}/guilds/${process.env.GUILD_ID}/members?query=""&limit=1000&after=${lastUserId}`,
        {
          headers: {
            Content_Type: "application/json",
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          },
        }
      );

      if (!response.data || response.data.length === 1) {
        return allDiscordUsernames;
      }

      const allDiscordUsernamesFromResponse = response.data
        .map((member: any) => member.user.username)
        .filter((username: any) => username != process.env.DISCORD_BOT_NAME); // exclude the Discord Bot from the returned allDiscordUsernames

      allDiscordUsernames.push(...allDiscordUsernamesFromResponse);

      lastUserId = Math.max.apply(
        null,
        response.data.map((member: any) => member.user.id)
      ); // assign the highest user id in the array
    }
  }

  /**
   * This returns the people who have accepted a Discord invitation
   * but have not booked an onboarding call
   * */
  public async findDiscordUsernamesWithoutBookedCall(
    discordUsernames: any,
    gsheetDiscordUsernames: any
  ): Promise<any> {
    const formattedDiscordUsernames = discordUsernames.map((i: any) =>
      i.split(" ").join("").toLowerCase()
    ); // remove spaces and make lowercase

    const formattedGsheetDiscordUsernames = gsheetDiscordUsernames.map(
      (i: any) => i.split(" ").join("").toLowerCase()
    ); // remove spaces and make lowercase

    const discordUsernamesWithoutBookedCall = formattedDiscordUsernames.filter(
      (x: any) => !formattedGsheetDiscordUsernames.includes(x)
    );

    return discordUsernamesWithoutBookedCall;
  }

  public async getAllDiscordUserIds(): Promise<any> {
    const response = await axios.get(
      `${process.env.DISCORD_BASE_URL}/guilds/${process.env.GUILD_ID}/members?query=""&limit=1000`,
      {
        headers: {
          Content_Type: "application/json",
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );
    const allDiscordUserIds = response.data.map(
      (member: any) => member.user.id
    );
    if (!allDiscordUserIds) {
      throw new Error("There was no result for allDiscordUserIds");
    }

    return allDiscordUserIds;
  }

  public async getAllDiscordUsers(): Promise<any> {
    const response = await axios.get(
      `${process.env.DISCORD_BASE_URL}/guilds/${process.env.GUILD_ID}/members?query=""&limit=1000`,
      {
        headers: {
          Content_Type: "application/json",
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );
    const allDiscordUsers = response.data.map((member: any) => member.user);
    if (!allDiscordUsers) {
      throw new Error("There was no result for allDiscordUsers");
    }
    return allDiscordUsers;
  }

  public async getDiscordIdsFromUsernames(usernames: string[]): Promise<any> {
    const allDiscordUsers = await this.getAllDiscordUsers();
    const discordUsersFilteredByUsernames = allDiscordUsers.filter(
      (user: any) => usernames.includes(user.username)
    );
    const discordUserIdsFilteredByUsernames =
      discordUsersFilteredByUsernames.map((user: any) => user.id);

    return discordUserIdsFilteredByUsernames;
  }

  public async getAllDiscordGuildChannels(): Promise<any> {
    const response = await axios.get(
      `${process.env.DISCORD_BASE_URL}/guilds/${process.env.GUILD_ID}/channels`,
      {
        headers: {
          Content_Type: "application/json",
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );

    const allDiscordGuildChannels = response.data.map(
      (guildChannel: any) => guildChannel
    );

    return allDiscordGuildChannels;
  }
}
