export declare class ZoomService {
    private static instance;
    static get(): Promise<ZoomService>;
    private constructor();
    /**
     * This returns everyone who has
     * booked an onboarding call but who has not attended
     * a Zoom call
     * */
    getAllZoomNonAttendees(zoomAttendeesEmails: string[], gsheetEmails: string[]): Promise<void>;
    getAllZoomAttendees(): Promise<void>;
}
