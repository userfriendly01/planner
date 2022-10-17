import {
  runTritonAdminStartup,
  runAlohaRoutingStartup,
  runAlohaFlowStartup
} from "./startups";

import {
  ManagementWrapper,
  ProfileSettingsContainer,
  CallflowManagementWrapper,
  AlohaRoutingContainer,
  AlohaFlowContainer
} from "components";
// import ProfileSettingsContainer from "../components/tabs/profilesettings/ProfileSettingsContainer/ProfileSettingsContainer";
// import CallflowManagementWrapper from "../components/tabs/callflowmanagement/CallFlowManagementWrapper/CallFlowManagementWrapper";
// import AlohaRoutingContainer from "../components/tabs/alohaRouting/AlohaRoutingContainer";
// import AlohaFlowContainer from "../components/tabs/alohaFlow/AlohaFlowContainer";

export const descriptions = {
  Triton: "The Triton developers & admins use these tabs for Triton user management, Triton profile settings, and managing closed and flash messages for IVRs leading to Twilio and Triton.",
  Aloha_Routing: "",
  Aloha_Flow: ""
};

export enum Environments {
  DEV = "development",
  TEST = "test",
  PROD = "production"
}

export const startupProfiles = {
  TRITON: {
    name: "triton",
    function: runTritonAdminStartup
  },
  ALOHA_ROUTE: {
    name: "aloha-route",
    function: runAlohaRoutingStartup
  },
  ALOHA_FLOW: {
    name: "aloha-flow",
    function: runAlohaFlowStartup
  }
};

export const Tabs =  {
  TRITON_USER_MANAGEMENT: {
    value: "triton-user-management",
    label: "User Management",
    component: ManagementWrapper
  },
  TRITON_PROFILE_SETTINGS: {
    value: "triton-profile-settings",
    label: "Profile Settings",
    component: ProfileSettingsContainer
  },
  TRITON_CALL_FLOW_MANAGEMENT: {
    value: "triton-callflow-management",
    label: "Call Flow Management",
    component: CallflowManagementWrapper
  },
  ALOHA_CALL_FLOW_MANAGEMENT: {
    value: "aloha-callflow-management",
    label: "Call Flow Management",
    component: AlohaFlowContainer
  },
  ALOHA_ROUTING_RULES: {
    value: "aloha-routing-rules",
    label: "Routing Rules",
    component: AlohaRoutingContainer
  }
};

export const enum Permissions {
  READ = "read",
  WRITE = "write"
}

export interface AuthenticationProfile {
  name: string,
  permissionLevel: string,
  tabs: any[],
  isAdmin?: boolean,
  profileId?: number | string | null
}

export interface AuthenticationProfileOptions {
  TRITON: AuthenticationProfile,
  ALOHA_FLOW: AuthenticationProfile,
  ALOHA_ROUTE: AuthenticationProfile
}