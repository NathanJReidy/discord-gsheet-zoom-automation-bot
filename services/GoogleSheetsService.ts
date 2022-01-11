import dotenv from "dotenv";
import { google } from "googleapis";
import { GOOGLE_APPLICATION_CREDENTIALS } from "../config/service_account_credentials";
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const sheets = google.sheets("v4");
dotenv.config();

type spreadsheetInput = {
  spreadsheetId: string;
  auth: any;
};

type spreadsheetValuesInput = {
  spreadsheetId: string;
  auth: any;
  sheetName: string;
};

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

  async getSpreadSheet({ spreadsheetId, auth }: spreadsheetInput) {
    const res = await sheets.spreadsheets.get({
      spreadsheetId,
      auth,
    });
    return res;
  }

  async getSpreadSheetValues({
    spreadsheetId,
    auth,
    sheetName,
  }: spreadsheetValuesInput): Promise<any> {
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
  async getAllSpreadSheetDiscordUsernames(): Promise<string> {
    try {
      const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID as string;
      const sheetName = process.env.GOOGLE_SHEET_NAME as string;
      const auth = await this.getAuthToken();
      const response = await this.getSpreadSheetValues({
        spreadsheetId,
        sheetName,
        auth,
      });
      const allSpreadSheetDiscordUsernames = JSON.stringify(
        response.data.values
          .map((user: any) => user[2]) // the third column (second index) is the "Discord Username" column in the Google Sheet
          .filter(
            (discordUsername: any) => discordUsername !== "Discord Username"
          ) // exclude "Discord Username" header
      );
      return allSpreadSheetDiscordUsernames;
    } catch (error: any) {
      throw new Error(`${error.message} ${error.stack}`);
    }
  }
}
