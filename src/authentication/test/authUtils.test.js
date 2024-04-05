import {
  checkIfAdmin,
  checkIfLowerEnv,
  checkIfBulkAdmin,
  checkIfPO,
  getWorkerProfileId
} from "../authUtils";
import {
  initialTestState,
  startups,
  adGroupPermissionMapping,
  authenticationProfileTemplates
} from "testUtils";
import {
  getAdGroupPermissionMapping,
  getAuthenticationProfileTemplates,
  getStartupProfiles
} from "authentication";

jest.mock("components", () => ({
  UserManagementWrapper: jest.fn(),
  ProfileSettingsContainer: jest.fn(),
  CallFlowManagementWrapper: jest.fn(),
  AlohaRoutingContainer: jest.fn(),
  AlohaFlowContainer: jest.fn()
}));

describe("authUtils", () => {
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
  describe("checkIfLowerEnv", () => {
    test("should return true if environment=test", () => {
      expect(checkIfLowerEnv("test")).toBe(true);
    });
    test("should return false if APP_ENV=production", () => {
      expect(checkIfLowerEnv("production")).toBe(false);
    });
    test("should return false if APP_ENV=unknownenv", () => {
      expect(checkIfLowerEnv("unknownenv")).toBe(false);
    });
  });
  describe("checkIfPO", () => {
    describe("n# is a GOP PO", () => {
      test("should return true for n0183277", () => {
        expect(checkIfPO("n0183277", "production")).toBe(true);
      });
      test("should return true for n0116796", () => {
        expect(checkIfPO("n0116796", "production")).toBe(true);
      });
      test("should return true for N0116796", () => {
        expect(checkIfPO("N0116796", "production")).toBe(true);
      });
    });
    describe("n# is not a GOP PO", () => {
      test("should return false", () => {
        expect(checkIfPO("n0288362", "production")).toBe(false);
      });
    });
    describe("n# is not a GOP PO, but it's a lower environment", () => {
      test("should return true", () => {
        expect(checkIfPO("n0288362", "test")).toBe(true);
      });
    });
  });
  describe("checkIfBulkAdmin", () => {
    describe("n# is a GOP PO", () => {
      test("should return true for n0183277", () => {
        expect(checkIfBulkAdmin("n0183277", "production")).toBe(true);
      });
      test("should return true for n0116796", () => {
        expect(checkIfBulkAdmin("n0116796", "production")).toBe(true);
      });
      test("should return true for N0116796 (All CAPS)", () => {
        expect(checkIfBulkAdmin("N0116796", "production")).toBe(true);
      });
    });
    describe("n# is a Bulk Admin", () => {
      test("should return true for n0197784", () => {
        expect(checkIfBulkAdmin("n0197784", "production")).toBe(true);
      });
      test("should return true for n0149889", () => {
        expect(checkIfBulkAdmin("n0149889", "production")).toBe(true);
      });
      test("should return true for N0169879 (All CAPS)", () => {
        expect(checkIfBulkAdmin("N0169879", "production")).toBe(true);
      });
    });
    describe("n# is not a GOP PO or a Bulk Admin and it's a production environment", () => {
      test("should return false", () => {
        expect(checkIfBulkAdmin("n0288362", "production")).toBe(false);
      });
    });
    describe("n# is not a GOP PO or a Bulk Admin, but it's a lower environment", () => {
      test("should return true", () => {
        expect(checkIfBulkAdmin("n0288362", "test")).toBe(true);
      });
    });
  });
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
});