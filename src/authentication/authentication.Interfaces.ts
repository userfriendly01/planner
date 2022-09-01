export const enum tabNames {
  USER_MANAGEMENT = "User Management",
  PROFILE_SETTINGS = "Profile Settings",
  CLOSED_MESSAGE = "Closed Message",
  FLASH_MESSAGE = "Flash Message",
  ROUTING_RULES = "Routing Rules",
  CALL_FLOW_MANAGEMENT = "Call Flow Management"
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