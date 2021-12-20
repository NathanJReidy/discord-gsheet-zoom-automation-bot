import { DiscordService } from "./services/DiscordService.js";
import { UtilitiesService } from "./services/UtilitiesService.js";
import { GoogleSheetsService } from "./services/GoogleSheetsService.js";

const discordService = new DiscordService();
const allDiscordUsernames = await discordService.getAllDiscordUsernames();

// const utilitiesService = new UtilitiesService();

const googleSheetsService = new GoogleSheetsService();
const allSpreadSheetDiscordUsernames =
  await googleSheetsService.getAllSpreadSheetDiscordUsernames();

console.log(
  await discordService.findDiscordUsernamesWithoutBookedCall(
    allDiscordUsernames,
    allSpreadSheetDiscordUsernames
  )
);
