import dotenv from "dotenv";
dotenv.config();

export class UtilitiesService {
  /**
   * This returns the people who have accepted a Discord invitation
   * but have not booked an onboarding call
   * */
  async findDiscordUsernamesWithoutBookedCall(
    discordUsernames,
    gsheetDiscordUsernames
  ) {
    const discordUsernamesWithoutBookedCall = discordUsernames.filter(
      (x) => !gsheetDiscordUsernames.includes(x)
    );

    return discordUsernamesWithoutBookedCall;
  }
}
