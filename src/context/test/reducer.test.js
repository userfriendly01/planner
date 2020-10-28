import {
  initialState,
  reducer
} from "context";

describe("reducer", () => {
  describe("invalid action", () => {
    test("should do nothing", () => {
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
  describe("addWorkers", () => {
    test("should update the workers array", () => {
      const initialWorkersList = [
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
          workers: initialWorkersList
        }
      };
      const payload = [
        {
          attributes: {
            manager_first_name: "test",
            manager_last_name: "fun"
          },
          id: "n1234556"
        },
        {
          attributes: {
            manager_first_name: "Jason",
            manager_last_name: "Kidd"
          },
          id: "3456789"
        }
      ];
      const action = {
        type: "addWorkers",
        payload
      };
      const result = reducer(testState, action);
      expect(result.workerContext.workers).toEqual(initialWorkersList.concat(payload));
    });
  });
  describe("deleteWorker", () => {
    test("should delete worker from the array", () => {
      const workerToDelete = {
        attributes: { delete: "this guy" },
        sid: "WK001"
      };
      const workerToKeep = {
        attributes: { keep: "this one" },
        sid: "WK000"
      };
      const someOtherWorker = {
        attributes: { also: "keep" },
        sid: "WK002"
      };
      const action = {
        type: "deleteWorker",
        payload: workerToDelete.sid
      };
      const testState = {
        ...initialState,
        workerContext: {
          workers: [
            workerToKeep,
            workerToDelete,
            someOtherWorker
          ]
        }
      };
      const result = reducer(testState, action);
      expect(result.workerContext.workers).toEqual([workerToKeep, someOtherWorker]);
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
  describe("loadSkills", () => {
    test("should update skilContext.taskrouterSkills to payload", () => {
      const payload = [
        {
          skill: "psu-l1",
          levels: []
        },
        {
          skill: "psu-l2",
          levels: [1,2,3]
        },
        {
          skill: "psu-l3",
          levels: [1,2,3,4,5,6]
        }
      ];
      const action = {
        type: "loadSkills",
        payload
      };
      const result = reducer(initialState, action);
      expect(result.skillContext.taskrouterSkills).toEqual(payload);
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
  describe("resettingSkills", () => {
    test("should set resettingSkills to payload", () => {
      const payload = true;
      const action = {
        type: "resettingSkills",
        payload
      };
      const result = reducer(initialState, action);
      expect(result.resettingSkills).toEqual(payload);
    });
  });
  describe("toggleWorkerSelected", () => {
    const state = { ...initialState };
    const workers = { cool: "wow" };
    state.workerContext.workers = workers;
    state.workerContext.selectedWorkers = [
      {
        name: "WK1",
        sid: 1
      },
      {
        name: "WK2",
        sid: 2
      },
      {
        name: "WK3",
        sid: 3
      }
    ];
    test("when worker is not selected they will be added to the array", () => {
      const action = {
        type: "toggleWorkerSelected",
        payload: {
          name: "WK6",
          sid: 6
        }
      };
      expect(reducer({ ...state }, action).workerContext).toEqual({
        workers,
        selectedWorkers: [
          {
            name: "WK1",
            sid: 1
          },
          {
            name: "WK2",
            sid: 2
          },
          {
            name: "WK3",
            sid: 3
          },
          {
            name: "WK6",
            sid: 6
          }
        ]
      });
    });
    test("when worker is already selected they will be removed from the array", () => {
      const action = {
        type: "toggleWorkerSelected",
        payload: {
          name: "WK3",
          sid: 3
        }
      };
      expect(reducer({ ...state }, action).workerContext).toEqual({
        workers,
        selectedWorkers: [
          {
            name: "WK1",
            sid: 1
          },
          {
            name: "WK2",
            sid: 2
          }
        ]
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