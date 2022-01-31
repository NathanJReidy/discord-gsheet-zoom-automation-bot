import dotenv from "dotenv";
import { GaxiosResponse } from "gaxios";
import {
  BaseExternalAccountClient,
  Compute,
  Impersonated,
  JWT,
  UserRefreshClient,
} from "google-auth-library";
import { google, sheets_v4 } from "googleapis";
import { GOOGLE_APPLICATION_CREDENTIALS } from "../config/service_account_credentials";
import { DiscordService } from "./DiscordService";
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const sheets = google.sheets("v4");
dotenv.config();

type SpreadsheetInput = {
  spreadsheetId: string;
  auth:
    | Compute
    | JWT
    | UserRefreshClient
    | Impersonated
    | BaseExternalAccountClient;
};

type SpreadsheetValuesInput = {
  spreadsheetId: string;
  auth:
    | Compute
    | JWT
    | UserRefreshClient
    | Impersonated
    | BaseExternalAccountClient;
  sheetName: string;
};

export class GoogleSheetsService {
  private static instance: GoogleSheetsService;
  public static async get(): Promise<GoogleSheetsService> {
    if (!GoogleSheetsService.instance) {
      GoogleSheetsService.instance = new GoogleSheetsService();
    }
    return GoogleSheetsService.instance;
  }

  private constructor() {}

  public async getAuthToken(): Promise<
    Compute | JWT | UserRefreshClient | Impersonated | BaseExternalAccountClient
  > {
    const auth = new google.auth.GoogleAuth({
      scopes: SCOPES,
      projectId: process.env.GCLOUD_PROJECT,
      credentials: GOOGLE_APPLICATION_CREDENTIALS,
    });
    const authToken = await auth.getClient();
    return authToken;
  }

  public async getSpreadSheet({
    spreadsheetId,
    auth,
  }: SpreadsheetInput): Promise<GaxiosResponse<sheets_v4.Schema$Spreadsheet>> {
    const res = await sheets.spreadsheets.get({
      spreadsheetId,
      auth,
    });
    return res;
  }

  public async getSpreadSheetValues({
    spreadsheetId,
    auth,
    sheetName,
  }: SpreadsheetValuesInput): Promise<
    GaxiosResponse<sheets_v4.Schema$ValueRange>
  > {
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
  public async getAllSpreadSheetDiscordUsernames(): Promise<any> {
    try {
      const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID as string;
      const sheetName = process.env.GOOGLE_SHEET_NAME as string;
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
    } catch (error: any) {
      throw new Error(`${error.message} ${error.stack}`);
    }
  }

  public async postAllDiscordUsernamesToSpreadSheet(): Promise<any> {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID as string;
    const sheetName = process.env.GOOGLE_SHEET_NAME as string;
    const auth = await this.getAuthToken();
    const discordService = await DiscordService.get();

    const allDiscordUsernames = await discordService.getAllDiscordUsernames();
    // Needs to be formatted like [["discord username one"], ["another user"], ["a third user"]]
    // in otder to post to Google Sheets
    const allDiscordUsernamesEachInArr = allDiscordUsernames.map(
      (username: any) => [username]
    );

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
    } catch (err: any) {
      throw new Error(err);
    }
  }
}
