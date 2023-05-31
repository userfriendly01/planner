import {
  initialState,
  reducer
} from "context";
import { skillsList } from "testUtils";
import { formatSkillGroups } from "utils";

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
  describe("addOffice", () => {
    test("should add to the office map", () => {
      const payload ={
        office_nme: "The Dova",
        office_num: "016D"
      };
      const action = {
        type: "addOffice",
        payload
      };
      const initialOffices = new Map([["024", {
        office_nme: "Initial Office",
        office_num: "024"
      }]]);
      const testState = {
        ...initialState,
        officeContext: {
          offices: initialOffices
        }
      };
      const result = reducer(testState, action);
      expect(result.officeContext.offices).toEqual(initialOffices.set(payload.office_num, payload));
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
  describe("loadOffices", () => {
    test("should initialize a map from the offices map sent in", () => {
      const payload = new Map([
        [
          "A1",
          {
            office_nme: "Test1",
            office_num: "A1"
          }
        ],
        [
          "A2",
          {
            office_nme: "Test2",
            office_num: "A2"
          }
        ]
      ]);
      const action = {
        type: "loadOffices",
        payload
      };
      const result = reducer(initialState, action);
      expect(result.officeContext.offices).toEqual(payload);
    });
  });
  describe("loadCalabrioOrg", () => {
    test("should initialize a map from the offices map sent in", () => {
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
    test("should initialize a map from the offices map sent in", () => {
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
  describe("loadCalabrioUsers", () => {
    test("should initialize a map from the offices map sent in", () => {
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
    test("should initialize a map from the offices map sent in", () => {
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
  describe("loadWorkers", () => {
    test("should update wfmOrg only", () => {
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
        type: "loadWorkers",
        payload
      };
      const result = reducer(initialState, action);
      expect(result.workerContext.workers).toEqual(payload);
    });
  });
  describe("updateWfmOrg", () => {
    test("should update wfmOrg only", () => {
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
        type: "updateWfmOrg",
        payload
      };
      const result = reducer(initialState, action);
      expect(result.calabrioContext.wfmOrg).toEqual(payload);
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
              name: "billy",
            },
          ]
        }
      ]);
      expect(result.calabrioContext.wfmErrors).toEqual(payload.errors);
    });
  });
  describe("loadWfmOptions", () => {
    test("should initialize a map from the offices map sent in", () => {
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
    test("should update skilContext.skills to payload", () => {
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
      expect(result.skillContext.skills).toEqual(payload);
    });
  });
  describe("loadSkillGroupss", () => {
    test("should update skilContext.skillGroups to payload", () => {
      const payload = [
        {
          name: "lscOBDialer1",
          ctmSkillId: 1,
          ctmSkillDisplayName: "lsc OB Dialer 1",
          ctmSkillGroups: [{
            skillGroupId: 1,
            skillGroupNme: "skillgroup1",
            skills: [{
              name: "lscOBDialer1",
              ctmSkillId: 1
            }, {
              name: "aisgL1",
              ctmSkillId: 2
            }]
          }],
          profiles: [{
            profileName: "Licensed Sales Center",
            profileId: 32
          }],
          flashMessage: "",
          closedMessage: "",
          levels: [ 1, 2, 3],
          timeOfDays: [],
          vhCallTarget: null,
          vhCallerId: null,
          vhThreshold: null
        },
        {
          name: "aisgL1",
          ctmSkillId: 2,
          ctmSkillDisplayName: "aisg L1",
          ctmSkillGroups: [{
            skillGroupId: 1,
            skillGroupNme: "skillgroup1",
            skills: [{
              name: "lscOBDialer1",
              ctmSkillId: 1
            }, {
              name: "aisgL1",
              ctmSkillId: 2
            }]
          }],
          profiles: [{
            profileName: "AISG",
            profileId: 4
          }],
          flashMessage: "",
          closedMessage: "Sorry, we're closed.",
          levels: [],
          timeOfDays: [],
          vhCallTarget: null,
          vhCallerId: null,
          vhThreshold: null
        }
      ];
      const action = {
        type: "loadSkillGroups",
        payload
      };
      const result = reducer(initialState, action);
      expect(result.skillContext.skillGroups).toEqual(formatSkillGroups(payload));
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
  describe("updateSkills", () => {
    test("should set the skills array on skillContext", () => {
      const action = {
        type: "updateSkills",
        payload: skillsList
      };
      const result = reducer(initialState, action);
      expect(result).toEqual({
        ...initialState,
        skillContext: {
          ...initialState.skillContext,
          skills: skillsList
        }
      });
    });
  });
});