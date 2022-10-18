import {
  AuthenticationProfileOptions,
  descriptions,
  Environments,
  Permissions,
  runTritonAdminStartup,
  runAlohaRoutingStartup,
  runAlohaFlowStartup
} from "authentication";
import {
  ManagementWrapper,
  ProfileSettingsContainer,
  CallflowManagementWrapper,
  AlohaRoutingContainer,
  AlohaFlowContainer
} from "components";

export const getAuthenticationProfileTemplates = (): AuthenticationProfileOptions => {
  const Tabs = getTabs();
  return {
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
};

export const getAdGroupPermissionMapping = () => {
  const startupProfiles = getStartupProfiles();
  const authenticationProfileTemplates = getAuthenticationProfileTemplates();

  return [
    {
      adGroup: "GCI-CCT-TRITON-DEV-TRITONADMIN",
      environments: [Environments.DEV],
      permissionLevel: Permissions.WRITE,
      startup: startupProfiles.TRITON,
      description: descriptions.Triton,
      authenticationProfile: authenticationProfileTemplates.TRITON
    },
    {
      adGroup: "GCI-CCT-TRITON-TEST-TRITONADMIN",
      environments: [Environments.TEST],
      permissionLevel: Permissions.WRITE,
      startup: startupProfiles.TRITON,
      description: descriptions.Triton,
      authenticationProfile: authenticationProfileTemplates.TRITON
    },
    {
      adGroup: "GCI-CCT-TRITON-PROD-TRITONADMIN",
      environments: [Environments.PROD],
      permissionLevel: Permissions.WRITE,
      startup: startupProfiles.TRITON,
      description: descriptions.Triton,
      authenticationProfile: authenticationProfileTemplates.TRITON
    },
    {
      adGroup: "GPI-CCT-CONFIG-FLOW-READ",
      environments: [Environments.DEV, Environments.TEST, Environments.PROD],
      permissionLevel: Permissions.READ,
      startup: startupProfiles.ALOHA_FLOW,
      description: descriptions.Aloha_Flow,
      authenticationProfile: authenticationProfileTemplates.ALOHA_FLOW
    },
    {
      adGroup: "GPI-CCT-CONFIG-FLOW-READWRITE-NP",
      environments: [Environments.DEV, Environments.TEST],
      permissionLevel: Permissions.WRITE,
      startup: startupProfiles.ALOHA_FLOW,
      description: descriptions.Aloha_Flow,
      authenticationProfile: authenticationProfileTemplates.ALOHA_FLOW
    },
    {
      adGroup: "GPI-CCT-CONFIG-FLOW-READWRITE-PROD",
      environments: [Environments.PROD],
      permissionLevel: Permissions.WRITE,
      startup: startupProfiles.ALOHA_FLOW,
      description: descriptions.Aloha_Flow,
      authenticationProfile: authenticationProfileTemplates.ALOHA_FLOW
    },
    {
      adGroup: "GPI-CCT-CONFIG-ROUTE-READ",
      environments: [Environments.DEV, Environments.TEST, Environments.PROD],
      permissionLevel: Permissions.READ,
      startup: startupProfiles.ALOHA_ROUTE,
      description: descriptions.Aloha_Routing,
      authenticationProfile: authenticationProfileTemplates.ALOHA_ROUTE
    },
    {
      adGroup: "GPI-CCT-CONFIG-ROUTE-READWRITE-NP",
      environments: [Environments.DEV, Environments.TEST],
      permissionLevel: Permissions.WRITE,
      startup: startupProfiles.ALOHA_ROUTE,
      description: descriptions.Aloha_Routing,
      authenticationProfile: authenticationProfileTemplates.ALOHA_ROUTE
    },
    {
      adGroup: "GPI-CCT-CONFIG-ROUTE-READWRITE-PROD",
      environments: [Environments.PROD],
      permissionLevel: Permissions.WRITE,
      startup: startupProfiles.ALOHA_ROUTE,
      description: descriptions.Aloha_Routing,
      authenticationProfile: authenticationProfileTemplates.ALOHA_ROUTE
    }
  ];
};

export const getStartupProfiles = () => {
  return {
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
};

export const getTabs = () => {
  return {
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
};