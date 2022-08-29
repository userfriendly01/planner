export const tabNames = {
  USER_MANAGEMENT: "User Management",
  PROFILE_SETTINGS: "Profile Settings",
  CLOSED_MESSAGE: "Closed Message",
  FLASH_MESSAGE: "Flash Message",
  ROUTING_RULES: "Routing Rules"
};

export const permissions = {
  READ: "read",
  WRITE: "write"
};

export const authenticationProfiles: any = {
  TRITON: {
    permissions: permissions.WRITE,
    adGroups: {
      PROD: "gci-cct-triton-prod-tritonadmin",
      TEST: "gci-cct-triton-test-tritonadmin",
      DEV: "gci-cct-triton-dev-tritonadmin"
    },
    tabs: [
      tabNames.USER_MANAGEMENT,
      tabNames.PROFILE_SETTINGS,
      tabNames.CLOSED_MESSAGE,
      tabNames.FLASH_MESSAGE
    ],
    startup: "cct-triton-tritonadmin",
    description: "The Triton devs & admins use these tabs for Triton user management, Triton profile settings, and managing closed and flash messages for IVRs leading to Twilio and Triton."
  },
  ALOHA_READ: {
    permissions: permissions.READ,
    adGroups: {
      PROD: "",
      TEST: "",
      DEV: ""
    },
    tabs: [
      tabNames.ROUTING_RULES
    ],
    startup: "cct-aloha-tritonadmin",
    description: "The Aloha team uses Triton admin to update routing rules for their callflows."
  },
  ALOHA_WRITE: {
    permissions: permissions.WRITE,
    adGroups: {
      PROD: "",
      TEST: "",
      DEV: ""
    },
    tabs: [
      tabNames.ROUTING_RULES
    ],
    startup: "cct-aloha-tritonadmin",
    description: ""
  }
};