import { mockTaskQueues } from "testUtils";
import {
  skillActions,
  skillReducer,
  initialSkillState
} from "../reducers/skillReducer";
import { formatSkillGroups } from "utils/skillsUtils";

jest.mock("utils/skillsUtils", () => ({
  formatSkillGroups: jest.fn()
}));

describe("skillReducer", () => {
  describe("default case", () => {
    test("should return state", () => {
      const result = skillReducer(initialSkillState, {});
      expect(result).toEqual(initialSkillState);
    });
  });
  describe("LOAD_SKILLS", () => {
    test("should load skills", () => {
      const skills = [{ "name": "skillId" }];
      const result = skillReducer(initialSkillState, {
        type: skillActions.LOAD_SKILLS,
        payload: skills
      });
      expect(result).toEqual({
        ...initialSkillState,
        skills
      });
    });
  });
  describe("LOAD_SKILL_GROUPS", () => {
    beforeEach(() => {
      formatSkillGroups.mockImplementation(sg => sg);
    });
    test("should load skill groups", () => {
      const skillGroups = [{ "name": "groupId" }];
      const result = skillReducer(initialSkillState, {
        type: skillActions.LOAD_SKILL_GROUPS,
        payload: skillGroups
      });
      expect(result).toEqual({
        ...initialSkillState,
        skillGroups
      });
    });
  });
  describe("LOAD_SKILL_OPTIONS", () => {
    test("should load skill options", () => {
      const applications = [{ "name": "applicationId" }];
      const timeOfDays = [{ "name": "todId" }];
      const taskQueues = [{ "name": "queueId" }];
      const operatingUnits = [{ "name": "ouId" }];
      const result = skillReducer(initialSkillState, {
        type: skillActions.LOAD_SKILL_OPTIONS,
        payload: {
          applications,
          timeOfDays,
          taskQueues,
          operatingUnits
        }
      });
      expect(result).toEqual({
        ...initialSkillState,
        applications,
        timeOfDays,
        taskQueues,
        operatingUnits
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