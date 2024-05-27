import {
  addManager,
  deleteManager,
  editManager,
  listUMManagers
} from "../manager";
import {
  getPaginatedResults
} from "utils";
import { apolloClient } from "components";

beforeEach(() => {
  jest.clearAllMocks();
});

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

describe("addManager", () => {
  describe("call succeeds", () => {
    const data = { manager: "you are winner" };
    beforeEach(() => apolloClient.mutate.mockResolvedValue({ data }));
    test("should resolve with any successful response", done => {
      const newManager = {
        manager_first_name: "Noob",
        manager_last_name: "Saibot",
        manager_n_num: "fatality"
      };
      addManager(newManager)
        .then(resolvedValue => {
          expect(resolvedValue).toEqual(data.manager);
          done();
        });
    });
  });
  describe("call fails", () => {
    beforeEach(() => apolloClient.mutate.mockRejectedValue({ errors: [{ message: "boo" }]}));
    test("should reject with error", done => {
      const newManager = {
        manager_first_name: "Noob",
        manager_last_name: "Saibot",
        manager_n_num: "fatality"
      };
      addManager(newManager).catch(rejectedVal => {
        expect(rejectedVal).toEqual({ "errors": [{ "message": "boo" }]});
        done();
      });
    });
  });
});


describe("editManager", () => {
  const updatedManager = {
    manager_first_name: "Noob",
    manager_last_name: "Saibot",
    manager_n_num: "fatality",
    profile_id: 4,
    calabrio_team_ids: [215]
  };
  describe("call succeeds", () => {
    beforeEach(() => apolloClient.mutate.mockResolvedValue({}));
    test("should resolve with any successful response", done => {
      editManager(updatedManager.manager_n_num, updatedManager)
        .then(resolvedValue => {
          expect(resolvedValue).toEqual(undefined);
          done();
        });
    });
  });
  describe("call fails", () => {
    beforeEach(() => apolloClient.mutate.mockRejectedValue({ errors: [{ message: "boo" }]}));
    test("should reject with error", done => {
      editManager(updatedManager.manager_id, updatedManager).catch(rejectedVal => {
        expect(rejectedVal).toEqual({ "errors": [{ "message": "boo" }]});
        done();
      });
    });
  });
});

describe("deleteManager", () => {
  const managerId = 10;
  describe("call succeeds", () => {
    beforeEach(() => apolloClient.mutate.mockReturnValue({}));
    test("should resolve with any successful response", done => {
      deleteManager(managerId)
        .then(resolvedValue => {
          expect(resolvedValue).toEqual(undefined);
          done();
        });
    });
  });
  describe("call fails", () => {
    beforeEach(() => apolloClient.mutate.mockRejectedValue({ errors: [{ message: "boo" }]}));
    test("should reject with error", done => {
      deleteManager(managerId).catch(rejectedVal => {
        expect(rejectedVal).toEqual({ errors: [{ message: "boo" }]});
        done();
      });
    });
  });
});

describe("listUMManagers", () => {
  describe("call succeeds", () => {
    beforeEach(() => getPaginatedResults.mockResolvedValue());
    test("should resolve with any successful response", done => {
      listUMManagers()
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
      listUMManagers().catch(rejectedVal => {
        expect(rejectedVal).toEqual({
          error: badResponse,
          msg: "Failed to fetch managers from graph"
        });
        done();
      });
    });
  });
});
