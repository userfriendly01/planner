import {
  getAuthenticationProfileTemplates,
  getAdGroupPermissionMapping,
  getStartupProfiles,
  getTabs
} from "../authenticationProfiles";
import {
  descriptions,
  Permissions
} from "authentication/authenticationInterfaces";
import { runTritonAdminStartup } from "authentication/startups/cct-triton-admin-startup";
import { runAlohaRoutingStartup } from "authentication/startups/cct-aloha-routing-startup";
import { runDynamicCallFlowStartup } from "authentication/startups/cct-dynamic-call-flow-startup";
import AlohaRoutingContainer from "alohaRouting/AlohaRoutingContainer";
import { TritonUsersViewWrapper } from "usermanagement/TritonUsersViewWrapper";
import { setupMockedComponents } from "testUtils";
import DynamicCallFlowPhoneNumberContainer from "dynamicCallFlow/DynamicCallFlow.PhoneNumber.Container";

jest.mock("authentication/startups/cct-triton-admin-startup", () => ({
  runTritonAdminStartup: jest.fn()
}));

jest.mock("authentication/startups/cct-aloha-routing-startup", () => ({
  runAlohaRoutingStartup: jest.fn()
}));

jest.mock("authentication/startups/cct-dynamic-call-flow-startup", () => ({
  runDynamicCallFlowStartup: jest.fn()
}));

jest.mock("usermanagement/TritonUsersViewWrapper", () => ({
  TritonUsersViewWrapper: jest.fn()
}));

jest.mock("alohaRouting/AlohaRoutingContainer", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("dynamicCallFlow/DynamicCallFlow.PhoneNumber.Container", () => ({
  __esModule: true,
  default: jest.fn()
}));

describe("authenticationProfiles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      TritonUsersViewWrapper,
      AlohaRoutingContainer,
      DynamicCallFlowPhoneNumberContainer
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
        DYNAMIC_CALL_FLOW: {
          name: "Dynamic Call Flow",
          home: DynamicCallFlowPhoneNumberContainer,
          permissionLevel: Permissions.READ,
          tabs: [
            Tabs.DYNAMIC_CALL_FLOW_MANAGEMENT
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
          startup: startupProfiles.DYNAMIC_CALL_FLOW,
          description: descriptions.Dynamic_Call_Flow,
          authenticationProfile: authenticationProfileTemplates.DYNAMIC_CALL_FLOW
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
        DYNAMIC_CALL_FLOW: {
          name: "dynamic-call-flow",
          function: runDynamicCallFlowStartup
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
        DYNAMIC_CALL_FLOW_MANAGEMENT: {
          value: "dynamic-call-flow-management",
          label: "Dynamic Call Flow",
          route: "/triton-admin/dynamic-call-flow-phone-number",
          dropdown: [
            {
              route: "/triton-admin/dynamic-call-flow-phone-number",
              label: "Phone Number"
            },
            {
              route: "/triton-admin/dynamic-call-flow-configuration",
              label: "Call Flow Configuration"
            }
          ]
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