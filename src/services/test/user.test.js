import {
  createUser, getAllUsers, getUser, listUsers, updateUser
} from "services/user";
import { apolloClient } from "components";
import {
  logger,
  mapWorkerFromDbWorker, mapWorkerToDbWorker
} from "utils";
import { waitFor } from "@testing-library/react";

jest.mock("services/user", () => ({
  getAllUsers: jest.requireActual("services/user").getAllUsers,
  getUser: jest.requireActual("services/user").getUser,
  listUsers: jest.requireActual("services/user").listUsers,
  updateUser: jest.requireActual("services/user").updateUser,
  createUser: jest.requireActual("services/user").createUser
}));

jest.mock("components", () => ({
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
  mapWorkerToDbWorker: jest.fn()
}));

const workers = [
  {
    // pk: "NNum#n1234566",
    inactiveDate: "2024-01-01",
    sid: "WK0000",
    attributes: { emp_first_nme: "River" },
    isConsole: false
  },
  {
    // pk: "NNum#n1234565",
    sid: "WK1111",
    attributes: { emp_first_nme: "River" },
    isConsole: false
  },
  {
    // pk: "NNum#n1234564",
    sid: "WK2222",
    twilio_attributes_raw: null,
    isConsole: false
  },
  {
    // pk: "NNum#n1234563",
    sid: "WK3333",
    attributes: { emp_first_nme: "River" },
    isConsole: false
  },
  {
    // pk: "NNum#n1234562#Console",
    sid: "WK4444",
    attributes: { emp_first_nme: "River" },
    isConsole: false
  }
];

const filteredWorkers =  [
  workers[1],
  workers[3],
  workers[4]
];

describe("user", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mapWorkerFromDbWorker.mockImplementation(data => data);
    mapWorkerToDbWorker.mockImplementation(data => data);
  });

  describe("getAllUsers", () => {
    test("should resolve with the first paint of data", async () => {
      const dispatchMock = jest.fn();

      apolloClient.query.mockReturnValue({
        data: {
          users: {
            items: workers
          }
        }
      });

      const result = await getAllUsers(dispatchMock);

      expect(result).toEqual(filteredWorkers);

      expect(dispatchMock).toHaveBeenCalledTimes(3);
      expect(dispatchMock).toHaveBeenCalledWith({
        type: "setLoadingWorkers",
        payload: true
      });
      expect(dispatchMock).toHaveBeenCalledWith({
        type: "loadWorkers",
        payload: filteredWorkers
      });
      expect(dispatchMock).toHaveBeenCalledWith({
        type: "setLoadingWorkers",
        payload: false
      });
    });

    test("should dispatch a second time with addWorkers when there's a next token", async () => {
      const dispatchMock = jest.fn();

      apolloClient.query
        .mockReturnValueOnce({
          data: {
            users: {
              items: [workers[0], workers[1]],
              nextToken: "nextToken"
            }
          }
        })
        .mockReturnValueOnce({
          data: {
            users: {
              items: [workers[2], workers[3], workers[4]]
            }
          }
        });

      const result = await getAllUsers(dispatchMock);
      const firstResult = [workers[1]];
      const secondResult = [workers[3], workers[4]];

      expect(result).toEqual(firstResult);

      await waitFor(() => {
        expect(dispatchMock).toHaveBeenCalledTimes(4);
      });

      expect(dispatchMock).toHaveBeenCalledWith({
        type: "setLoadingWorkers",
        payload: true
      });
      expect(dispatchMock).toHaveBeenCalledWith({
        type: "loadWorkers",
        payload: firstResult
      });
      expect(dispatchMock).toHaveBeenCalledWith({
        type: "addWorkers",
        payload: secondResult
      });
      expect(dispatchMock).toHaveBeenCalledWith({
        type: "setLoadingWorkers",
        payload: false
      });
    });

    test("should reject if an error occurs in the listUsers", async () => {
      const error = new Error("An Error");

      apolloClient.query.mockRejectedValue(error);

      try {
        await getAllUsers(jest.fn());
      } catch(err) {
        expect(logger.error).toHaveBeenCalledWith("Failed to fetch workers from service", { error });
        expect(err).toEqual({
          msg: "Failed to fetch workers from service"
        });
      }
    });
  });

  describe("listUsers", () => {
    test("should return only active workers", async () => {
      apolloClient.query.mockReturnValue({
        data: {
          users: {
            items: workers
          }
        }
      });

      const result = await listUsers();

      expect(result).toEqual({
        items: filteredWorkers,
        nextToken: undefined
      });
    });

    test("should throw an error when there's an error", async () => {
      const error = new Error("An Error");

      apolloClient.query.mockRejectedValue(error);

      try {
        await listUsers();
      } catch(err) {
        expect(logger.error).toHaveBeenCalledWith("Failed to fetch workers from service", { error });
        expect(err).toEqual({
          msg: "Failed to fetch workers from service"
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