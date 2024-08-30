import { LoadStatuses } from "globals/interfaces";
import {
  initialState,
  reducer
} from "../reducers/reducer";
import {calabrioContext} from "testUtils";

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
  describe("setLoadingWorkers", () => {
    test("should set workers loading boolean", () => {
      const payload = LoadStatuses.SUCCESS;
      const action = {
        type: "setLoadingWorkers",
        payload
      };
      const result = reducer(initialState, action);
      expect(result.workerContext.loadStatus).toEqual(LoadStatuses.SUCCESS);
    });
  });
  describe("loadPaginatedResults", () => {
    describe("type === UMManager", () => {
      test("should set managers to page results", () => {
        const payload = {
          type: "UMManager",
          results: [
            { name: "I'm a manager" }
          ]
        };
        const action = {
          type: "loadPaginatedResults",
          payload
        };
        const testState = {
          ...initialState,
          managerContext: {
            managers: [
              { name: "I'm a control freak" }
            ]
          }
        };
        const result = reducer(testState, action);
        expect(result.managerContext.managers).toEqual([
          { name: "I'm a control freak" },
          { name: "I'm a manager" }
        ]);
      });
      describe("isFirstPage === true", () => {
        test("should set managers to page results", () => {
          const startingState = {
            ...initialState,
            managerContext: {
              managers: [{ name: "I'm already here!" }]
            }
          };
          const payload = {
            type: "UMManager",
            isFirstPage: true,
            results: [
              { name: "I'm a manager!" }
            ]
          };
          const action = {
            type: "loadPaginatedResults",
            payload
          };
          const result = reducer(startingState, action);
          expect(result.managerContext.managers).toEqual(payload.results);
        });
      });
    });
    describe("type === UMUser", () => {
      test("should set workers to page results", () => {
        const startingState = {
          ...initialState,
          workerContext: {
            workers: [{ name: "I'm already here!" }]
          }
        };
        const payload = {
          type: "UMUser",
          results: [
            { name: "I'm a worker!" }
          ]
        };
        const action = {
          type: "loadPaginatedResults",
          payload
        };
        const result = reducer(startingState, action);
        expect(result.workerContext.workers).toEqual([
          { name: "I'm already here!" },
          { name: "I'm a worker!" }
        ]);
      });
      describe("isFirstPage === true", () => {
        test("should set workers to page results", () => {
          const startingState = {
            ...initialState,
            workerContext: {
              workers: [{ name: "I'm already here!" }]
            }
          };
          const payload = {
            type: "UMUser",
            isFirstPage: true,
            results: [
              { name: "I'm a worker!" }
            ]
          };
          const action = {
            type: "loadPaginatedResults",
            payload
          };
          const result = reducer(startingState, action);
          expect(result.workerContext.workers).toEqual(payload.results);
        });
      });
    });
  });
  describe("loadProfileOptions", () => {
    test("should update the profileContext with the payload", () => {
      const payload = {
        accessGroups: [
          {
            pk: "AccessGroup#1",
            access_group_name: "Cool kids group"
          },
          {
            pk: "AccessGroup#2",
            access_group_name: "other cool kids group"
          }
        ]
      };
      const action = {
        type: "loadProfileOptions",
        payload
      };

      const result = reducer(initialState, action);
      expect(result.profileContext).toEqual({
        ...initialState.profileContext,
        ...payload
      });
    });
  });
  describe("addManager", () => {
    test("should add to the managers array", () => {
      const payload = {
        manager_first_name: "joe",
        manager_last_name: "smith",
        manager_n_num: "n1234657"
      };
      const action = {
        type: "addManager",
        payload
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
      expect(result.managerContext.managers).toEqual([...initialManager, payload]);
    });
  });
  describe("editManager", () => {
    test("should update the managers array", () => {
      const payload = [{
        manager_first_name: "joe",
        manager_last_name: "smith",
        manager_n_number: "n1234657"
      }];
      const action = {
        type: "editManager",
        payload
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
      expect(result.managerContext.managers).toEqual(payload);
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
  describe("loadCalabrioOrg", () => {
    test("should initialize a map from the org map sent in", () => {
      const payload = [
        {
          groupLevel: "TENANT"
        },
        {
          groupLevel: "GROUP"
        },
        {
          groupLevel: "TEAM",
          users: [
            {
              firstName: "Faith",
              lastName: "Cuneo"
            }
          ]
        }
      ];
      const action = {
        type: "loadCalabrioOrg",
        payload
      };
      const expectedResults = {
        teams: [{
          groupLevel: "TEAM"
        }],
        groups: [{
          groupLevel: "GROUP"
        }],
        tenant: {
          groupLevel: "TENANT"
        },
        users: [],
        roles: [],
        wfmErrors: [],
        wfmOptions: [],
        wfmOrg: []
      };
      const result = reducer(initialState, action);
      expect(result.calabrioContext).toEqual(expectedResults);
    });
  });
  describe("addCalabrioTeam", () => {
    test("should initialize a map from the team map sent in", () => {
      const newCalabrioTeam = {
        name: "Yay team",
        parentGroupId: 12
      };
      const action = {
        type: "addCalabrioTeam",
        payload: newCalabrioTeam
      };
      const expectedResults = {
        teams: [
          newCalabrioTeam
        ],
        groups: [],
        tenant: {},
        users: [],
        roles: [],
        wfmErrors: [],
        wfmOptions: [],
        wfmOrg: []
      };
      const result = reducer(initialState, action);
      expect(result.calabrioContext).toEqual(expectedResults);
    });
  });
  describe("updateCalabrioTeam", () => {
    const updatedCalabrioTeam = {
      groupId: 123,
      id: 123,
      name: "purple team!"
    };
    test("should update a single team in the calabrio context", () => {
      const state = {
        ...initialState,
        calabrioContext: {
          ...initialState.calabrioContext,
          teams: [
            {
              groupId: 123,
              name: "red team!"
            },
            {
              groupId: 456,
              name: "blue team!"
            }
          ]
        }
      };

      const action = {
        type: "updateCalabrioTeam",
        payload: updatedCalabrioTeam
      };
      expect(reducer(state, action).calabrioContext.teams).toEqual([
        {
          groupId: 456,
          name: "blue team!"
        },
        {
          groupId: 123,
          id: 123,
          name: "purple team!"
        }
      ]);
    });
  });
  describe("loadCalabrioUsers", () => {
    test("should initialize a map from the users map sent in", () => {
      const payload = [
        {
          firstName: "Faith",
          lastName: "Cuneo"
        },
        {
          firstName: "Joe",
          lastName: "Ebert"
        }
      ];
      const action = {
        type: "loadCalabrioUsers",
        payload
      };
      const expectedResults = {
        teams: [],
        groups: [],
        tenant: {},
        users: payload,
        roles: [],
        wfmErrors: [],
        wfmOptions: [],
        wfmOrg: []
      };
      const result = reducer(initialState, action);
      expect(result.calabrioContext).toEqual(expectedResults);
    });
  });
  describe("loadCalabrioRoles", () => {
    test("should initialize a map from the roles map sent in", () => {
      const payload = [
        {
          id: 1,
          name: "Administrator"
        },
        {
          id: 2,
          name: "Agent"
        }
      ];
      const action = {
        type: "loadCalabrioRoles",
        payload
      };
      const result = reducer(initialState, action);
      expect(result.calabrioContext.roles).toEqual(payload);
    });
  });
  describe("updateWfmOrg", () => {
    test("should update wfmOrg only", () => {
      const payload = {
        org: [{
          id: 1,
          name: "Administrator"
        },
        {
          id: 2,
          name: "Agent"
        }],
        errors: []
      };
      const action = {
        type: "updateWfmOrg",
        payload
      };
      const result = reducer(initialState, action);
      expect(result.calabrioContext.wfmOrg).toEqual(payload.org);
      expect(result.calabrioContext.wfmErrors).toEqual(payload.errors);
    });
    test("should update wfmOrg only", () => {
      const payload = {
        org: undefined,
        errors: undefined
      };
      const action = {
        type: "updateWfmOrg",
        payload
      };
      const result = reducer(initialState, action);
      expect(result.calabrioContext.wfmOrg).toEqual([]);
      expect(result.calabrioContext.wfmErrors).toEqual([]);
    });
  });
  describe("loadWfmOrg", () => {
    test("should format wfmOrg and save to state", () => {
      const payload = {
        org: [
          {
            id: 1,
            name: "Administrator"
          },
          {
            id: 2,
            name: "Agent"
          }
        ],
        errors: [ "oh no" ],
        People_Without_Team: [{ name: "billy" }]
      };
      const action = {
        type: "loadWfmOrg",
        payload
      };
      const result = reducer(initialState, action);
      expect(result.calabrioContext.wfmOrg).toEqual([
        ...payload.org,
        {
          Id: "People_Without_Team",
          Name: "Lost Souls",
          People: [
            {
              name: "billy"
            }
          ],
          Absences: [],
          Availabilities: [],
          Budget_Groups: [],
          Contracts: [],
          Contract_Schedules: [],
          Optional_Columns: [],
          Part_Time_Percentages: [],
          Roles: [],
          Rotations: [],
          Shift_Bags: [],
          Skills: [],
          Teams: [],
          Workflow_Control_Sets: []
        }
      ]);
      expect(result.calabrioContext.wfmErrors).toEqual(payload.errors);
    });
    test("calabrio calls return undefined - should format wfmOrg and save to state", () => {
      const payload = {
        org: undefined,
        errors: undefined,
        People_Without_Team: undefined
      };
      const action = {
        type: "loadWfmOrg",
        payload
      };
      const result = reducer(initialState, action);
      expect(result.calabrioContext.wfmOrg).toEqual([
        {
          Id: "People_Without_Team",
          Name: "Lost Souls",
          People: [],
          Absences: [],
          Availabilities: [],
          Budget_Groups: [],
          Contracts: [],
          Contract_Schedules: [],
          Optional_Columns: [],
          Part_Time_Percentages: [],
          Roles: [],
          Rotations: [],
          Shift_Bags: [],
          Skills: [],
          Teams: [],
          Workflow_Control_Sets: []
        }
      ]);
      expect(result.calabrioContext.wfmErrors).toEqual([]);
    });
  });
  describe("loadWfmOptions", () => {
    test("should initialize a map from the options map sent in", () => {
      const payload = [
        {
          id: 1,
          name: "Administrator"
        },
        {
          id: 2,
          name: "Agent"
        }
      ];
      const action = {
        type: "loadWfmOptions",
        payload
      };
      const result = reducer(initialState, action);
      expect(result.calabrioContext.wfmOptions).toEqual(payload);
    });
  });
  describe("loadProfiles", () => {
    test("should initialize or reinitialize the profiles array", () => {
      const payload = [
        {
          profile_id: 1,
          profile_name: "smith"
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
  describe("loadUserData", () => {
    test("should initialize or reinitialize the user data", () => {
      const payload = {
        isAdmin: false,
        profileId: 10,
        nNumber: "n1234345"
      };
      const action = {
        type: "loadUserData",
        payload
      };
      const result = reducer(initialState, action);
      expect(result.userContext).toEqual({
        ...initialState.userContext,
        ...payload
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
  describe("updateManageFilter", () => {
    test("should set the manager filter on the userManagementTableFilters", () => {
      const action = {
        type: "updateManagerFilter",
        payload: "n1234567"
      };
      const result = reducer(initialState, action);
      expect(result).toEqual({
        ...initialState,
        userManagementTableFilters: {
          ...initialState.userManagementTableFilters,
          managerFilter: "n1234567"
        }
      });
    });
  });
  describe("updateProfileFilter", () => {
    test("should set the profile filter on the userManagementTableFilters", () => {
      const action = {
        type: "updateProfileFilter",
        payload: [{
          value: "butts",
          label: "stuff"
        }]
      };
      const result = reducer(initialState, action);
      expect(result).toEqual({
        ...initialState,
        userManagementTableFilters: {
          ...initialState.userManagementTableFilters,
          profileFilterArray: [{
            value: "butts",
            label: "stuff"
          }]
        }
      });
    });
  });
  describe("updateOuFilter", () => {
    test("should set the ou filter on the userManagementTableFilters", () => {
      const action = {
        type: "updateOuFilter",
        payload: [{ stuff: "butts" }]
      };
      const result = reducer(initialState, action);
      expect(result).toEqual({
        ...initialState,
        userManagementTableFilters: {
          ...initialState.userManagementTableFilters,
          ouFilterArray: [{ stuff: "butts" }]
        }
      });
    });
  });
  describe("resetFilters", () => {
    test("should set the filters back to initial filter state", () => {
      const action = {
        type: "resetFilters"
      };
      const startingState = {
        ...initialState,
        userManagementTableFilters: {
          manager: "n1231232",
          profileFilterArray: [{ hi: "yo" }],
          ouFilterArray: [{ more: "stuff" }]
        }
      };
      const result = reducer(startingState, action);
      expect(result).toEqual(initialState);
    });
  });
});
