import { Client, Intents } from "discord.js";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

export class DiscordService {
  async startAdminBot() {
    const client = new Client({ intents: [Intents.FLAGS.GUILD_MEMBERS] });
    const id = process.env.TEST_GUILD_ID;
    client.login(process.env.DISCORD_BOT_TOKEN);

    client.on("ready", async () => {
      // if channel.id !== #administrative then disable commands and return a
      // message saying this bot is only available to admins
      // if channel.id === #administrative then allow all commands

      const guild = client.guilds.cache.find((guild) => guild.id === id);

      if (!guild) {
        throw new Error(`Can't find any guild with the ID "${id}"`);
      }

      const allDiscordMembers = await guild.members.fetch();
      const allDiscordMembersUsernames = allDiscordMembers.map(
        (member) => member.user.username
      );
    });
  }

  async getDiscordUsernames() {
    const response = await axios.get(
      `${process.env.DISCORD_BASE_URL}/guilds/${process.env.TEST_GUILD_ID}/members`,
      {
        headers: {
          Content_Type: "application/json",
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );
    const allDiscordMembersUsernames = response.data.map(
      (member) => member.user.username
    );
    return allDiscordMembersUsernames;
  }
}
