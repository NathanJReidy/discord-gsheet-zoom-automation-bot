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
    console.log(
      `allDiscordUsernames is ${JSON.stringify(allDiscordUsernames)}`
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
    console.log(
      `allDiscordUserIds in DiscordService are ${JSON.stringify(
        allDiscordUserIds
      )}`
    );
    return allDiscordUserIds;
  }
}
