import {
  createUser, listUMUsers, updateUser, listInactiveUMUsers, listUMUserRecords
} from "services/user";
import { apolloClient } from "../../components/core/Auth/SharedGraphAPIProvider";
import {
  getPaginatedResults,
  mapWorkerFromDbWorker,
  mapWorkerToDbWorker
} from "utils/graphUtils";
import { logger } from "utils/logger";

jest.mock("../../components/core/Auth/SharedGraphAPIProvider", () => ({
  apolloClient: {
    mutate: jest.fn(),
    query: jest.fn()
  }
}));

jest.mock("utils/graphUtils", () => ({
  getPaginatedResults: jest.fn(),
  mapWorkerFromDbWorker: jest.fn(),
  mapWorkerToDbWorker: jest.fn()
}));

const dispatchMock = jest.fn();

describe("user", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mapWorkerFromDbWorker.mockImplementation(data => data);
    mapWorkerToDbWorker.mockImplementation(data => data);
  });

  describe("listUMUsers", () => {
    test("should resolve and set loadStatus to Success", async () => {

      getPaginatedResults.mockResolvedValue("yay!");

      await listUMUsers(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenCalledWith({
        type: "setLoadingWorkers",
        payload: "loading"
      });
      expect(dispatchMock).toHaveBeenCalledWith({
        type: "setLoadingWorkers",
        payload: "success"
      });
    });

    test("should reject if an error occurs in the listUMUsers", async () => {
      const error = new Error("An Error");

      getPaginatedResults.mockRejectedValue(error);

      try {
        await listUMUsers(jest.fn());
      } catch(err) {
        expect(dispatchMock).toHaveBeenCalledWith({
          type: "setLoadingWorkers",
          payload: "loading"
        });
        expect(dispatchMock).toHaveBeenCalledWith({
          type: "setLoadingWorkers",
          payload: "fail"
        });
        expect(logger.error).toHaveBeenCalledWith("Failed to fetch users from graph", { error });
        expect(err).toEqual({
          msg: "Failed to fetch users from graph"
        });
      }
    });
  });
  describe("listInactiveUMUsers", () => {
    test("should resolve and return users", async () => {
      getPaginatedResults.mockResolvedValue([{ pk: "n0263786" }]);

      const result = await listInactiveUMUsers(dispatchMock);

      expect(result).toEqual([{ pk: "n0263786" }]);
    });
    test("should reject if an error occurs in the listInactiveUMUsers", async () => {
      getPaginatedResults.mockRejectedValueOnce("Boo");

      await listInactiveUMUsers(jest.fn());
      expect(logger.error).toHaveBeenCalledWith("Failed to fetch inactive users from graph", { error: "Boo" });
    });
  });
  describe("listUMUserRecords", () => {
    test("should resolve with the first paint of data", async () => {
      apolloClient.query.mockResolvedValue({
        data: {
          listUMUserRecords: {
            items: [
              {
                pk: "n0263786#Console"
              },
              {
                pk: "n0263786"
              }
            ]
          }
        }
      });

      const res = await listUMUserRecords("n0263786");
      expect(res).toStrictEqual([{ "pk": "n0263786" }, { "pk": "n0263786#Console" }]);

    });

    test("should reject if an error occurs in the listUMUsers", async () => {
      apolloClient.query.mockResolvedValue({
        errors: [
          {
            message: "Oh Nooo"
          }
        ]
      });
      try {
        await listUMUserRecords("n0263786");
      } catch(err) {
        expect(logger.error).toHaveBeenCalledWith("Failed to fetch user records from graph", {
          errors: [
            {
              message: "Oh Nooo"
            }
          ]
        });
        expect(err).toEqual([{ "message": "Oh Nooo" }]);
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