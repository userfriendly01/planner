import {
  profileEntryFormReducer,
  initialProfileEntryFormState,
  profileEntryFormActions
} from "context";

describe("userFormReducer", () => {

  describe("Default Case", () => {
    test("should return state", () => {
      const action = { type: "default" };
      const result = profileEntryFormReducer(initialProfileEntryFormState, action);
      expect(result).toStrictEqual(initialProfileEntryFormState);
    });
  });

  describe("RESET_FORM", () => {
    test("should reset form to initial state", () => {
      const initialTestState = {
        ...initialProfileEntryFormState,
        policyNumberEdit: {
          value: false
        },
        activitiesList: [2,3]
      };
      const action = { type: profileEntryFormActions.RESET_FORM };
      const result = profileEntryFormReducer(initialTestState, action);
      expect(result).toStrictEqual(initialProfileEntryFormState);
    });
  });

  describe("TOGGLE", () => {
    test("should toggle passed fieldKey in form", () => {
      const initialTestState = {
        ...initialProfileEntryFormState,
        policyNumberEdit: {
          value: true,
          updated: true
        }
      };
      const action = {
        type: profileEntryFormActions.TOGGLE,
        fieldKey: "policyNumberEdit"
      };
      const result = profileEntryFormReducer(initialProfileEntryFormState, action);
      expect(result).toStrictEqual(initialTestState);
    });
  });

  describe("SET_PROFILE_ID", () => {
    test("should set profileId to payload passed", () => {
      const initialTestState = {
        ...initialProfileEntryFormState,
        profileId: 40
      };
      const action = {
        type: profileEntryFormActions.SET_PROFILE_ID,
        payload: 40
      };
      const result = profileEntryFormReducer(initialProfileEntryFormState, action);
      expect(result).toStrictEqual(initialTestState);
    });
  });

  describe("SET_PROFILE_NAME", () => {
    test("should set profileName to payload passed", () => {
      const initialTestState = {
        ...initialProfileEntryFormState,
        profileName: {
          some: "payload"
        }
      };
      const action = {
        type: profileEntryFormActions.SET_PROFILE_NAME,
        payload: { some: "payload" }
      };
      const result = profileEntryFormReducer(initialProfileEntryFormState, action);
      expect(result).toStrictEqual(initialTestState);
    });
  });

  describe("SET_OVERFLOW_SKILL", () => {
    test("should set overflowSkill to payload passed", () => {
      const initialTestState = {
        ...initialProfileEntryFormState,
        overflowSkill: {
          some: "payload"
        }
      };
      const action = {
        type: profileEntryFormActions.SET_OVERFLOW_SKILL,
        payload: { some: "payload" }
      };
      const result = profileEntryFormReducer(initialProfileEntryFormState, action);
      expect(result).toStrictEqual(initialTestState);
    });
  });

  describe("UPDATE_ACTIVITIES_LIST", () => {
    test("should set activittiesList to payload passed", () => {
      const initialTestState = {
        ...initialProfileEntryFormState,
        activitiesList: [2,3],
        activitiesUpdated: true
      };
      const action = {
        type: profileEntryFormActions.UPDATE_ACTIVITIES_LIST,
        payload: [2,3]
      };
      const result = profileEntryFormReducer(initialProfileEntryFormState, action);
      expect(result).toStrictEqual(initialTestState);
    });
  });

});