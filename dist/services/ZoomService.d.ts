export declare class ZoomService {
    /**
     * This returns everyone who has
     * booked an onboarding call but who has not attended
     * a Zoom call
     * */
    getAllZoomNonAttendees(zoomAttendeesEmails: string[], gsheetEmails: string[]): Promise<void>;
    getAllZoomAttendees(): Promise<void>;
}
