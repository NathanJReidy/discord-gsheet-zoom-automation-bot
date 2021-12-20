import dotenv from "dotenv";
dotenv.config();

export class ZoomService {
  /**
   * This returns everyone who has
   * booked an onboarding call but who has not attended
   * a Zoom call
   * */
  async getAllZoomNonAttendees(zoomAttendeesEmails, gsheetEmails) {
    // if Zoom call scheduled date is in the past (from gsheet column), return allZoomNonAttendees
  }

  async getAllZoomAttendees() {
    // do stuff
  }
}
