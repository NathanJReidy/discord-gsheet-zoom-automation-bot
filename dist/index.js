"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DiscordBotService_1 = require("./services/DiscordBotService");
const startBot = async () => {
    const discordBotService = await DiscordBotService_1.DiscordBotService.get();
    discordBotService.startAdminBot();
};
startBot();
//# sourceMappingURL=index.js.map