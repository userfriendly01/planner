import {
  checkIfAdmin,
  checkIfPO,
  getAuthenticationProfiles,
  getPermissions,
  getStartups,
  getWorkerProfileId
} from "utils";
import {
  initialTestState,
  startups,
  adGroupPermissionMapping,
  mockRunTritonStartup,
  mockRunAlohaRoutingStartup,
  mockRunAlohaFlowStartup,
  authenticationProfileTemplates
} from "testUtils";
import {
  getAdGroupPermissionMapping,
  getAuthenticationProfileTemplates,
  getStartupProfiles
} from "authentication";

const unformattedAdGroups = [
  "CN=gpi-cct-config-flow-read,OU=Infrastructure,OU=Security,OU=LM Groups,DC=lm,DC=lmig,DC=com",
  "CN=gci-cct-triton-dev-tritonadmin,OU=Infrastructure,OU=Security,OU=LM Groups,DC=lm,DC=lmig,DC=com"
];

const permissions = [
  adGroupPermissionMapping[0],
  adGroupPermissionMapping[3]
];

const startupResponses = [
  [
    startups.TRITON.name,
    initialTestState.workerContext.workers
  ],
  [startups.ALOHA_FLOW.name]
];

describe("adminUtils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getAuthenticationProfileTemplates.mockReturnValue(authenticationProfileTemplates);
    getAdGroupPermissionMapping.mockReturnValue(adGroupPermissionMapping);
    getStartupProfiles.mockReturnValue(startups);
  });
  describe("checkIfAdmin", () => {
    describe("profileId === 0 ", () => {
      test("should return true", () => {
        expect(checkIfAdmin(0)).toBe(true);
      });
    });
    describe("profileId !== 0 ", () => {
      test("should return false", () => {
        expect(checkIfAdmin(12)).toBe(false);
      });
    });
  });
  // describe("checkIfPO", () => {
  //   describe("n# is a GOP PO", () => {
  //     test("should return true for n0183277", () => {
  //       expect(checkIfPO('n0183277')).toBe(true);
  //     });
  //     test("should return true for n0116796", () => {
  //       expect(checkIfPO('n0116796')).toBe(true);
  //     });
  //     test("should return true for N0116796", () => {
  //       expect(checkIfPO('N0116796')).toBe(true);
  //     });
  //   });
  //   describe("n# is not a GOP PO", () => {
  //     test("should return false", () => {
  //       expect(checkIfPO('n0288363')).toBe(false);
  //     });
  //   });
  // });
  describe("getWorkerProfileId", () => {
    describe("profile Id is number", () => {
      test("should return worker profile Id", () => {
        const nNumber = "N0263786";
        const profileId = getWorkerProfileId(nNumber, initialTestState.workerContext.workers);
        expect(profileId).toBe(12);
      });
    });
    describe("profile Id is string", () => {
      test("should return worker profile Id", () => {
        const nNumber = "n0000000";
        const profileId = getWorkerProfileId(nNumber, initialTestState.workerContext.workers);
        expect(profileId).toBe(12);
      });
    });
    describe("profile Id is null", () => {
      test("should return worker profile Id", () => {
        const nNumber = "n1111111";
        const profileId = getWorkerProfileId(nNumber, initialTestState.workerContext.workers);
        expect(profileId).toBe(null);
      });
    });
  });
  describe("getPermissions", () => {
    describe("getAdGroups", () => {
      test("should return permission mappings for AD groups", () => {
        const results = getPermissions(unformattedAdGroups);
        expect(results).toStrictEqual(permissions);
      });
    });
  });
  describe("getStartups", () => {
    test("should return expected startups", () => {
      const expectedResults = [
        startups.TRITON.function,
        startups.ALOHA_FLOW.function
      ];
      const results = getStartups(permissions);
      results.forEach(startup => {
        startup();
      });
      expect(results).toStrictEqual(expectedResults);
      expect(mockRunTritonStartup).toHaveBeenCalledTimes(1);
      expect(mockRunAlohaFlowStartup).toHaveBeenCalledTimes(1);
      expect(mockRunAlohaRoutingStartup).toHaveBeenCalledTimes(0);
    });
    describe("startup is already in the array", () => {
      test("should not add it to the array again", () => {
        const expectedResults = [
          startups.TRITON.function,
          startups.ALOHA_FLOW.function
        ];
        const results = getStartups([
          ...permissions,
          adGroupPermissionMapping[4]
        ]);
        results.forEach(startup => {
          startup();
        });
        expect(results).toStrictEqual(expectedResults);
        expect(mockRunTritonStartup).toHaveBeenCalledTimes(1);
        expect(mockRunAlohaFlowStartup).toHaveBeenCalledTimes(1);
        expect(mockRunAlohaRoutingStartup).toHaveBeenCalledTimes(0);
      });
    });
  });
  describe("getAuthenticationProfiles", () => {
    test("should return expected authentication profiles", () => {
      const expectedResults = [
        authenticationProfileTemplates.TRITON,
        authenticationProfileTemplates.ALOHA_FLOW
      ];
      const result = getAuthenticationProfiles(permissions, "n0263786", startupResponses);
      expect(result).toStrictEqual(expectedResults);
    });
    describe("two read permissions are found for the same profile", () => {
      test("should not update to write permissions", () => {
        const readPermissions = [
          adGroupPermissionMapping[3],
          adGroupPermissionMapping[3]
        ];
        const expectedResults = [
          authenticationProfileTemplates.ALOHA_FLOW
        ];
        const result = getAuthenticationProfiles(readPermissions, "n0263786", startupResponses);
        expect(result).toStrictEqual(expectedResults);
      });
    });
    describe("two read permissions and a write permission are found for the same profile", () => {
      test("should update to write permissions", () => {
        const readPermissions = [
          adGroupPermissionMapping[3],
          adGroupPermissionMapping[3],
          adGroupPermissionMapping[4]
        ];
        const expectedResults = [
          authenticationProfileTemplates.ALOHA_FLOW
        ];
        const result = getAuthenticationProfiles(readPermissions, "n0263786", startupResponses);
        expect(result).toStrictEqual(expectedResults);
      });
    });
    describe("permission level in authentication profile is write", () => {
      test("should update authenticationProfile with write access", () => {
        const writePermissions = [
          ...permissions,
          adGroupPermissionMapping[4]
        ];
        const expectedResults = [
          authenticationProfileTemplates.TRITON,
          authenticationProfileTemplates.ALOHA_FLOW
        ];
        const result = getAuthenticationProfiles(writePermissions, "n0263786", startupResponses);
        expect(result).toStrictEqual(expectedResults);
      });
    });
    describe("Authentication Profiles include Triton Profile", () => {
      test("should update triton profile with isAdmin === true", () => {
        const expectedResults = [
          authenticationProfileTemplates.TRITON,
          authenticationProfileTemplates.ALOHA_FLOW
        ];
        const result = getAuthenticationProfiles(permissions, "n2222222", startupResponses);
        expect(result).toStrictEqual(expectedResults);
      });
    });
  });
});