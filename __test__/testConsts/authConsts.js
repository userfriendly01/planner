export const mockRunTritonStartup = jest.fn();
export const mockRunAlohaRoutingStartup = jest.fn();
export const mockRunAlohaFlowStartup = jest.fn();
export const mockRunDynFlowStartup = jest.fn();

export const descriptions = {
  Triton: "Test Triton Description",
  Aloha_Routing: "Test Aloha Routing Description",
  Aloha_Flow: "Test Aloha Flow Description",
  Dyn_Flow: "Dynamic Flow Description"
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
  },
  DYNAMIC_FLOW: {
    name: "dyn-flow",
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
  },
  DYNAMIC_CALL_FLOW: {
    name: "Dynamic Call Flow",
    permissionLevel: "read",
    tabs: [
      tabs.DYNAMIC_CALL_FLOW_MANAGEMENT
    ]
  }
};

export const adGroupPermissionMapping = [
  {
    roles: [
      {
        name: "Admin",
        permissionLevel: "write"
      }
    ],
    startup: startups.TRITON,
    description: descriptions.Triton,
    authenticationProfile: authenticationProfileTemplates.TRITON
  },
  {
    roles: [
      {
        name: "FlowRead",
        permissionLevel: "read"
      },
      {
        name: "FlowReadWrite",
        permissionLevel: "write"
      }
    ],
    startup: startups.ALOHA_FLOW,
    description: descriptions.Aloha_Flow,
    authenticationProfile: authenticationProfileTemplates.ALOHA_FLOW
  },
  {
    roles: [
      {
        name: "FlowRead",
        permissionLevel: "read"
      },
      {
        name: "FlowReadWrite",
        permissionLevel: "write"
      }
    ],
    startup: startups.DYNAMIC_FLOW,
    description: descriptions.Dyn_Flow,
    authenticationProfile: authenticationProfileTemplates.ALOHA_FLOW
  },
  {
    roles: [
      {
        name: "RouteRead",
        permissionLevel: "read"
      },
      {
        name: "RouteReadWrite",
        permissionLevel: "write"
      }
    ],
    startup: startups.ALOHA_ROUTE,
    description: descriptions.Aloha_Routing,
    authenticationProfile: authenticationProfileTemplates.ALOHA_ROUTE
  }
];
