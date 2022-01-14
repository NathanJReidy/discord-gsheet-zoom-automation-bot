import { DiscordBotService } from "./services/DiscordBotService";

const startBot = async () => {
  const discordBotService = await DiscordBotService.get();
  discordBotService.startAdminBot();
};

startBot();
