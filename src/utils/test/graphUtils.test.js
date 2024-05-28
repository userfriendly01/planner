import {
  getGraphData,
  getPaginatedResults
} from "../graphUtils";
import { apolloClient } from "../../components/core/Auth/SharedGraphAPIProvider";
import {
  LIST_MANAGERS,
  LIST_OFFICES,
  LIST_USERS
}from "globals";
import {
  logger
} from "utils";

jest.mock("../../components/core/Auth/SharedGraphAPIProvider", () => ({
  apolloClient: {
    mutate: jest.fn(),
    query: jest.fn()
  }
}));

const mockDispatch = jest.fn();
const mockFormatResults = jest.fn().mockImplementation(() => "Formatted Results");

describe("getGraphData", () => {
  describe("Graph type is User", () => {
    test("LIST_USERS are returned", () => {
      const res = getGraphData("UMUser");
      expect(res).toBe(LIST_USERS);
    });
  });
  describe("Graph type is Manager", () => {
    test("LIST_MANAGERS are returned", () => {
      const res = getGraphData("UMManager");
      expect(res).toBe(LIST_MANAGERS);
    });
  });
  describe("Graph type is Office", () => {
    test("LIST_OFFICES are returned", () => {
      const res = getGraphData("UMOffice");
      expect(res).toBe(LIST_OFFICES);
    });
  });
  describe("Graph type is Unknown", () => {
    test("Error is thrown", () => {
      try {
        getGraphData("UMButts");
      } catch(error){
        expect(error).toBe("Type of UMButts is not a valid list type");
      }

    });
  });
});

describe("getPageResults", () => {
  const results1 = [{ name: "result1" }];
  const results2 = [{ name: "result2" }];
  const results3 = [{ name: "result3" }];
  const type = "UMUser";

  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("results are one page", () => {
    beforeEach(() => {
      apolloClient.query.mockResolvedValueOnce({
        data: {
          users: {
            items: results1
          }
        }
      });
    });
    test("apolloClient is called once", async () => {
      await getPaginatedResults(type, mockDispatch);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "loadPaginatedResults",
        payload: {
          type,
          results: results1
        }
      });
      expect(apolloClient.query).toHaveBeenCalledTimes(1);
    });
    describe("custom formatting was passed through", () => {
      test("formatted results are saved on dispatch", async () => {
        await getPaginatedResults(type, mockDispatch, mockFormatResults);
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "loadPaginatedResults",
          payload: {
            type,
            results: "Formatted Results"
          }
        });
        expect(apolloClient.query).toHaveBeenCalledTimes(1);
      });
    });
  });
  describe("results are multiple pages", () => {
    beforeEach(() => {
      apolloClient.query.mockResolvedValueOnce({
        data: {
          users: {
            items: results1,
            nextToken: "YES"
          }
        }
      });
      apolloClient.query.mockResolvedValueOnce({
        data: {
          users: {
            items: results2,
            nextToken: "YES"
          }
        }
      });
      apolloClient.query.mockResolvedValueOnce({
        data: {
          users: {
            items: results3,
            nextToken: null
          }
        }
      });
    });
    test("apolloClient is called 3 times", async () => {
      await getPaginatedResults(type, mockDispatch);
      expect(mockDispatch).toHaveBeenCalledTimes(3);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "loadPaginatedResults",
        payload: {
          type,
          results: results1
        }
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "loadPaginatedResults",
        payload: {
          type,
          results: results2
        }
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "loadPaginatedResults",
        payload: {
          type,
          results: results3
        }
      });
      expect(apolloClient.query).toHaveBeenCalledTimes(3);
    });
  });
  describe("errors are thrown calling the graph", () => {
    const error = "Ohh Noo!";
    beforeEach(() => {
      apolloClient.query.mockRejectedValue(error);
    });
    test("Error is logged and throw up", async () => {
      try {
        await getPaginatedResults(type, mockDispatch);
      } catch(err) {
        expect(mockDispatch).toHaveBeenCalledTimes(0);
        expect(logger.error).toBeCalledWith("Error thrown getting paginated results for UMUser", error);
      }
    });
  });
});