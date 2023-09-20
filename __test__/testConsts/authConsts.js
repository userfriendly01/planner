export const mockRunTritonStartup = jest.fn();
export const mockRunAlohaRoutingStartup = jest.fn();
export const mockRunAlohaFlowStartup = jest.fn();

export const descriptions = {
  Triton: "Test Triton Description",
  Aloha_Routing: "Test Aloha Routing Description",
  Aloha_Flow: "Test Aloha Flow Description"
};

export const tabs = {
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
        route: "triton-admin/user",
        label: "Onboard New User"
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
        label: "Profile Dial List"
      },
      {
        route: "triton-admin/profile-directory",
        label: "Profile Directory"
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
    label: "Aloha Flow Management",
    dropdown: null
  },
  ALOHA_ROUTING_RULES: {
    value: "aloha-routing-rules",
    label: "Routing Rules",
    dropdown: null
  }
};

export const startups = {
  TRITON: {
    name: "triton",
    function: mockRunTritonStartup
  },
  ALOHA_ROUTE: {
    name: "aloha-route",
    function: mockRunAlohaRoutingStartup
  },
  ALOHA_FLOW: {
    name: "aloha-flow",
    function: mockRunAlohaFlowStartup
  }
};

export const authenticationProfileTemplates = {
  TRITON: {
    name: "Triton",
    permissionLevel: "read",
    isAdmin: false,
    profileId: null,
    tabs: [
      tabs.TRITON_USER_MANAGEMENT,
      tabs.ORG_MANAGEMENT,
      tabs.TRITON_CALL_FLOW_MANAGEMENT
    ]
  },
  ALOHA_ROUTE: {
    name: "Aloha Route",
    permissionLevel: "read",
    tabs: [
      tabs.ALOHA_ROUTING_RULES
    ]
  },
  ALOHA_FLOW: {
    name: "Aloha Flow",
    permissionLevel: "read",
    tabs: [
      tabs.ALOHA_CALL_FLOW_MANAGEMENT
    ]
  }
};

export const adGroupPermissionMapping = [
  {
    adGroup: "GCI-CCT-TRITON-DEV-TRITONADMIN",
    environments: ["development"],
    permissionLevel: "write",
    startup: startups.TRITON,
    description: descriptions.Triton,
    authenticationProfile: authenticationProfileTemplates.TRITON
  },
  {
    adGroup: "GCI-CCT-TRITON-TEST-TRITONADMIN",
    environments: ["test"],
    permissionLevel: "write",
    startup: startups.TRITON,
    description: descriptions.Triton,
    authenticationProfile: authenticationProfileTemplates.TRITON
  },
  {
    adGroup: "GCI-CCT-TRITON-PROD-TRITONADMIN",
    environments: ["production"],
    permissionLevel: "write",
    startup: startups.TRITON,
    description: descriptions.Triton,
    authenticationProfile: authenticationProfileTemplates.TRITON
  },
  {
    adGroup: "GPI-CCT-CONFIG-FLOW-READ",
    environments: ["development", "test", "production"],
    permissionLevel: "read",
    startup: startups.ALOHA_FLOW,
    description: descriptions.Aloha_Flow,
    authenticationProfile: authenticationProfileTemplates.ALOHA_FLOW
  },
  {
    adGroup: "GPI-CCT-CONFIG-FLOW-READWRITE-NP",
    environments: ["development", "test"],
    permissionLevel: "write",
    startup: startups.ALOHA_FLOW,
    description: descriptions.Aloha_Flow,
    authenticationProfile: authenticationProfileTemplates.ALOHA_FLOW
  },
  {
    adGroup: "GPI-CCT-CONFIG-FLOW-READWRITE-PROD",
    environments: ["production"],
    permissionLevel: "write",
    startup: startups.ALOHA_FLOW,
    description: descriptions.Aloha_Flow,
    authenticationProfile: authenticationProfileTemplates.ALOHA_FLOW
  },
  {
    adGroup: "GPI-CCT-CONFIG-ROUTE-READ",
    environments: ["development", "test", "production"],
    permissionLevel: "read",
    startup: startups.ALOHA_ROUTE,
    description: descriptions.Aloha_Routing,
    authenticationProfile: authenticationProfileTemplates.ALOHA_ROUTE
  },
  {
    adGroup: "GPI-CCT-CONFIG-ROUTE-READWRITE-NP",
    environments: ["development", "test"],
    permissionLevel: "write",
    startup: startups.ALOHA_ROUTE,
    description: descriptions.Aloha_Routing,
    authenticationProfile: authenticationProfileTemplates.ALOHA_ROUTE
  },
  {
    adGroup: "GPI-CCT-CONFIG-ROUTE-READWRITE-PROD",
    environments: ["production"],
    permissionLevel: "write",
    startup: startups.ALOHA_ROUTE,
    description: descriptions.Aloha_Routing,
    authenticationProfile: authenticationProfileTemplates.ALOHA_ROUTE
  }
];