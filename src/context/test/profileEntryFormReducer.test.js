import {
  profileEntryFormReducer,
  initialProfileEntryFormState,
  profileEntryFormActions
} from "context";
import { formModes } from "globals";

describe("profileEntryFormReducer", () => {

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
      const expectedState = {
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
      expect(result).toStrictEqual(expectedState);
    });
  });

  describe("SET_PROFILE_ID", () => {
    test("should set profileId to payload passed", () => {
      const expectedState = {
        ...initialProfileEntryFormState,
        profileId: 40
      };
      const action = {
        type: profileEntryFormActions.SET_PROFILE_ID,
        payload: 40
      };
      const result = profileEntryFormReducer(initialProfileEntryFormState, action);
      expect(result).toStrictEqual(expectedState);
    });
  });

  describe("SET_PROFILE_NAME", () => {
    test("should set profileName to payload passed", () => {
      const expectedState = {
        ...initialProfileEntryFormState,
        profileName: {
          value: "AISG",
          valid: true,
          updated: true
        }
      };
      const action = {
        type: profileEntryFormActions.SET_PROFILE_NAME,
        payload: {
          value: "AISG",
          valid: true,
          updated: true
        }
      };
      const result = profileEntryFormReducer(initialProfileEntryFormState, action);
      expect(result).toStrictEqual(expectedState);
    });
  });

  describe("SET_OVERFLOW_SKILL", () => {
    test("should set overflowSkill to payload passed", () => {
      const expectedState = {
        ...initialProfileEntryFormState,
        overflowSkill: {
          value: "overflowSkill",
          valid: true,
          updated: true
        }
      };
      const action = {
        type: profileEntryFormActions.SET_OVERFLOW_SKILL,
        payload: {
          value: "overflowSkill",
          valid: true,
          updated: true
        }
      };
      const result = profileEntryFormReducer(initialProfileEntryFormState, action);
      expect(result).toStrictEqual(expectedState);
    });
  });

  describe("UPDATE_ACTIVITIES_LIST", () => {
    test("should set activitiesList to payload passed", () => {
      const expectedState = {
        ...initialProfileEntryFormState,
        activitiesList: [2,3],
        activitiesUpdated: true
      };
      const action = {
        type: profileEntryFormActions.UPDATE_ACTIVITIES_LIST,
        payload: [2,3]
      };
      const result = profileEntryFormReducer(initialProfileEntryFormState, action);
      expect(result).toStrictEqual(expectedState);
    });
  });

  describe("SET_UPDATE_PROFILE_FORM_STATE", () => {
    test("should set edit prepopulated fields to state", () => {
      const profile = {
        profile_id: 0,
        profile_nme: "Game of Phones",
        recorded_i: {
          type: "Buffer",
          data: [0]
        },
        auto_answd_i: {
          type: "Buffer",
          data: [1]
        },
        pmt_prcsg_i: {
          type: "Buffer",
          data: [0]
        },
        otbnd_recorded_i: {
          type: "Buffer",
          data: [0]
        },
        acw_option_i: {
          type: "Buffer",
          data: [0]
        },
        manual_recorded_i: {
          type: "Buffer",
          data: [0]
        },
        acw_data_entry_i: {
          type: "Buffer",
          data: [0]
        },
        manual_record_inbound_i: {
          type: "Buffer",
          data: [0]
        },
        agent_assisted_pay_i: {
          type: "Buffer",
          data: [1]
        },
        overflow_skill: null,
        policy_number_edit_i: {
          type: "Buffer",
          data: [0]
        },
        voice_mail_transcription_i: {
          type: "Buffer",
          data: [0]
        },
        click_to_dial_i: {
          type: "Buffer",
          data: [1]
        },
        activities: "[{\"id\": 1, \"name\": \"Offline\", \"availability\": 0}]"
      };

      const expectedState = {
        ...initialProfileEntryFormState,
        activitiesList: [{
          activity_id: 1,
          activity_nme: "Offline",
          available_i: {
            data: [
              0
            ],
            type: "Buffer"
          }
        }],
        formMode: formModes.UPDATE,
        autoAnswered: {
          value: true
        },
        inboundRecorded: {
          value: false
        },
        outboundRecorded: {
          value: false
        },
        acwOption: {
          value: false
        },
        manualRecorded: {
          value: false
        },
        acwDataEntry: {
          value: false
        },
        manualRecordedInbound: {
          value: false
        },
        agentAssistedPay: {
          value: true
        },
        paymentProcessing: {
          value: false
        },
        policyNumberEdit: {
          value: false
        },
        voiceMailTranscription: {
          value: false
        },
        overflowSkill: {
          value: "",
          valid: true
        },
        profileId: 0,
        profileName: {
          valid: true,
          value: "Game of Phones"
        }
      };
      const action = {
        type: profileEntryFormActions.SET_UPDATE_PROFILE_FORM_STATE,
        payload: {
          formMode: formModes.UPDATE,
          profile
        }
      };
      const result = profileEntryFormReducer(initialProfileEntryFormState, action);
      expect(result).toStrictEqual(expectedState);
    });
  });
});