export const descriptions = {
  Triton: "The Triton developers & admins use these tabs for Triton user management, Organization Management, and managing closed and flash messages for IVRs leading to Twilio and Triton.",
  Aloha_Routing: "",
  Aloha_Flow: ""
};

export const enum Permissions {
  READ = "read",
  WRITE = "write"
}

export interface AuthenticationProfile {
  name: string,
  permissionLevel: string,
  home: any,
  tabs: any[],
}

export interface AuthenticationProfileOptions {
  TRITON: AuthenticationProfile,
  ALOHA_FLOW: AuthenticationProfile,
  ALOHA_ROUTE: AuthenticationProfile
}