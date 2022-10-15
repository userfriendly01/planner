import {
  AuthenticationProfileOptions,
  descriptions,
  Environments,
  Tabs,
  Permissions,
  startupProfiles
} from "./authenticationInterfaces";

export const authenticationProfiles: AuthenticationProfileOptions = {
  TRITON: {
    name: "Triton",
    permissionLevel: Permissions.READ,
    isAdmin: false,
    profileId: null,
    tabs: [
      Tabs.TRITON_USER_MANAGEMENT,
      Tabs.TRITON_PROFILE_SETTINGS,
      Tabs.TRITON_CALL_FLOW_MANAGEMENT
    ]
  },
  ALOHA_ROUTE: {
    name: "Aloha Route",
    permissionLevel: Permissions.READ,
    tabs: [
      Tabs.ALOHA_ROUTING_RULES
    ]
  },
  ALOHA_FLOW: {
    name: "Aloha Flow",
    permissionLevel: Permissions.READ,
    tabs: [
      Tabs.ALOHA_CALL_FLOW_MANAGEMENT
    ]
  }
};

export const adGroupPermissionMapping = [
  {
    adGroup: "GCI-CCT-TRITON-DEV-TRITONADMIN",
    environments: [Environments.DEV],
    permissionLevel: Permissions.WRITE,
    startup: startupProfiles.TRITON,
    description: descriptions.Triton,
    authenticationProfile: authenticationProfiles.TRITON
  },
  {
    adGroup: "GCI-CCT-TRITON-TEST-TRITONADMIN",
    environments: [Environments.TEST],
    permissionLevel: Permissions.WRITE,
    startup: startupProfiles.TRITON,
    description: descriptions.Triton,
    authenticationProfile: authenticationProfiles.TRITON
  },
  {
    adGroup: "GCI-CCT-TRITON-PROD-TRITONADMIN",
    environments: [Environments.PROD],
    permissionLevel: Permissions.WRITE,
    startup: startupProfiles.TRITON,
    description: descriptions.Triton,
    authenticationProfile: authenticationProfiles.TRITON
  },
  {
    adGroup: "GPI-CCT-CONFIG-FLOW-READ",
    environments: [Environments.DEV, Environments.TEST, Environments.PROD],
    permissionLevel: Permissions.READ,
    startup: startupProfiles.ALOHA_FLOW,
    description: descriptions.Aloha_Flow,
    authenticationProfile: authenticationProfiles.ALOHA_FLOW
  },
  {
    adGroup: "GPI-CCT-CONFIG-FLOW-READWRITE-NP",
    environments: [Environments.DEV, Environments.TEST],
    permissionLevel: Permissions.WRITE,
    startup: startupProfiles.ALOHA_FLOW,
    description: descriptions.Aloha_Flow,
    authenticationProfile: authenticationProfiles.ALOHA_FLOW
  },
  {
    adGroup: "GPI-CCT-CONFIG-FLOW-READWRITE-PROD",
    environments: [Environments.PROD],
    permissionLevel: Permissions.WRITE,
    startup: startupProfiles.ALOHA_FLOW,
    description: descriptions.Aloha_Flow,
    authenticationProfile: authenticationProfiles.ALOHA_FLOW
  },
  {
    adGroup: "GPI-CCT-CONFIG-ROUTE-READ",
    environments: [Environments.DEV, Environments.TEST, Environments.PROD],
    permissionLevel: Permissions.READ,
    startup: startupProfiles.ALOHA_ROUTE,
    description: descriptions.Aloha_Routing,
    authenticationProfile: authenticationProfiles.ALOHA_ROUTE
  },
  {
    adGroup: "GPI-CCT-CONFIG-ROUTE-READWRITE-NP",
    environments: [Environments.DEV, Environments.TEST],
    permissionLevel: Permissions.WRITE,
    startup: startupProfiles.ALOHA_ROUTE,
    description: descriptions.Aloha_Routing,
    authenticationProfile: authenticationProfiles.ALOHA_ROUTE
  },
  {
    adGroup: "GPI-CCT-CONFIG-ROUTE-READWRITE-PROD",
    environments: [Environments.PROD],
    permissionLevel: Permissions.WRITE,
    startup: startupProfiles.ALOHA_ROUTE,
    description: descriptions.Aloha_Routing,
    authenticationProfile: authenticationProfiles.ALOHA_ROUTE
  }
];