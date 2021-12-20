import { DiscordService } from "./services/DiscordService.js";
import { DiscordBotService } from "./services/DiscordBotService.js";
import { UtilitiesService } from "./services/UtilitiesService.js";
import { GoogleSheetsService } from "./services/GoogleSheetsService.js";

const discordBotService = new DiscordBotService();
await discordBotService.startAdminBot();

// TODO convert project files to TypeScript
