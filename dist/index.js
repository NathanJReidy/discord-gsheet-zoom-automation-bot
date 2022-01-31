"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DiscordBotService_1 = require("./services/DiscordBotService");
// import { migrateDiscordUsernamesToGSheet } from "./scripts/MigrateDiscordUsernamesToGSheet";
const startBot = async () => {
    const discordBotService = await DiscordBotService_1.DiscordBotService.get();
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
//# sourceMappingURL=index.js.map