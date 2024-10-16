import {
  mockSkills, mockTaskQueues
} from "testUtils";
import {
  skillActions,
  skillReducer,
  initialSkillState
} from "../reducers/skillReducer";

describe("skillReducer", () => {
  describe("default case", () => {
    test("should return state", () => {
      const result = skillReducer(initialSkillState, {});
      expect(result).toEqual(initialSkillState);
    });
  });
  describe("ADD_SKILL", () => {
    const skillForm = {
      formMode: "INSERT",
      name: "newSkill",
      applicationId: 2,
      profileIds: [15,3],
      levels: {
        min: null,
        max: null
      },
      timeOfDays: {
        timeOfDayId: 9,
        dayOfWeekId: 3,
        vhTimeOfDayId: 4
      },
      vhThreshold: 880,
      vhCallTarget: 321325
    };
    test("should add new skill to array of skills", () => {
      const payload = {
        ...skillForm,
        taskQueue: {
          isNew: false,
          sid: "TQ32158846",
          friendly_name: "Existing Task Queue"
        }
      };
      const result = skillReducer(initialSkillState, {
        type: skillActions.ADD_SKILL,
        payload
      });
      const expectedPayload = {
        ...initialSkillState,
        skills: [...initialSkillState.skills, {
          discrepancies: [],
          name: payload.name,
          levels: [],
          profileIds: payload.profileIds,
          taskQueueSid: payload.taskQueue.sid,
          taskQueueName: payload.taskQueue.friendly_name,
          skillGroupIds: [],
          applicationId: payload.applicationId,
          closedMessage: null,
          flashMessage: null,
          timeOfDays: payload.timeOfDays,
          vhCallTarget: payload.vhCallTarget,
          vhThreshold: payload.vhThreshold
        }]
      };
      expect(result).toEqual(expectedPayload);
    });
    describe("task queue is new", () => {
      test("should update skills and task queues", () => {
        const payload = {
          ...skillForm,
          levels: {
            min: { value: 2 },
            max: { value: 4 }
          },
          taskQueue: {
            isNew: true,
            sid: "TQ32158846",
            friendly_name: "New Task Queue"
          }
        };
        const result = skillReducer(initialSkillState, {
          type: skillActions.ADD_SKILL,
          payload
        });
        const expectedPayload = {
          ...initialSkillState,
          skills: [...initialSkillState.skills, {
            discrepancies: [],
            name: payload.name,
            levels: [2,3,4],
            profileIds: payload.profileIds,
            taskQueueSid: payload.taskQueue.sid,
            taskQueueName: payload.taskQueue.friendly_name,
            skillGroupIds: [],
            applicationId: payload.applicationId,
            closedMessage: null,
            flashMessage: null,
            timeOfDays: payload.timeOfDays,
            vhCallTarget: payload.vhCallTarget,
            vhThreshold: payload.vhThreshold
          }],
          taskQueues: [...initialSkillState.taskQueues, payload.taskQueue]
        };
        expect(result).toEqual(expectedPayload);
      });
    });
  });
  describe("UPDATE_SKILL", () => {
    test("should add new skill to array of skills", () => {
      const payload = {
        skillName: mockSkills[0].name,
        changes: {
          taskQueue: {
            sid: "TQ32158846",
            friendly_name: "Existing Task Queue"
          },
          levels: {
            min: null,
            max: null
          }
        },
        taskQueue: {
          sid: "TQ32158846",
          friendly_name: "Existing Task Queue"
        }
      };
      const result = skillReducer({
        ...initialSkillState,
        skills: [ mockSkills[0], mockSkills[1]]
      }, {
        type: skillActions.UPDATE_SKILL,
        payload
      });
      const expectedPayload = {
        ...initialSkillState,
        taskQueues: [payload.taskQueue],
        skills: [
          {
            ...mockSkills[0],
            levels: [],
            taskQueueSid: "TQ32158846",
            taskQueueName: "Existing Task Queue"
          },
          mockSkills[1]
        ]
      };
      expect(result).toEqual(expectedPayload);
    });
    describe("task queue is new", () => {
      test("should update skills and task queues", () => {
        const payload = {
          skillName: mockSkills[0].name,
          changes: {
            levels: {
              min: { value: 2 },
              max: { value: 4 }
            }
          },
          taskQueue: null
        };
        const result = skillReducer({
          ...initialSkillState,
          skills: [ mockSkills[0], mockSkills[1]]
        }, {
          type: skillActions.UPDATE_SKILL,
          payload
        });
        const expectedPayload = {
          ...initialSkillState,
          skills: [
            {
              ...mockSkills[0],
              levels: [2,3,4]
            },
            mockSkills[1]
          ]
        };
        expect(result).toEqual(expectedPayload);
      });
    });
  });
  describe("DELETE_SKILL", () => {
    test("should add new skill to array of skills", () => {
      const payload = {
        skillName: mockSkills[0].name,
        taskQueue: mockTaskQueues[0].sid
      };
      const result = skillReducer({
        ...initialSkillState,
        skills: [ mockSkills[0], mockSkills[1]],
        taskQueues: [ mockTaskQueues[0], mockTaskQueues[1]]
      }, {
        type: skillActions.DELETE_SKILL,
        payload
      });
      const expectedPayload = {
        ...initialSkillState,
        taskQueues: [mockTaskQueues[1]],
        skills: [mockSkills[1]]
      };
      expect(result).toEqual(expectedPayload);
    });
    describe("task queue is populated", () => {
      test("should add new skill to array of skills", () => {
        const payload = {
          skillName: mockSkills[0].name
        };
        const result = skillReducer({
          ...initialSkillState,
          skills: [ mockSkills[0], mockSkills[1]]
        }, {
          type: skillActions.DELETE_SKILL,
          payload
        });
        const expectedPayload = {
          ...initialSkillState,
          skills: [mockSkills[1]]
        };
        expect(result).toEqual(expectedPayload);
      });
    });
  });
  describe("ADD_SKILL_GROUP", () => {
    test("should add skill group to selected skills", () => {
      const noSkillGroups = {
        name: "noSkillGroups"
      };

      const payload = {
        id: "mockSkillGroupId",
        skills: [mockSkills[0].name, noSkillGroups.name]
      };

      const result = skillReducer({
        ...initialSkillState,
        skills: [ mockSkills[0], mockSkills[1], noSkillGroups]
      }, {
        type: skillActions.ADD_SKILL_GROUP,
        payload
      });
      const expectedPayload = {
        ...initialSkillState,
        skillGroups: [payload],
        skills: [
          {
            ...mockSkills[0],
            skillGroupIds: [
              ...mockSkills[0].skillGroupIds,
              payload.id
            ]
          },
          mockSkills[1],
          {
            ...noSkillGroups,
            skillGroupIds: [payload.id]
          }
        ]
      };
      expect(result).toEqual(expectedPayload);
    });
  });
  describe("UPDATE_SKILL_GROUP", () => {
    test("should add skill group to selected skills", () => {
      const skillNoGroupToGroup = {
        name: "skillNoGroupToGroup",
        skillGroupIds: []
      };

      const payload = {
        id: "mockSkillGroupId",
        skillGroup: {
          id: "mockSkillGroupId",
          skills: [skillNoGroupToGroup.name]
        }
      };

      const skillGroupToNoGroup = {
        name: "skillGroupToNoGroup",
        skillGroupIds: [payload.skillGroup.id]
      };

      const result = skillReducer({
        ...initialSkillState,
        skills: [skillNoGroupToGroup, skillGroupToNoGroup],
        skillGroups: [{
          id: "mockSkillGroupId",
          skills: [skillGroupToNoGroup.name]
        }]
      }, {
        type: skillActions.UPDATE_SKILL_GROUP,
        payload
      });
      const expectedPayload = {
        ...initialSkillState,
        skillGroups: [payload.skillGroup],
        skills: [
          {
            ...skillNoGroupToGroup,
            skillGroupIds: [payload.id]
          },
          {
            ...skillGroupToNoGroup,
            skillGroupIds: []
          }
        ]
      };
      expect(result).toEqual(expectedPayload);
    });
  });
  describe("DELETE_SKILL_GROUP", () => {
    test("should add new skill to array of skills", () => {
      const skillGroupId = "butts";

      const testSkill = {
        skillGroupIds: [skillGroupId]
      };

      const result = skillReducer({
        ...initialSkillState,
        skills: [ testSkill ],
        skillGroups: [ { id: skillGroupId }]
      }, {
        type: skillActions.DELETE_SKILL_GROUP,
        payload: skillGroupId
      });
      const expectedPayload = {
        ...initialSkillState,
        skillGroups: [],
        skills: [{
          ...testSkill,
          skillGroupIds: []
        }]
      };
      expect(result).toEqual(expectedPayload);
    });
  });
  describe("LOAD_SKILL_STATE", () => {
    test("should load skills", () => {
      const skills = [{ "name": "skillId" }];
      const skillGroups = [{ "name": "skillGroup" }];
      const applications = [{ "name": "applications" }];
      const timeOfDays = [{ "name": "timeOfDays" }];
      const taskQueues = [{ "name": "taskQueues" }];
      const operatingUnits = [{ "name": "operatingUnits" }];

      const payload = {
        skills,
        skillGroups,
        applications,
        timeOfDays,
        taskQueues,
        operatingUnits
      };

      const result = skillReducer(initialSkillState, {
        type: skillActions.LOAD_SKILL_STATE,
        payload
      });
      expect(result).toEqual({
        ...initialSkillState,
        ...payload
      });
    });
  });
  describe("RESET_FORM", () => {
    test("should return intial skill form state", () => {
      const NonInitialFormState = {
        ...initialSkillState,
        skillForm: {
          applicationId: 12
        }
      };
      const result = skillReducer(NonInitialFormState, {
        type: skillActions.RESET_FORM
      });
      expect(result).toEqual(initialSkillState);
    });
  });
  describe("SET_FORM_FIELD", () => {
    test("should set specified field", () => {
      const result = skillReducer(initialSkillState, {
        type: skillActions.SET_FORM_FIELD,
        payload: {
          key: "name",
          value: "New Skill"
        }
      });
      expect(result).toEqual({
        ...initialSkillState,
        skillForm: {
          ...initialSkillState.skillForm,
          name: "New Skill"
        }
      });
    });
  });
  describe("CLEAR_FORM_FIELD", () => {
    test("should clear specified field", () => {
      const NonInitialFormState = {
        ...initialSkillState,
        skillForm: {
          ...initialSkillState.skillForm,
          name: "oops not that skill",
          applicationId: 12
        }
      };
      const result = skillReducer(NonInitialFormState, {
        type: skillActions.CLEAR_FORM_FIELD,
        payload: "name"
      });
      expect(result).toEqual({
        ...initialSkillState,
        skillForm: {
          ...initialSkillState.skillForm,
          applicationId: 12
        }
      });
    });
  });
  describe("SET_TIME_OF_DAYS", () => {
    test("should set time of day for skill", () => {
      const initialState = {
        ...initialSkillState,
        skillForm: {
          ...initialSkillState.skillForm,
          timeOfDays: [
            {
              dayOfWeekId: 1,
              timeOfDayId: 4
            }
          ]
        }
      };

      const expectedResult = JSON.parse(JSON.stringify(initialState));

      let payload = {
        type: skillActions.SET_TIME_OF_DAYS,
        payload: {
          dayOfWeekId: 1,
          timeOfDayId: 7,
          vhTimeOfDayId: 4
        }
      };
      expectedResult.skillForm.timeOfDays = [{
        dayOfWeekId: 1,
        timeOfDayId: 7,
        vhTimeOfDayId: 4
      }];
      let result = skillReducer(initialState, payload);
      expect(result).toEqual(expectedResult);

      payload = {
        type: skillActions.SET_TIME_OF_DAYS,
        payload: {
          dayOfWeekId: 4,
          timeOfDayId: 3
        }
      };
      expectedResult.skillForm.timeOfDays = [
        {
          dayOfWeekId: 1,
          timeOfDayId: 4
        },
        {
          dayOfWeekId: 4,
          timeOfDayId: 3
        }
      ];
      result = skillReducer(initialState, payload);
      expect(result).toEqual(expectedResult);
    });
  });
  describe("SET_UPDATE_SKILL_FORM", () => {
    test("should set update form", () => {
      const selectedSkill = {
        name: "aisgL1",
        applicationId: 2,
        discrepancies: ["I dont match!"],
        taskQueueSid: "WT123456",
        taskQueueName: "aisg L1",
        skillGroupIds: ["1"],
        profileIds: [4],
        levels: [1,2,3,4],
        timeOfDays: [{
          timeOfDayId: 1,
          dayOfWeekId: 2,
          vhTimeOfDayId: 1
        }],
        vhCallTarget: "12345",
        vhThreshold: 123415
      };
      const payload = {
        type: skillActions.SET_UPDATE_SKILL_FORM,
        payload: {
          skill: selectedSkill,
          taskQueue: mockTaskQueues[0]
        }
      };
      const expectedResult = {
        ...initialSkillState,
        skillForm: {
          formMode: "update",
          name: "aisgL1",
          levels: {
            min: {
              value: 1,
              label: "1"
            },
            max: {
              value: 4,
              label: "4"
            }
          },
          applicationId: 2,
          taskQueue: {
            isNew: false,
            target_workers: mockTaskQueues[0].target_workers,
            sid: mockTaskQueues[0].sid,
            friendly_name: mockTaskQueues[0].friendly_name,
            operating_unit_sid: mockTaskQueues[0].operating_unit_sid
          },
          profileIds: [4],
          vhCallTarget: "12345",
          vhThreshold: "123415",
          timeOfDays: [
            {
              "dayOfWeekId": 1,
              "timeOfDayId": undefined,
              "vhTimeOfDayId": undefined
            },
            {
              "dayOfWeekId": 2,
              "timeOfDayId": 1,
              "vhTimeOfDayId": 1
            },
            {
              "dayOfWeekId": 3,
              "timeOfDayId": undefined,
              "vhTimeOfDayId": undefined
            },
            {
              "dayOfWeekId": 4,
              "timeOfDayId": undefined,
              "vhTimeOfDayId": undefined
            },
            {
              "dayOfWeekId": 5,
              "timeOfDayId": undefined,
              "vhTimeOfDayId": undefined
            },
            {
              "dayOfWeekId": 6,
              "timeOfDayId": undefined,
              "vhTimeOfDayId": undefined
            },
            {
              "dayOfWeekId": 7,
              "timeOfDayId": undefined,
              "vhTimeOfDayId": undefined
            }
          ]
        }
      };
      const result = skillReducer(initialSkillState, payload);
      expect(result).toEqual(expectedResult);
    });
  });
});