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
  describe("SET_TIME_OF_DAYS", () => {
    //FAITH
    xtest("should set time of day for skill", () => {
      const result = skillReducer(initialSkillState, {
        type: skillActions.SET_TIME_OF_DAYS,
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
        ...initialSkillState,
        timeOfDay: {
          ...initialSkillState.timeOfDay,
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
});