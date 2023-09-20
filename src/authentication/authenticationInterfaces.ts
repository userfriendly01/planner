export const descriptions = {
  Triton: "The Triton developers & admins use these tabs for Triton user management, Organization Management, and managing closed and flash messages for IVRs leading to Twilio and Triton.",
  Aloha_Routing: "",
  Aloha_Flow: ""
};

export enum Environments {
  DEV = "development",
  TEST = "test",
  PROD = "production"
}

export const enum Permissions {
  READ = "read",
  WRITE = "write"
}

export interface AuthenticationProfile {
  name: string,
  permissionLevel: string,
  home: any,
  tabs: any[],
  isAdmin?: boolean,
  profileId?: number | string | null
}

export interface AuthenticationProfileOptions {
  TRITON: AuthenticationProfile,
  ALOHA_FLOW: AuthenticationProfile,
  ALOHA_ROUTE: AuthenticationProfile
}