import {
  addOffice,
  listUMOffices
} from "../office";
import {
  getPaginatedResults
} from "utils";
import { apolloClient } from "components";

jest.mock("components", () => ({
  apolloClient: {
    mutate: jest.fn(),
    query: jest.fn()
  }
}));

jest.mock("utils", () => ({
  getPaginatedResults: jest.fn(),
  logger: {
    error: jest.fn()
  }
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("addOffice", () => {
  describe("call succeeds", () => {
    const data = { office: "0022" };
    beforeEach(() => apolloClient.mutate.mockReturnValue({ data }));
    test("should resolve with any successful response", done => {
      const newOffice = {
        office_nme: "noob",
        office_num: "0xb"
      };
      addOffice(newOffice)
        .then(resolvedValue => {
          expect(resolvedValue).toEqual(data.office);
          done();
        });
    });
  });
  describe("call fails", () => {
    beforeEach(() => apolloClient.mutate.mockReturnValue({ errors: [{ message: "boo" }]}));
    test("should reject with error", done => {
      const newOffice = {
        office_nme: "noob",
        office_num: "0xb"
      };
      addOffice(newOffice).catch(rejectedVal => {
        expect(rejectedVal).toEqual([{ "message": "boo" }]);
        done();
      });
    });
  });
});

describe("listUMOffices", () => {
  describe("call succeeds", () => {
    beforeEach(() => getPaginatedResults.mockResolvedValue("Yay"));
    test("should resolve with any successful response", done => {
      listUMOffices()
        .then(resolvedValue => {
          expect(resolvedValue).toEqual(undefined);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => getPaginatedResults.mockRejectedValue(badResponse));
    test("should reject with error", done => {
      listUMOffices().catch(rejectedVal => {
        expect(rejectedVal).toEqual({ msg: "Failed to fetch offices from graph" });
        done();
      });
    });
  });
});
