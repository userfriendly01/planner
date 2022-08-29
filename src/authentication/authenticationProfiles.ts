export const enum tabNames {
  USER_MANAGEMENT = "User Management",
  PROFILE_SETTINGS = "Profile Settings",
  CLOSED_MESSAGE = "Closed Message",
  FLASH_MESSAGE = "Flash Message",
  ROUTING_RULES = "Routing Rules"
}

export const enum permissions {
  READ = "read",
  WRITE = "write"
}

export const enum authenticationStartups {
  TRITON = "cct-triton-tritonadmin",
  ALOHA = "cct-aloha-tritonadmin"
}
export interface authenticationProfile {
  permissions: permissions,
  adGroups: string[],
  tabs: tabNames[],
  startup: authenticationStartups,
  description?: string
}

export interface authenticationProfileOptions {
  TRITON: authenticationProfile,
  ALOHA_READ: authenticationProfile,
  ALOHA_WRITE: authenticationProfile
}

console.log("ENVIRONMENT AD GROUPS - process.env.TRITON_AUTH_AD_GROUPS", process.env.TRITON_AUTH_AD_GROUPS);
console.log("ENVIRONMENT AD GROUPS - ALOHA_AUTH_AD_GROUPS", process.env.ALOHA_AUTH_AD_GROUPS);

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