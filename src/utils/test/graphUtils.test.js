import {
  getGraphData,
  getPaginatedResults,
  mapWorkerFromDbWorker,
  mapWorkerToDbWorker
} from "../graphUtils";
import { apolloClient } from "../../components/core/Auth/SharedGraphAPIProvider";
import {
  LIST_MANAGERS,
  LIST_OFFICES,
  LIST_USERS
}from "globals/graphql";
import {
  logger
} from "utils/logger";

jest.mock("../../components/core/Auth/SharedGraphAPIProvider", () => ({
  apolloClient: {
    mutate: jest.fn(),
    query: jest.fn()
  }
}));

const sid = "WK123123123";
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

describe("mapWorkerFromDbWorker", () => {
  let attributes, dbWorker;

  beforeEach(() => {
    attributes = {
      n_number: "n1234567",
      contact_uri: "client:n1234567"
    };
    dbWorker = {
      attributes,
      sid
    };
  });

  test("should return TwilioWorker object with attributes, sid & skillsDifferent", () => {
    expect(mapWorkerFromDbWorker(dbWorker)).toEqual({
      attributes,
      sid,
      skillsDifferent: false
    });
  });

  test("should return TwilioWorker object with {} attributes, sid & skillsDifferent", () => {
    delete dbWorker.attributes;

    expect(mapWorkerFromDbWorker(dbWorker)).toEqual({
      attributes: undefined,
      sid,
      skillsDifferent: false
    });
  });

  test("should lowercase manager_n_number and set full_name if it exists", () => {
    dbWorker.attributes.manager_n_number = "N1234567";
    dbWorker.attributes.emp_first_name = "Bob";
    dbWorker.attributes.emp_last_name = "Smith";
    dbWorker.attributes.full_name = "Blah blah blah";

    expect(mapWorkerFromDbWorker(dbWorker)).toEqual({
      attributes: {
        ...attributes,
        full_name: "Bob Smith",
        emp_first_name: "Bob",
        emp_last_name: "Smith",
        manager_n_number: "n1234567"
      },
      sid,
      skillsDifferent: false
    });
  });

  test("should parse levels when they exist on the user", () => {
    dbWorker.attributes.routing = {
      levels: "{}"
    };
    dbWorker.attributes.default_skills = {
      levels: "{}"
    };
    dbWorker.attributes.disabled_skills = {
      levels: "{}"
    };

    expect(mapWorkerFromDbWorker(dbWorker)).toEqual({
      attributes: {
        ...attributes,
        routing: {
          levels: {}
        },
        default_skills: {
          levels: {}
        },
        disabled_skills: {
          levels: {}
        }
      },
      sid,
      skillsDifferent: false
    });
  });
});

describe("mapWorkerToDbWorker", () => {
  test("should map things to the new expression", () => {
    const user = {
      attributes: {
        routing: {
          caller_states: ["CA", "AK", "WA"]
        },
        caller_id: "+1123456789",
        profile_id: 0
      },
      did: "+1123456789",
      operatingUnitSid: "OU1234",
      zeroOutEnabled: false,
      selfServiceInd: false,
      inactiveForwardTo: "+1123456789"
    };


    expect(mapWorkerToDbWorker(user)).toEqual({
      twilio_attributes: JSON.stringify({
        routing: {
          caller_states: ["CA", "AK", "WA"]
        },
        caller_id: "+1123456789",
        profile_id: 0,
        agent_attribute_1: 0
      }),
      did: "+1123456789",
      operating_unit_sid: "OU1234",
      zero_out_enabled: false,
      self_service_ind: false,
      inactive_forward_to: "+1123456789"
    });
  });
});