"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class ZoomService {
    constructor() { }
    static async get() {
        if (!ZoomService.instance) {
            ZoomService.instance = new ZoomService();
        }
        return ZoomService.instance;
    }
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
exports.ZoomService = ZoomService;
//# sourceMappingURL=ZoomService.js.map