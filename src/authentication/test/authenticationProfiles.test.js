import {
  getAuthenticationProfileTemplates,
  getAdGroupPermissionMapping,
  getStartupProfiles,
  getTabs
} from "../authenticationProfiles";
import {
  descriptions,
  Permissions,
  runTritonAdminStartup,
  runAlohaRoutingStartup,
  runAlohaFlowStartup
} from "authentication";
import {
  TritonUsersViewWrapper,
  AlohaRoutingContainer,
  AlohaFlowContainer
} from "components";
import { setupMockedComponents } from "testUtils";

jest.mock("components", () => ({
  TritonUsersViewWrapper: jest.fn(),
  AlohaRoutingContainer: jest.fn(),
  AlohaFlowContainer: jest.fn()
}));

describe("authenticationProfiles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      TritonUsersViewWrapper,
      AlohaRoutingContainer,
      AlohaFlowContainer
    });
  });
  describe("getAuthenticationProfileTemplates", () => {
    test("should return authenticationProfileTemplaces", () => {
      const Tabs = getTabs();
      const result = getAuthenticationProfileTemplates();
      expect(result).toStrictEqual({
        TRITON: {
          name: "Triton",
          permissionLevel: Permissions.READ,
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
        }
      });
    });
  });
  describe("getAdGroupPermissionMapping", () => {
    test("should return adGroupPermissionMapping", () => {
      const startupProfiles = getStartupProfiles();
      const authenticationProfileTemplates = getAuthenticationProfileTemplates();
      const result = getAdGroupPermissionMapping();
      expect(result).toStrictEqual([
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
      ]);
    });
  });
  describe("getStartupProfiles", () => {
    test("should return startupProfiles", () => {
      const result = getStartupProfiles();
      expect(result).toStrictEqual({
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
      });
    });
  });
  describe("getTabs", () => {
    test("should return tabs", () => {
      const result = getTabs();
      expect(result).toStrictEqual({
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
          dropdown: null
        },
        ALOHA_ROUTING_RULES: {
          value: "aloha-routing-rules",
          label: "Routing Rules",
          route: "/triton-admin/aloha-routing",
          dropdown: null
        }
      });
    });
  });
});