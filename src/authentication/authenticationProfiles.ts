import {
  tabNames,
  permissions,
  authenticationStartups,
  authenticationProfileOptions
} from "./authentication.Interfaces";

export const authenticationProfiles: authenticationProfileOptions = {
  TRITON: {
    permissions: permissions.WRITE,
    adGroups: JSON.parse(process.env.TRITON_AUTH_AD_GROUPS),
    tabs: [
      tabNames.USER_MANAGEMENT,
      tabNames.PROFILE_SETTINGS,
      tabNames.CLOSED_MESSAGE,
      tabNames.FLASH_MESSAGE
    ],
    startup: authenticationStartups.TRITON,
    description: "The Triton devs & admins use these tabs for Triton user management, Triton profile settings, and managing closed and flash messages for IVRs leading to Twilio and Triton."
  },
  ALOHA_READ: {
    permissions: permissions.READ,
    adGroups: JSON.parse(process.env.TRITON_AUTH_AD_GROUPS),
    tabs: [
      tabNames.ROUTING_RULES
    ],
    startup: authenticationStartups.ALOHA,
    description: "The Aloha team uses Triton admin to update routing rules for their callflows."
  },
  ALOHA_WRITE: {
    permissions: permissions.WRITE,
    adGroups: JSON.parse(process.env.TRITON_AUTH_AD_GROUPS),
    tabs: [
      tabNames.ROUTING_RULES
    ],
    startup: authenticationStartups.ALOHA,
    description: ""
  }
};