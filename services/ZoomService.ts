import dotenv from "dotenv";
dotenv.config();

export class ZoomService {
  private static instance: ZoomService;
  public static async get(): Promise<ZoomService> {
    if (!ZoomService.instance) {
      ZoomService.instance = new ZoomService();
    }
    return ZoomService.instance;
  }

  private constructor() {}

  /**
   * This returns everyone who has
   * booked an onboarding call but who has not attended
   * a Zoom call
   * */
  async getAllZoomNonAttendees(
    zoomAttendeesEmails: string[],
    gsheetEmails: string[]
  ) {
    // if Zoom call scheduled date is in the past (from gsheet column), return allZoomNonAttendees
  }

  async getAllZoomAttendees() {
    // do stuff
  }
}
