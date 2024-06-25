import {
  addOffice,
  getOffice
} from "../office";
import { apolloClient } from "../../components/core/Auth/SharedGraphAPIProvider";

jest.mock("../../components/core/Auth/SharedGraphAPIProvider", () => ({
  apolloClient: {
    mutate: jest.fn(),
    query: jest.fn()
  }
}));

jest.mock("utils/graphUtils", () => ({
  getPaginatedResults: jest.fn()
}));

beforeEach(() => {
  jest.clearAllMocks();
});

const data = { office: "0022" };

describe("addOffice", () => {
  describe("call succeeds", () => {
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

describe("getOffice", () => {
  describe("call succeeds", () => {
    beforeEach(() => apolloClient.mutate.mockReturnValue({ data }));
    test("should resolve with any successful response", done => {
      getOffice()
        .then(resolvedValue => {
          expect(resolvedValue).toEqual(undefined);
          done();
        });
    });
  });
  describe("call fails", () => {
    beforeEach(() => apolloClient.mutate.mockReturnValue({
      data: null,
      errors: [{ message: "boo" }]
    }));
    test("should reject with error", done => {
      getOffice().then(rejectedVal => {
        expect(rejectedVal).toEqual(null);
        done();
      });
    });
  });
});
