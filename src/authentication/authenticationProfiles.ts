import {
  AuthenticationProfileOptions,
  descriptions,
  Environments,
  Permissions,
  runTritonAdminStartup,
  runAlohaRoutingStartup,
  runAlohaFlowStartup,
  runDynamicCallFlowStartup
} from "authentication";
import {
  AlohaFlowContainer,
  AlohaRoutingContainer,
  TritonUsersViewWrapper
} from "components";
import DynamicCallFlowPhoneNumberContainer
  from "../components/tabs/dynamicCallFlowPhoneNumber/DynamicCallFlowPhoneNumberContainer";

export const getAuthenticationProfileTemplates = (): AuthenticationProfileOptions => {
  const Tabs = getTabs();
  return {
    TRITON: {
      name: "Triton",
      permissionLevel: Permissions.READ,
      isAdmin: false,
      profileId: null,
      home: TritonUsersViewWrapper,
      tabs: [
        Tabs.TRITON_USER_MANAGEMENT,
        Tabs.ORG_MANAGEMENT,
        Tabs.TRITON_CALL_FLOW_MANAGEMENT
      ]
    },
    ALOHA_ROUTE: {
      name: "Aloha Route",
      home: AlohaRoutingContainer,
      permissionLevel: Permissions.READ,
      tabs: [
        Tabs.ALOHA_ROUTING_RULES
      ]
    },
    ALOHA_FLOW: {
      name: "Aloha Flow",
      home: AlohaFlowContainer,
      permissionLevel: Permissions.READ,
      tabs: [
        Tabs.ALOHA_CALL_FLOW_MANAGEMENT
      ]
    },
    DYNAMIC_CALL_FLOW: {
      name: "Dynamic Call Flow",
      home: DynamicCallFlowPhoneNumberContainer,
      permissionLevel: Permissions.READ,
      tabs: [
        Tabs.DYNAMIC_CALL_FLOW_MANAGEMENT
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
      adGroup: "GPI-CCT-CONFIG-FLOW-READWRITE-NP",
      environments: [Environments.DEV, Environments.TEST],
      permissionLevel: Permissions.WRITE,
      startup: startupProfiles.DYNAMIC_CALL_FLOW,
      description: descriptions.Dynami_Call_Flow,
      authenticationProfile: authenticationProfileTemplates.DYNAMIC_CALL_FLOW
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
    },
    DYNAMIC_CALL_FLOW: {
      name: "dynamic-call-flow",
      function: runDynamicCallFlowStartup
    }
  };
};

export const getTabs = (): any => {
  return {
    TRITON_USER_MANAGEMENT: {
      value: "triton-user-management",
      label: "User Management",
      route: "triton-admin/triton-users",
      dropdown: [
        {
          route: "triton-admin/triton-users",
          label: "Triton User Management"
        },
        {
          route: "triton-admin/wfm-users",
          label: "WFM User Management"
        },
        {
          route: "triton-admin/user",
          label: "Onboard New User"
        },
        {
          route: "triton-admin/profiles",
          label: "Compare User Profiles"
        },
        {
          route: "triton-admin/bulk",
          label: "Bulk Changes"
        }
      ]
    },
    ORG_MANAGEMENT: {
      value: "org-management",
      label: "Org Management",
      route: "/triton-admin/profile-settings",
      dropdown: [
        {
          route: "triton-admin/profile-settings",
          label: "Triton Profile Settings"
        },
        {
          route: "triton-admin/profile-dial-list",
          label: "Triton Profile Dial List"
        },
        {
          route: "triton-admin/profile-directory",
          label: "Triton Profile Directory"
        },
        {
          route: "triton-admin/calabrio-org",
          label: "Calabrio Organization"
        },
        {
          route: "triton-admin/calabrio-roles",
          label: "Calabrio Roles"
        }
      ]
    },
    TRITON_CALL_FLOW_MANAGEMENT: {
      value: "triton-callflow-management",
      label: "Call Flow Management",
      route: "/triton-admin/skill-management",
      dropdown: [
        {
          route: "triton-admin/skill-management",
          label: "Skill Management"
        },
        {
          route: "triton-admin/tfn-activation",
          label: "TFN Activation"
        }
      ]
    },
    ALOHA_CALL_FLOW_MANAGEMENT: {
      value: "aloha-callflow-management",
      label: "Call Flow DB Management",
      route: "/triton-admin/aloha-flow",
      dropdown: [
        {
          route: "/triton-admin/aloha-flow",
          label: "Call Flow"
        },
        {
          route: "/triton-admin/dyn-flow",
          label: "Dynamic Call Flow"
        }
      ]
    },
    DYNAMIC_CALL_FLOW_MANAGEMENT: {
      value: "dynamic-call-flow-management",
      label: "Dynamic Call Flow",
      route: "/triton-admin/dynamic-call-flow",
      dropdown: [
        {
          route: "/triton-admin/dynamic-call-flow-phone-number",
          label: "Dynamic Call Flow Phone Number"
        },
        {
          route: "/triton-admin/dynamic-call-flow-action",
          label: "Dynamic Call Flow Action"
        }
      ]
    },
    ALOHA_ROUTING_RULES: {
      value: "aloha-routing-rules",
      label: "Routing Rules",
      route: "/triton-admin/aloha-routing",
      dropdown: null
    }
  };
};