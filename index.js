import { DiscordService } from "./services/DiscordService.js";
import { UtilitiesService } from "./services/UtilitiesService.js";

const discordService = new DiscordService();
console.log(await discordService.getDiscordUsernames());

const utilitiesService = new UtilitiesService();
// console.log(await utilitiesService.findDiscordUsernamesWithoutBookedCall());
