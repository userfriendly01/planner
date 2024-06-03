import { AccountInfo } from "@azure/msal-browser";
import {
  AuthenticationProfileOptions,
  descriptions,
  Permissions
} from "authentication/authenticationInterfaces";
import { runTritonAdminStartup } from "authentication/startups/cct-triton-admin-startup";
import { runAlohaRoutingStartup } from "authentication/startups/cct-aloha-routing-startup";
import { runAlohaFlowStartup } from "authentication/startups/cct-aloha-flow-startup";
import {
  AlohaFlowContainer,
  AlohaRoutingContainer,
  TritonUsersViewWrapper
} from "components";
import { ADGroupPermission } from "globals";

export const getAuthenticationProfileTemplates = (): AuthenticationProfileOptions => {
  const Tabs = getTabs();
  return {
    TRITON: {
      name: "Triton",
      home: TritonUsersViewWrapper,
      permissionLevel: Permissions.READ,
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
    }
  };
};

export const getFilteredPermissions = (account: AccountInfo): ADGroupPermission[] => {
  return getAdGroupPermissionMapping()
    .map(permission => {
      const filteredRoles = permission.roles.filter(({ name }) =>
        account.idTokenClaims.roles.includes(name)
      );

      if (filteredRoles.length) {
        return {
          ...permission,
          roles: filteredRoles
        };
      }

      return null;
    })
    .filter(group => !!group);
};

export const getAdGroupPermissionMapping = (): ADGroupPermission[] => {
  const startupProfiles = getStartupProfiles();
  const authenticationProfileTemplates = getAuthenticationProfileTemplates();

  return [
    {
      roles: [
        {
          name: "Admin",
          permissionLevel: Permissions.WRITE
        }
      ],
      startup: startupProfiles.TRITON,
      description: descriptions.Triton,
      authenticationProfile: authenticationProfileTemplates.TRITON
    },
    {
      roles: [
        {
          name: "FlowRead",
          permissionLevel: Permissions.READ
        },
        {
          name: "FlowReadWrite",
          permissionLevel: Permissions.WRITE
        }
      ],
      startup: startupProfiles.ALOHA_FLOW,
      description: descriptions.Aloha_Flow,
      authenticationProfile: authenticationProfileTemplates.ALOHA_FLOW
    },
    {
      roles: [
        {
          name: "RouteRead",
          permissionLevel: Permissions.READ
        },
        {
          name: "RouteReadWrite",
          permissionLevel: Permissions.WRITE
        }
      ],
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
    ALOHA_ROUTING_RULES: {
      value: "aloha-routing-rules",
      label: "Routing Rules",
      route: "/triton-admin/aloha-routing",
      dropdown: null
    }
  };
};