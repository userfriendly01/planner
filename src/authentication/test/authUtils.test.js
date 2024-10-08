import {
  checkIfAdmin,
  checkIfBulkAdmin,
  checkIfManagerConfigurer,
  checkIfPO,
  getWorkerProfileId
} from "../authUtils";
import { listUMUserRecords } from "services/user";
import { checkIfLowerEnv } from "utils";

jest.mock("services/user", () => ({
  listUMUserRecords: jest.fn()
}));

jest.mock("utils", () => ({
  checkIfLowerEnv: jest.fn()
}));

describe("authUtils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
        checkIfLowerEnv.mockReturnValueOnce(false);

        expect(checkIfPO("n0288362")).toBe(false);
      });
    });
    describe("n# is not a GOP PO, but it's a lower environment", () => {
      test("should return true", () => {
        checkIfLowerEnv.mockReturnValueOnce(true);


        expect(checkIfPO("n0288362")).toBe(true);
      });
    });
  });
  describe("checkIfBulkAdmin", () => {
    describe("n# is a GOP PO", () => {
      test("should return true for n0183277", () => {
        checkIfLowerEnv.mockReturnValueOnce(false);


        expect(checkIfBulkAdmin("n0183277")).toBe(true);
      });
      test("should return true for n0116796", () => {
        checkIfLowerEnv.mockReturnValueOnce(false);


        expect(checkIfBulkAdmin("n0116796")).toBe(true);
      });
      test("should return true for N0116796 (All CAPS)", () => {
        checkIfLowerEnv.mockReturnValueOnce(false);


        expect(checkIfBulkAdmin("N0116796")).toBe(true);
      });
    });
    describe("n# is a Bulk Admin", () => {
      test("should return true for n0197784", () => {
        checkIfLowerEnv.mockReturnValueOnce(false);


        expect(checkIfBulkAdmin("n0197784")).toBe(true);
      });
      test("should return true for n0149889", () => {
        checkIfLowerEnv.mockReturnValueOnce(false);


        expect(checkIfBulkAdmin("n0149889")).toBe(true);
      });
      test("should return true for N0169879 (All CAPS)", () => {
        checkIfLowerEnv.mockReturnValueOnce(false);


        expect(checkIfBulkAdmin("N0169879")).toBe(true);
      });
    });
    describe("n# is not a GOP PO or a Bulk Admin and it's a production environment", () => {
      test("should return false", () => {
        checkIfLowerEnv.mockReturnValueOnce(false);


        expect(checkIfBulkAdmin("n0288362")).toBe(false);
      });
    });
    describe("n# is not a GOP PO or a Bulk Admin, but it's a lower environment", () => {
      test("should return true", () => {
        checkIfLowerEnv.mockReturnValueOnce(true);

        expect(checkIfBulkAdmin("n0288362")).toBe(true);
      });
    });
  });

  describe("checkIfManagerConfigurer", () => {
    describe("n# is a GOP PO", () => {
      test("should return true for n0183277", () => {
        checkIfLowerEnv.mockReturnValueOnce(false);


        expect(checkIfManagerConfigurer("n0183277")).toBe(true);
      });
      test("should return true for n0116796", () => {
        checkIfLowerEnv.mockReturnValueOnce(false);


        expect(checkIfManagerConfigurer("n0116796")).toBe(true);
      });
      test("should return true for N0116796 (All CAPS)", () => {
        checkIfLowerEnv.mockReturnValueOnce(false);


        expect(checkIfManagerConfigurer("N0116796")).toBe(true);
      });
    });
    describe("n# is a Manager Configurer", () => {
      test("should return true for n0197784", () => {
        checkIfLowerEnv.mockReturnValueOnce(false);


        expect(checkIfManagerConfigurer("n0197784")).toBe(true);
      });
      test("should return true for n0149889", () => {
        checkIfLowerEnv.mockReturnValueOnce(false);


        expect(checkIfManagerConfigurer("n0149889")).toBe(true);
      });
      test("should return true for N0169879 (All CAPS)", () => {
        checkIfLowerEnv.mockReturnValueOnce(false);


        expect(checkIfManagerConfigurer("N0169879")).toBe(true);
      });
    });
    describe("n# is not a GOP PO or a Manager Configurer and it's a production environment", () => {
      test("should return false", () => {
        checkIfLowerEnv.mockReturnValueOnce(false);


        expect(checkIfManagerConfigurer("n0288362")).toBe(false);
      });
    });
    describe("n# is not a GOP PO or a Manager Configurer, but it's a lower environment", () => {
      test("should return true", () => {
        checkIfLowerEnv.mockReturnValueOnce(true);

        expect(checkIfManagerConfigurer("n0288362")).toBe(true);
      });
    });
  });
  describe("getWorkerProfileId", () => {
    describe("profile Id is number", () => {
      beforeEach(() => {
        listUMUserRecords.mockResolvedValue([{
          attributes: {
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
          attributes: {
            profile_id: -1
          }
        }]);
      });
      test("should return worker profile Id", async () => {
        const nNumber = "n1111111";
        const profileId = await getWorkerProfileId(nNumber);
        expect(profileId).toBe(-1);
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