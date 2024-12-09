import { listRules } from "../rules";
import { getPaginatedResults } from "utils/graphUtils";
import { LIST_RULES } from "globals/graphql/rules";

jest.mock("utils/graphUtils", () => ({
  getPaginatedResults: jest.fn()
}));

const mockDispatch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("listRules", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("successful", () => {
    beforeEach(() => {
      getPaginatedResults.mockResolvedValue("Yay!");
    });
    test("should return with new task queue and call dispatch", async () => {
      await listRules(mockDispatch);
      expect(getPaginatedResults).toHaveBeenCalledWith(LIST_RULES, mockDispatch);
    });
  });
  describe("failure", () => {
    const error = "aww";
    beforeEach(() => {
      getPaginatedResults.mockRejectedValue(error);
    });
    test("should throw error and not call dispatch", async () => {
      try {
        await listRules(mockDispatch);
      } catch(err){
        expect(getPaginatedResults).toHaveBeenCalledWith(LIST_RULES, mockDispatch);
        expect(err).toStrictEqual(err);
      }
    });
  });
});