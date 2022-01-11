declare type spreadsheetInput = {
    spreadsheetId: string;
    auth: any;
};
declare type spreadsheetValuesInput = {
    spreadsheetId: string;
    auth: any;
    sheetName: string;
};
export declare class GoogleSheetsService {
    getAuthToken(): Promise<import("google-auth-library").Compute | import("google-auth-library").JWT | import("google-auth-library").UserRefreshClient | import("google-auth-library").Impersonated | import("google-auth-library").BaseExternalAccountClient>;
    getSpreadSheet({ spreadsheetId, auth }: spreadsheetInput): Promise<import("gaxios").GaxiosResponse<import("googleapis").sheets_v4.Schema$Spreadsheet>>;
    getSpreadSheetValues({ spreadsheetId, auth, sheetName, }: spreadsheetValuesInput): Promise<any>;
    /**
     * This returns all the Discord Usernames from
     * the Google Sheet, which will be everyone who has
     * booked an onboarding call.
     * */
    getAllSpreadSheetDiscordUsernames(): Promise<string>;
}
export {};
