import { GaxiosResponse } from "gaxios";
import { BaseExternalAccountClient, Compute, Impersonated, JWT, UserRefreshClient } from "google-auth-library";
import { sheets_v4 } from "googleapis";
declare type SpreadsheetInput = {
    spreadsheetId: string;
    auth: Compute | JWT | UserRefreshClient | Impersonated | BaseExternalAccountClient;
};
declare type SpreadsheetValuesInput = {
    spreadsheetId: string;
    auth: Compute | JWT | UserRefreshClient | Impersonated | BaseExternalAccountClient;
    sheetName: string;
};
export declare class GoogleSheetsService {
    private static instance;
    static get(): Promise<GoogleSheetsService>;
    private constructor();
    getAuthToken(): Promise<Compute | JWT | UserRefreshClient | Impersonated | BaseExternalAccountClient>;
    getSpreadSheet({ spreadsheetId, auth, }: SpreadsheetInput): Promise<GaxiosResponse<sheets_v4.Schema$Spreadsheet>>;
    getSpreadSheetValues({ spreadsheetId, auth, sheetName, }: SpreadsheetValuesInput): Promise<GaxiosResponse<sheets_v4.Schema$ValueRange>>;
    /**
     * This returns all the Discord Usernames from
     * the Google Sheet, which will be everyone who has
     * booked an onboarding call.
     * */
    getAllSpreadSheetDiscordUsernames(): Promise<any>;
}
export {};
