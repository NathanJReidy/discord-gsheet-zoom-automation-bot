"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSheetsService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const googleapis_1 = require("googleapis");
const service_account_credentials_1 = require("../config/service_account_credentials");
const DiscordService_1 = require("./DiscordService");
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const sheets = googleapis_1.google.sheets("v4");
dotenv_1.default.config();
class GoogleSheetsService {
    constructor() { }
    static async get() {
        if (!GoogleSheetsService.instance) {
            GoogleSheetsService.instance = new GoogleSheetsService();
        }
        return GoogleSheetsService.instance;
    }
    async getAuthToken() {
        const auth = new googleapis_1.google.auth.GoogleAuth({
            scopes: SCOPES,
            projectId: process.env.GCLOUD_PROJECT,
            credentials: service_account_credentials_1.GOOGLE_APPLICATION_CREDENTIALS,
        });
        const authToken = await auth.getClient();
        return authToken;
    }
    async getSpreadSheet({ spreadsheetId, auth, }) {
        const res = await sheets.spreadsheets.get({
            spreadsheetId,
            auth,
        });
        return res;
    }
    async getSpreadSheetValues({ spreadsheetId, auth, sheetName, }) {
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId,
            auth,
            range: sheetName,
        });
        return res;
    }
    /**
     * This returns all the Discord Usernames from
     * the Google Sheet, which will be everyone who has
     * booked an onboarding call.
     * */
    async getAllSpreadSheetDiscordUsernames() {
        try {
            const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
            const sheetName = process.env.GOOGLE_SHEET_NAME;
            const auth = await this.getAuthToken();
            const response = await this.getSpreadSheetValues({
                spreadsheetId,
                sheetName,
                auth,
            });
            if (!response) {
                throw new Error(`No response for getSpreadSheetValues`);
            }
            const allSpreadSheetDiscordUsernames = response.data.values
                ?.map((user) => user[2]) // the third column (second index) is the "Discord Username" column in the Google Sheet
                .filter((discordUsername) => discordUsername !== "Discord Username"); // exclude "Discord Username" header
            return allSpreadSheetDiscordUsernames;
        }
        catch (error) {
            throw new Error(`${error.message} ${error.stack}`);
        }
    }
    async postAllDiscordUsernamesToSpreadSheet() {
        const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
        const sheetName = process.env.GOOGLE_SHEET_NAME;
        const auth = await this.getAuthToken();
        const discordService = await DiscordService_1.DiscordService.get();
        const allDiscordUsernames = await discordService.getAllDiscordUsernames();
        // Needs to be formatted like [["discord username one"], ["another user"], ["a third user"]]
        // in otder to post to Google Sheets
        const allDiscordUsernamesEachInArr = allDiscordUsernames.map((username) => [username]);
        const request = {
            spreadsheetId: spreadsheetId,
            range: `${sheetName}!C2`,
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            resource: {
                majorDimension: "ROWS",
                // values: [allDiscordUsernames],
                values: allDiscordUsernamesEachInArr,
            },
            auth,
        };
        try {
            const response = (await sheets.spreadsheets.values.append(request)).data;
            // TODO: Change code below to process the `response` object:
            console.log(JSON.stringify(response, null, 2));
        }
        catch (err) {
            throw new Error(err);
        }
    }
}
exports.GoogleSheetsService = GoogleSheetsService;
//# sourceMappingURL=GoogleSheetsService.js.map