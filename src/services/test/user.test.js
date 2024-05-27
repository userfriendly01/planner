import {
  createUser, listUMUsers, getUser, updateUser
} from "services/user";
import { apolloClient } from "../../components/core/Auth/SharedGraphAPIProvider";
import {
  logger,
  mapWorkerFromDbWorker,
  mapWorkerToDbWorker,
  getPaginatedResults
} from "utils";

jest.mock("../../components/core/Auth/SharedGraphAPIProvider", () => ({
  apolloClient: {
    mutate: jest.fn(),
    query: jest.fn()
  }
}));

jest.mock("utils", () => ({
  logger: {
    error: jest.fn()
  },
  mapWorkerFromDbWorker: jest.fn(),
  mapWorkerToDbWorker: jest.fn(),
  getPaginatedResults: jest.fn()
}));

describe("user", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mapWorkerFromDbWorker.mockImplementation(data => data);
    mapWorkerToDbWorker.mockImplementation(data => data);
  });

  describe("listUMUsers", () => {
    test("should resolve with the first paint of data", async () => {
      const dispatchMock = jest.fn();

      getPaginatedResults.mockResolvedValue("yay!");

      await listUMUsers(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenCalledWith({
        type: "setLoadingWorkers",
        payload: true
      });
      expect(dispatchMock).toHaveBeenCalledWith({
        type: "setLoadingWorkers",
        payload: false
      });
    });

    test("should reject if an error occurs in the listUMUsers", async () => {
      const error = new Error("An Error");

      getPaginatedResults.mockRejectedValue(error);

      try {
        await listUMUsers(jest.fn());
      } catch(err) {
        expect(logger.error).toHaveBeenCalledWith("Failed to fetch users from graph", { error });
        expect(err).toEqual({
          msg: "Failed to fetch users from graph"
        });
      }
    });
  });

  describe.each([
    {
      func: updateUser,
      gqlFunc: apolloClient.mutate,
      name: "updateUser",
      args: ["WK1234", { twilio_attributes: {}}]
    },
    {
      func: createUser,
      gqlFunc: apolloClient.mutate,
      name: "createUser",
      args: [{ twilio_attributes: {}}]
    },
    {
      func: getUser,
      gqlFunc: apolloClient.query,
      name: "getUser",
      args: ["WK1234"]
    }
  ])("$name", ({
    func, gqlFunc, args
  }) => {
    test("should return user", async () => {
      const user = {
        pk: "NNum#n1234567",
        sk: "User#n1234567"
      };

      gqlFunc.mockReturnValue({ data: { user }});

      const response = await func(...args);

      expect(response).toEqual(user);
    });

    test("should throw an error", async () => {
      const errors = [new Error("")];

      gqlFunc.mockReturnValue({ errors });

      try {
        await func(...args);
      } catch(error) {
        expect(error).toEqual(errors);
      }

    });
  });
});