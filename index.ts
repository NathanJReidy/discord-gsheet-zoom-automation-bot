import { DiscordBotService } from "./services/DiscordBotService";
// import { migrateDiscordUsernamesToGSheet } from "./scripts/MigrateDiscordUsernamesToGSheet";
const startBot = async () => {
  const discordBotService = await DiscordBotService.get();
  discordBotService.startAdminBot();

  // Change runMigrations to true to run the script to migrate
  // all current Discord usernames to the Google Sheet
  // note that the max members the Discord API allows you to fetch is 1000

  // const runMigrations = false;
  // if (runMigrations) {
  //   migrateDiscordUsernamesToGSheet();
  // }
};

startBot();
