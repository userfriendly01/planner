import { LoadStatuses } from "globals/interfaces";
import {
  initialState,
  reducer
} from "../reducers/reducer";
import { LIST_RULES } from "globals/graphql/rules";
import {
  LIST_INACTIVE_USERS, LIST_USERS
} from "globals/graphql/user";
import { LIST_MANAGERS } from "globals/graphql/manager";
import { LIST_SOFTPHONE_CONFIG } from "globals/graphql/profile";

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
  describe(`loadPaginatedResults${LIST_MANAGERS.type}`, () => {
    test("should set managers to page results", () => {
      const payload = {
        results: { managers: [{ name: "I'm a manager" }]}
      };
      const action = {
        type: `loadPaginatedResults${LIST_MANAGERS.type}`,
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
          isFirstPage: true,
          results: { managers: [{ name: "I'm a manager!" }]}
        };
        const action = {
          type: `loadPaginatedResults${LIST_MANAGERS.type}`,
          payload
        };
        const result = reducer(startingState, action);
        expect(result.managerContext.managers).toEqual(payload.results.managers);
      });
    });
    describe("results are missing the expected key", () => {
      test("should set to initial state", () => {
        const startingState = {
          ...initialState,
          managerContext: {
            managers: [{ name: "I'm already here!" }]
          }
        };
        const payload = {
          results: {}
        };
        const action = {
          type: `loadPaginatedResults${LIST_MANAGERS.type}`,
          payload
        };
        const result = reducer(startingState, action);
        expect(result.managerContext).toEqual({
          managers: [{ name: "I'm already here!" }]
        });
      });
    });
  });
  describe(`loadPaginatedResults${LIST_USERS.type}`, () => {
    test("should set workers to page results", () => {
      const startingState = {
        ...initialState,
        workerContext: {
          workers: [{ name: "I'm already here!" }]
        }
      };
      const payload = {
        results: { users: [{ name: "I'm a worker!" }]}
      };
      const action = {
        type: `loadPaginatedResults${LIST_USERS.type}`,
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
          isFirstPage: true,
          results: {
            users: [
              { name: "I'm a worker!" }
            ]
          }
        };
        const action = {
          type: `loadPaginatedResults${LIST_USERS.type}`,
          payload
        };
        const result = reducer(startingState, action);
        expect(result.workerContext.workers).toEqual(payload.results.users);
      });
    });
    describe("results are missing the expected key", () => {
      test("should set to initial state", () => {
        const startingState = {
          ...initialState,
          userContext: {
            users: [{ name: "I'm already here!" }]
          }
        };
        const payload = {
          results: {}
        };
        const action = {
          type: `loadPaginatedResults${LIST_USERS.type}`,
          payload
        };
        const result = reducer(startingState, action);
        expect(result.userContext).toEqual({
          users: [{ name: "I'm already here!" }]
        });
      });
    });
  });
  describe(`loadPaginatedResults${LIST_INACTIVE_USERS.type}`, () => {
    test("should be ignored workers to page results", () => {
      const startingState = {
        ...initialState,
        workerContext: {
          workers: [{ name: "bob!" }]
        }
      };
      const payload = {
        results: {
          users: [
            { name: "I'm a worker!" }
          ]
        }
      };
      const action = {
        type: `loadPaginatedResults${LIST_INACTIVE_USERS.type}`,
        payload
      };
      const result = reducer(startingState, action);
      expect(result.workerContext).toEqual({
        workers: [
          { name: "bob!" }
        ]
      });
    });
  });
  describe(`loadPaginatedResults${LIST_RULES.type}`, () => {
    test("should set workers to page results", () => {
      const startingState = {
        ...initialState,
        rulesContext: {
          rules: [{ name: "I'm already here!" }],
          applications: [{ name: "I'm already here!" }],
          ruleRelationships: [{ name: "I'm already here!" }]
        }
      };
      const payload = {
        results: {
          rules: [{ name: "I'm new!" }],
          applications: [{ name: "I'm new!" }],
          ruleRelationships: [{ name: "I'm new!" }]
        }
      };
      const action = {
        type: `loadPaginatedResults${LIST_RULES.type}`,
        payload
      };
      const result = reducer(startingState, action);
      expect(result.rulesContext).toEqual({
        rules: [
          { name: "I'm already here!" },
          { name: "I'm new!" }
        ],
        applications: [
          { name: "I'm already here!" },
          { name: "I'm new!" }
        ],
        ruleRelationships: [
          { name: "I'm already here!" },
          { name: "I'm new!" }
        ]
      });
    });
    describe("isFirstPage === true", () => {
      test("should set workers to page results", () => {
        const startingState = {
          ...initialState,
          rulesContext: {
            rules: [{ name: "I'm already here!" }],
            applications: [{ name: "I'm already here!" }],
            ruleRelationships: [{ name: "I'm already here!" }]
          }
        };
        const payload = {
          isFirstPage: true,
          results: {
            rules: [{ name: "I'm new!" }],
            applications: [{ name: "I'm new!" }],
            ruleRelationships: [{ name: "I'm new!" }]
          }
        };
        const action = {
          type: `loadPaginatedResults${LIST_RULES.type}`,
          payload
        };
        const result = reducer(startingState, action);
        expect(result.rulesContext).toEqual({
          rules: [
            { name: "I'm new!" }
          ],
          applications: [
            { name: "I'm new!" }
          ],
          ruleRelationships: [
            { name: "I'm new!" }
          ]
        });
      });
    });
    describe("results are missing the expected key", () => {
      test("should set to initial state", () => {
        const startingState = {
          ...initialState,
          rulesContext: {
            rules: [{ name: "I'm already here!" }],
            applications: [{ name: "I'm already here!" }],
            ruleRelationships: [{ name: "I'm already here!" }]
          }
        };
        const payload = {
          results: {}
        };
        const action = {
          type: `loadPaginatedResults${LIST_RULES.type}`,
          payload
        };
        const result = reducer(startingState, action);
        expect(result.rulesContext).toEqual({
          rules: [{ name: "I'm already here!" }],
          applications: [{ name: "I'm already here!" }],
          ruleRelationships: [{ name: "I'm already here!" }]
        });
      });
    });
  });
  describe(`loadPaginatedResults${LIST_SOFTPHONE_CONFIG.type}`, () => {
    test("should set workers to page results", () => {
      const startingState = {
        ...initialState,
        profileContext: {
          profiles: [{ name: "I'm already here!" }],
          activities: [{ name: "I'm already here!" }],
          screenpops: [{ name: "I'm already here!" }],
          calltags: [{ name: "I'm already here!" }],
          accessGroups: [{ name: "I'm already here!" }],
          dialList: [{ name: "I'm already here!" }],
          directory: [{ name: "I'm already here!" }]
        }
      };
      const payload = {
        results: {
          profiles: [{ name: "I'm new!" }],
          activities: [{ name: "I'm new!" }],
          screenpops: [{ name: "I'm new!" }],
          calltags: [{ name: "I'm new!" }],
          accessGroups: [{ name: "I'm new!" }],
          dialList: [{ name: "I'm new!" }],
          directory: [{ name: "I'm new!" }]
        }
      };
      const action = {
        type: `loadPaginatedResults${LIST_SOFTPHONE_CONFIG.type}`,
        payload
      };
      const result = reducer(startingState, action);
      expect(result.profileContext).toEqual({
        profiles: [
          { name: "I'm already here!" },
          { name: "I'm new!" }
        ],
        activities: [
          { name: "I'm already here!" },
          { name: "I'm new!" }
        ],
        screenpops: [
          { name: "I'm already here!" },
          { name: "I'm new!" }
        ],
        calltags: [
          { name: "I'm already here!" },
          { name: "I'm new!" }
        ],
        accessGroups: [
          { name: "I'm already here!" },
          { name: "I'm new!" }
        ],
        dialList: [
          { name: "I'm already here!" },
          { name: "I'm new!" }
        ],
        directory: [
          { name: "I'm already here!" },
          { name: "I'm new!" }
        ]
      });
    });
    describe("isFirstPage === true", () => {
      test("should set workers to page results", () => {
        const startingState = {
          ...initialState,
          profileContext: {
            profiles: [{ name: "I'm already here!" }],
            activities: [{ name: "I'm already here!" }],
            screenpops: [{ name: "I'm already here!" }],
            calltags: [{ name: "I'm already here!" }],
            accessGroups: [{ name: "I'm already here!" }],
            dialList: [{ name: "I'm already here!" }],
            directory: [{ name: "I'm already here!" }]
          }
        };
        const payload = {
          isFirstPage: true,
          results: {
            profiles: [{ name: "I'm new!" }],
            activities: [{ name: "I'm new!" }],
            screenpops: [{ name: "I'm new!" }],
            calltags: [{ name: "I'm new!" }],
            accessGroups: [{ name: "I'm new!" }],
            dialList: [{ name: "I'm new!" }],
            directory: [{ name: "I'm new!" }]
          }
        };
        const action = {
          type: `loadPaginatedResults${LIST_SOFTPHONE_CONFIG.type}`,
          payload
        };
        const result = reducer(startingState, action);
        expect(result.profileContext).toEqual({
          profiles: [
            { name: "I'm new!" }
          ],
          activities: [
            { name: "I'm new!" }
          ],
          screenpops: [
            { name: "I'm new!" }
          ],
          calltags: [
            { name: "I'm new!" }
          ],
          accessGroups: [
            { name: "I'm new!" }
          ],
          dialList: [
            { name: "I'm new!" }
          ],
          directory: [
            { name: "I'm new!" }
          ]
        });
      });
    });
    describe("results are missing the expected key", () => {
      test("should set to initial state", () => {
        const startingState = {
          ...initialState,
          profileContext: {
            profiles: [{ name: "I'm already here!" }],
            activities: [{ name: "I'm already here!" }],
            screenpops: [{ name: "I'm already here!" }],
            calltags: [{ name: "I'm already here!" }],
            accessGroups: [{ name: "I'm already here!" }],
            dialList: [{ name: "I'm already here!" }],
            directory: [{ name: "I'm already here!" }]
          }
        };
        const payload = {
          results: {}
        };
        const action = {
          type: `loadPaginatedResults${LIST_SOFTPHONE_CONFIG.type}`,
          payload
        };
        const result = reducer(startingState, action);
        expect(result.profileContext).toEqual({
          profiles: [{ name: "I'm already here!" }],
          activities: [{ name: "I'm already here!" }],
          screenpops: [{ name: "I'm already here!" }],
          calltags: [{ name: "I'm already here!" }],
          accessGroups: [{ name: "I'm already here!" }],
          dialList: [{ name: "I'm already here!" }],
          directory: [{ name: "I'm already here!" }]
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
