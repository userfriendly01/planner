// Keeping these here for now, but should live in a shared interfaces location in the 
// ✨ FUTURE ✨. Or maybe this is a good pattern, who knows, I sure don't
export interface TwilioConsoleRole {
  sid: string;
  name: string;
  accountSid: string;
  accountName: string;
}

export interface TwilioConsoleUser {
  sid: string;
  firstName: string;
  lastName: string;
  twilioActive: boolean;
  hrActive: boolean;
  email: string;
  roles: TwilioConsoleRole[];
}
