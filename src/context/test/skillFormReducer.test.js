import {
  skillFormActions,
  skillFormReducer,
  initialSkillFormState
} from "context";
import { formModes } from "globals";

describe("skillFormReducer", () => {
  describe("default case", () => {
    test("should return state", () => {
      const result = skillFormReducer(initialSkillFormState, {});
      expect(result).toEqual(initialSkillFormState);
    });
  });
  describe("RESET_FORM", () => {
    test("should return intial skill form state", () => {
      const NonInitialFormState = {
        ...initialSkillFormState,
        skillFriendlyName: "hello!",
        taskQueueSid: "TQ123"
      };
      const result = skillFormReducer(NonInitialFormState, {
        type: skillFormActions.RESET_FORM
      });
      expect(result).toEqual(initialSkillFormState);
    });
  });
  describe("SET_SKILL_FRIENDLY_NAME", () => {
    test("should set skillFriendlyName", () => {
      const result = skillFormReducer(initialSkillFormState, {
        type: skillFormActions.SET_SKILL_FRIENDLY_NAME,
        payload: "cool skill name"
      });
      expect(result).toEqual({
        ...initialSkillFormState,
        skillFriendlyName: "cool skill name"
      });
    });
  });
  describe("SET_SKILL_NUM", () => {
    test("should set skillNum", () => {
      const result = skillFormReducer(initialSkillFormState, {
        type: skillFormActions.SET_SKILL_NUM,
        payload: "YO I AM SKILLNUM"
      });
      expect(result).toEqual({
        ...initialSkillFormState,
        skillNum: "YO I AM SKILLNUM"
      });
    });
  });
  describe("SET_TASK_QUEUE", () => {
    test("should set taskQueueSid", () => {
      const result = skillFormReducer(initialSkillFormState, {
        type: skillFormActions.SET_TASK_QUEUE,
        payload: "TQ123456"
      });
      expect(result).toEqual({
        ...initialSkillFormState,
        taskQueueSid: "TQ123456"
      });
    });
  });
  describe("SET_PROFILE_IDS", () => {
    test("should set profileIds", () => {
      const result = skillFormReducer(initialSkillFormState, {
        type: skillFormActions.SET_PROFILE_IDS,
        payload: [1, 2, 3]
      });
      expect(result).toEqual({
        ...initialSkillFormState,
        profileIds: [1, 2, 3]
      });
    });
  });
  describe("SET_VH_CALL_TARGET", () => {
    test("should set vhCallTarget", () => {
      const result = skillFormReducer(initialSkillFormState, {
        type: skillFormActions.SET_VH_CALL_TARGET,
        payload: {
          value: "1231231234",
          valid: true,
          e164: "+1231231234"
        }
      });
      expect(result).toEqual({
        ...initialSkillFormState,
        vhCallTarget: {
          value: "1231231234",
          valid: true,
          e164: "+1231231234"
        }
      });
    });
  });
  describe("SET_VH_THRESHOLD", () => {
    test("should set vhThreshold", () => {
      const result = skillFormReducer(initialSkillFormState, {
        type: skillFormActions.SET_VH_THRESHOLD,
        payload: "120"
      });
      expect(result).toEqual({
        ...initialSkillFormState,
        vhThreshold: "120"
      });
    });
  });
  describe("SET_VH_TIME_OF_DAYS", () => {
    test("should set time of day for vh", () => {
      const result = skillFormReducer(initialSkillFormState, {
        type: skillFormActions.SET_VH_TIME_OF_DAYS,
        payload: {
          sunday: 1,
          monday: 3,
          tuesday: 3,
          wednesday: 3,
          thursday: 3,
          friday: 3,
          saturday: 1
        }
      });
      expect(result).toEqual({
        ...initialSkillFormState,
        timeOfDay: {
          ...initialSkillFormState.timeOfDay,
          vh: {
            sunday: 1,
            monday: 3,
            tuesday: 3,
            wednesday: 3,
            thursday: 3,
            friday: 3,
            saturday: 1
          }
        }
      });
    });
  });
  describe("SET_TIME_OF_DAYS", () => {
    test("should set time of day for skill", () => {
      const result = skillFormReducer(initialSkillFormState, {
        type: skillFormActions.SET_TIME_OF_DAYS,
        payload: {
          sunday: 11,
          monday: 13,
          tuesday: 13,
          wednesday: 13,
          thursday: 13,
          friday: 13,
          saturday: 11
        }
      });
      expect(result).toEqual({
        ...initialSkillFormState,
        timeOfDay: {
          ...initialSkillFormState.timeOfDay,
          skill: {
            sunday: 11,
            monday: 13,
            tuesday: 13,
            wednesday: 13,
            thursday: 13,
            friday: 13,
            saturday: 11
          }
        }
      });
    });
  });
  describe("SET_APPLICATION_ID", () => {
    test("should set applicationId", () => {
      const result = skillFormReducer(initialSkillFormState, {
        type: skillFormActions.SET_APPLICATION_ID,
        payload: 12
      });
      expect(result).toEqual({
        ...initialSkillFormState,
        applicationId: 12
      });
    });
  });
  describe("SET_ENABLE_VIRTUAL_HOLD", () => {
    test("should set profileIds", () => {
      const result = skillFormReducer(initialSkillFormState, {
        type: skillFormActions.SET_ENABLE_VIRTUAL_HOLD,
        payload: true
      });
      expect(result).toEqual({
        ...initialSkillFormState,
        enableVirtualHold: true
      });
    });
  });
});