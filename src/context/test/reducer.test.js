import {
  initialState,
  reducer
} from "context";

describe("reducer", () => {
  describe("invalid action", () => {
    test("should no do nothing", () => {
      const action = {
        type: "bad",
        payload: "irrelevant"
      };
      const result = reducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });
  describe("addManager", () => {
    test("should add to the managers array", () => {
      const payload = {
        manager_first_name: "joe",
        manager_last_name: "smith",
        manager_n_number: "n1234657"
      };
      const action = {
        type: "addManager",
        payload: {
          manager: [payload]
        }
      };
      const initialManager = [
        {
          manager_first_name: "frank",
          manager_last_name: "smith",
          manager_n_number: "n7685955"
        }
      ];
      const testState = {
        ...initialState,
        managerContext: {
          managers: initialManager
        }
      };
      const result = reducer(testState, action);
      expect(result.managerContext.managers).toEqual([...initialManager, [payload]]);
    });
  });
  describe("addWorker", () => {
    test("should add to the workers array", () => {
      const payload = {
        attributes: {
          manager_first_name: "test",
          manager_last_name: "fun"
        },
        id: "n1234556"
      };
      const action = {
        type: "addWorker",
        payload
      };
      const initialWorkers = [
        {
          attributes: {
            manager_first_name: "frank",
            manager_last_name: "smith"
          },
          id: "n7685955"
        }
      ];
      const testState = {
        ...initialState,
        workerContext: {
          workers: initialWorkers
        }
      };
      const result = reducer(testState, action);
      expect(result.workerContext.workers).toEqual([...initialWorkers, payload]);
    });
  });
  describe("loadManager", () => {
    test("should initialize or reinitialize the managers array", () => {
      const payload = [
        {
          manager_first_name: "joe",
          manager_last_name: "smith",
          manager_n_number: "n1234657"
        }
      ];
      const action = {
        type: "loadManagers",
        payload
      };
      const result = reducer(initialState, action);
      expect(result.managerContext.managers).toEqual(payload);
    });
  });
  describe("loadProfiles", () => {
    test("should initialize or reinitialize the profiles array", () => {
      const payload = [
        {
          profile_id: 1,
          profile_nme: "smith"
        }
      ];
      const action = {
        type: "loadProfiles",
        payload
      };
      const result = reducer(initialState, action);
      expect(result.profileContext.profiles).toEqual(payload);
    });
  });
  describe("loadWorkers", () => {
    test("should initialize or reinitialize the workers array", () => {
      const payload = [
        {
          workerName: "joe smith",
          workerNNum: "n1234657"
        }
      ];
      const action = {
        type: "loadWorkers",
        payload
      };
      const result = reducer(initialState, action);
      expect(result.workerContext.workers).toEqual(payload);
    });
  });
  describe("loadUserData", () => {
    test("should initialize or reinitialize the user data", () => {
      const payload = {
        name: "Test",
        nNum: "n1234345",
        groupsArr: ["developers"]
      };
      const action = {
        type: "loadUserData",
        payload
      };
      const result = reducer(initialState, action);
      expect(result.userContext).toEqual(payload);
    });
  });
  describe("toggleWorkerSelected", () => {
    const state = { ...initialState };
    const workers = { cool: "wow" };
    state.workerContext.workers = workers;
    state.workerContext.selectedWorkers = ["WK1","WK2","WK3","WK4","WK5"];
    test("when worker is not selected they will be added to the array", () => {
      const action = {
        type: "toggleWorkerSelected",
        payload: "WK6"
      };
      expect(reducer({ ...state }, action).workerContext).toEqual({
        workers,
        selectedWorkers: ["WK1","WK2","WK3","WK4","WK5","WK6"]
      });
    });
    test("when worker is already selected they will be removed from the array", () => {
      const action = {
        type: "toggleWorkerSelected",
        payload: "WK3"
      };
      expect(reducer({ ...state }, action).workerContext).toEqual({
        workers,
        selectedWorkers: ["WK1","WK2","WK4","WK5"]
      });
    });
  });
  describe("updateWorker", () => {
    test("should update a single existing worker in the workers context", () => {
      const state = { ...initialState };
      state.workerContext.workers = [
        {
          id: "one",
          sid: "WK12345",
          attributes: "old"
        },
        {
          id: "two",
          sid: "WK67890",
          attributes: "old"
        }
      ];
      const workerToUpdate = {
        id: "twoooo",
        sid: "WK67890",
        attributes: "new"
      };
      const action = {
        type: "updateWorker",
        payload: workerToUpdate
      };
      expect(reducer(state, action).workerContext.workers).toEqual([
        {
          id: "one",
          sid: "WK12345",
          attributes: "old"
        },
        {
          id: "twoooo",
          sid: "WK67890",
          attributes: "new"
        }
      ]);
    });
  });
});