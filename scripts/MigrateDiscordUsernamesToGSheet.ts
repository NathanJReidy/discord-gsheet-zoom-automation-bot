import { GoogleSheetsService } from "../services/GoogleSheetsService";

export const migrateDiscordUsernamesToGSheet = async () => {
  const googleSheetsService = await GoogleSheetsService.get();
  googleSheetsService.postAllDiscordUsernamesToSpreadSheet();
};

migrateDiscordUsernamesToGSheet();
