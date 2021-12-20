import dotenv from "dotenv";
import { google } from "googleapis";
import { GOOGLE_APPLICATION_CREDENTIALS } from "../config/service_account_credentials.js";
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const sheets = google.sheets("v4");
dotenv.config();

export class GoogleSheetsService {
  async getAuthToken() {
    const auth = new google.auth.GoogleAuth({
      scopes: SCOPES,
      projectId: process.env.GCLOUD_PROJECT,
      credentials: GOOGLE_APPLICATION_CREDENTIALS,
    });
    const authToken = await auth.getClient();
    return authToken;
  }

  async getSpreadSheet({ spreadsheetId, auth }) {
    const res = await sheets.spreadsheets.get({
      spreadsheetId,
      auth,
    });
    return res;
  }

  async getSpreadSheetValues({ spreadsheetId, auth, sheetName }) {
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
      const allSpreadSheetDiscordUsernames = JSON.stringify(
        response.data.values
          .map((user) => user[2]) // the third column (second index) is the "Discord Username" column in the Google Sheet
          .filter((discordUsername) => discordUsername !== "Discord Username") // exclude "Discord Username" header
      );
      return allSpreadSheetDiscordUsernames;
    } catch (error) {
      console.log(error.message, error.stack);
    }
  }
}
