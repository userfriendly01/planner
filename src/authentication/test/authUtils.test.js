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
import { env } from "globals";

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

    delete env.APP_ENV;
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
    test("should return true if APP_ENV=test", () => {
      env.APP_ENV = "test";
      expect(checkIfLowerEnv("test")).toBe(true);
    });
    test("should return false if APP_ENV=production", () => {
      env.APP_ENV = "production";

      expect(checkIfLowerEnv("production")).toBe(false);
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
        env.APP_ENV = "production";

        expect(checkIfPO("n0288362")).toBe(false);
      });
    });
    describe("n# is not a GOP PO, but it's a lower environment", () => {
      test("should return true", () => {
        env.APP_ENV = "test";

        expect(checkIfPO("n0288362")).toBe(true);
      });
    });
  });
  describe("checkIfBulkAdmin", () => {
    describe("n# is a GOP PO", () => {
      test("should return true for n0183277", () => {
        env.APP_ENV = "production";

        expect(checkIfBulkAdmin("n0183277")).toBe(true);
      });
      test("should return true for n0116796", () => {
        env.APP_ENV = "production";

        expect(checkIfBulkAdmin("n0116796")).toBe(true);
      });
      test("should return true for N0116796 (All CAPS)", () => {
        env.APP_ENV = "production";

        expect(checkIfBulkAdmin("N0116796")).toBe(true);
      });
    });
    describe("n# is a Bulk Admin", () => {
      test("should return true for n0197784", () => {
        env.APP_ENV = "production";

        expect(checkIfBulkAdmin("n0197784")).toBe(true);
      });
      test("should return true for n0149889", () => {
        env.APP_ENV = "production";

        expect(checkIfBulkAdmin("n0149889")).toBe(true);
      });
      test("should return true for N0169879 (All CAPS)", () => {
        env.APP_ENV = "production";

        expect(checkIfBulkAdmin("N0169879")).toBe(true);
      });
    });
    describe("n# is not a GOP PO or a Bulk Admin and it's a production environment", () => {
      test("should return false", () => {
        env.APP_ENV = "production";

        expect(checkIfBulkAdmin("n0288362")).toBe(false);
      });
    });
    describe("n# is not a GOP PO or a Bulk Admin, but it's a lower environment", () => {
      test("should return true", () => {
        env.APP_ENV = "test";

        expect(checkIfBulkAdmin("n0288362")).toBe(true);
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