import {
  checkIfAdmin,
  getWorkerProfileId
} from "utils";
import { initialTestState } from "../../../__test__/testConsts";

describe("adminUtils", () => {
  beforeEach(() => {
    jest.resetAllMocks();
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
  describe("getWorkerProfileId", () => {
    describe("profile Id is number", () => {
      test("should return worker profile Id", () => {
        const profileId = getWorkerProfileId(initialTestState);
        expect(profileId).toBe(12);
      });
    });
    describe("profile Id is string", () => {
      test("should return worker profile Id", () => {
        const nNumber = "n0000000";
        const profileId = getWorkerProfileId({
          ...initialTestState,
          userContext: {
            pingIdentity: {
              sub: nNumber
            }
          }
        });
        expect(profileId).toBe(12);
      });
    });
    describe("profile Id is null", () => {
      test("should return worker profile Id", () => {
        const nNumber = "n1111111";
        const profileId = getWorkerProfileId({
          ...initialTestState,
          userContext: {
            pingIdentity: {
              sub: nNumber
            }
          }
        });
        expect(profileId).toBe(null);
      });
    });
  });
});