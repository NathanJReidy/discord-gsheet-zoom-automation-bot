import { Client, Intents } from "discord.js";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

export class DiscordService {
  async getAllDiscordUsernames() {
    const response = await axios.get(
      `${process.env.DISCORD_BASE_URL}/guilds/${process.env.TEST_GUILD_ID}/members?query=""&limit=1000`,
      {
        headers: {
          Content_Type: "application/json",
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );

    const allDiscordUsernames = response.data.map(
      (member) => member.user.username
    );

    return allDiscordUsernames;
  }

  /**
   * This returns the people who have accepted a Discord invitation
   * but have not booked an onboarding call
   * */
  async findDiscordUsernamesWithoutBookedCall(
    discordUsernames,
    gsheetDiscordUsernames
  ) {
    const discordUsernamesWithoutBookedCall = discordUsernames.filter(
      (x) => !gsheetDiscordUsernames.includes(x)
    );

    return discordUsernamesWithoutBookedCall;
  }

  async getAllDiscordUserIds() {
    const response = await axios.get(
      `${process.env.DISCORD_BASE_URL}/guilds/${process.env.TEST_GUILD_ID}/members?query=""&limit=1000`,
      {
        headers: {
          Content_Type: "application/json",
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );
    const allDiscordUserIds = response.data.map((member) => member.user.id);
    if (!allDiscordUserIds) {
      throw new Error("There was no result for allDiscordUserIds");
    }

    return allDiscordUserIds;
  }

  async getAllDiscordUsers() {
    const response = await axios.get(
      `${process.env.DISCORD_BASE_URL}/guilds/${process.env.TEST_GUILD_ID}/members?query=""&limit=1000`,
      {
        headers: {
          Content_Type: "application/json",
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );
    const allDiscordUsers = response.data.map((member) => member.user);
    if (!allDiscordUsers) {
      throw new Error("There was no result for allDiscordUsers");
    }
    return allDiscordUsers;
  }

  async getDiscordIdsFromUsernames(usernames) {
    const allDiscordUsers = await this.getAllDiscordUsers();
    const discordUsersFilteredByUsernames = allDiscordUsers.filter((user) =>
      usernames.includes(user.username)
    );
    const discordUserIdsFilteredByUsernames =
      discordUsersFilteredByUsernames.map((user) => user.id);

    return discordUserIdsFilteredByUsernames;
  }
}
