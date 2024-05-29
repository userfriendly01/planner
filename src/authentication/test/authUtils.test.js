import {
  checkIfAdmin,
  checkIfLowerEnv,
  checkIfBulkAdmin,
  checkIfPO,
  getWorkerProfileId
} from "../authUtils";
import { listUMUserRecords } from "services";
import {
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
      beforeEach(() => {
        listUMUserRecords.mockResolvedValue([{
          twilio_attributes: {
            profile_id: 2
          }
        }]);
      });
      test("should return worker profile Id", async () => {
        const nNumber = "N0263786";
        const profileId = await getWorkerProfileId(nNumber);
        expect(profileId).toBe(2);
      });
    });
    describe("profile Id is null", () => {
      beforeEach(() => {
        listUMUserRecords.mockResolvedValue([{
          twilio_attributes: {
            profile_id: null
          }
        }]);
      });
      test("should return worker profile Id", async () => {
        const nNumber = "n1111111";
        const profileId = await getWorkerProfileId(nNumber);
        expect(profileId).toBe(null);
      });
    });
    describe("error is thrown fetching UMUserRecords", () => {
      beforeEach(() => {
        listUMUserRecords.mockRejectedValue("Aww");
      });
      test("should return worker profile Id", async () => {
        const nNumber = "n1111111";
        const profileId = await getWorkerProfileId(nNumber);
        expect(profileId).toBe(-1);
      });
    });
  });
});