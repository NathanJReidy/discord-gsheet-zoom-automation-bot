"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateDiscordUsernamesToGSheet = void 0;
const GoogleSheetsService_1 = require("../services/GoogleSheetsService");
const migrateDiscordUsernamesToGSheet = async () => {
    const googleSheetsService = await GoogleSheetsService_1.GoogleSheetsService.get();
    googleSheetsService.postAllDiscordUsernamesToSpreadSheet();
};
exports.migrateDiscordUsernamesToGSheet = migrateDiscordUsernamesToGSheet;
(0, exports.migrateDiscordUsernamesToGSheet)();
//# sourceMappingURL=MigrateDiscordUsernamesToGSheet.js.map