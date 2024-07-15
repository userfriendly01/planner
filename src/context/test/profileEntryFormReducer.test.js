import { mockProfiles } from "testUtils";
import {
  profileEntryFormReducer,
  initialProfileEntryFormState,
  profileEntryFormActions
} from "../reducers/profileEntryFormReducer";
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
        activitiesList: [2, 3]
      };
      const action = { type: profileEntryFormActions.RESET_FORM };
      const result = profileEntryFormReducer(initialTestState, action);
      expect(result).toStrictEqual(initialProfileEntryFormState);
    });
  });

  describe("SET_FORM_FIELD", () => {
    test("should set selected form field ", () => {
      const expectedState = {
        ...initialProfileEntryFormState,
        policyNumberEdit: true
      };
      const action = {
        type: profileEntryFormActions.SET_FORM_FIELD,
        payload: {
          key: "policyNumberEdit",
          value: true
        }
      };
      const result = profileEntryFormReducer(initialProfileEntryFormState, action);
      expect(result).toStrictEqual(expectedState);
    });
  });

  describe("CLEAR_FORM_FIELD", () => {
    test("should set selected form field to intial state", () => {
      const initialState = {
        ...initialProfileEntryFormState,
        policyNumberEdit: true
      };
      const action = {
        type: profileEntryFormActions.CLEAR_FORM_FIELD,
        payload: "policyNumberEdit"
      };
      const result = profileEntryFormReducer(initialState, action);
      expect(result).toStrictEqual(initialProfileEntryFormState);
    });
  });

  describe("SET_UPDATE_PROFILE_FORM_STATE", () => {
    test("should set edit prepopulated fields to state", () => {
      const expectedState = {
        formMode: formModes.UPDATE,
        profileId: 0,
        activitiesList: [
          {
            activity_name: "Offline",
            activity_sid: "5",
            available: false
          },
          {
            activity_name: "Petting Cats",
            activity_sid: "7",
            available: true
          }
        ],
        callTagsList: [
          {
            display_name: "Negotiation Type",
            attribute_name: "negotiation_type",
            options: [
              "Info Exchange",
              "Bargaining",
              "Closing"
            ]
          },
          {
            display_name: "Claim Number",
            attribute_name: "claim_number",
            options: null
          }
        ],
        autoAnswered: true,
        inboundRecorded: true,
        outboundRecorded: true,
        acwOption: true,
        manualRecorded: true,
        acwDataEntry: true,
        manualRecordedInbound: true,
        agentAssistedPay: true,
        paymentProcessing: true,
        policyNumberEdit: true,
        voiceMailTranscription: true,
        callReason: true,
        clickToDial: true,
        eftAuthorization: true,
        claimNumberEdit: true,
        ftoBackup: true,
        overflowSkill: "lscOBDialer1",
        profileName: "Game of Phones",
        transferQueues: [
          "WQda5066ddff9e0eebf2f168e40d98cc19",
          "WQ9e7f40c067bb9006022f43266122a257"
        ],
        screenpops: [{
          id: "2hTaQUwxFmf2zanRlQ4lrnbkYaI",
          display_name: "Intent",
          attribute_name: "callIntent"
        }],
        operatingUnit: {
          ou_name: "Claims",
          ou_sid: "OUe98d4f81e49ccf1ae16b29f8611d1b6c"
        },
        accessGroup: {
          access_group_name: "Canon",
          twilio_dashboard_url: "https://analytics.ytica.com/dashboard.html#workspace=/gdc/workspaces/pdgson3f19xo7p6109q1v7ecfjyc5snb&dashboard=/gdc/md/pdgson3f19xo7p6109q1v7ecfjyc5snb/obj/10546934",
          id: "2hTZxPiac4Bur9tn5pafmEjag1E"
        },
        forwardToNum: {
          value: "8665680296",
          unmaskedValue: "8665680296",
          e164: "",
          updated: false,
          valid: true
        }
      };
      const action = {
        type: profileEntryFormActions.SET_UPDATE_PROFILE_FORM_STATE,
        payload: mockProfiles[0]
      };
      const result = profileEntryFormReducer(initialProfileEntryFormState, action);
      expect(result).toStrictEqual(expectedState);
    });
    test("should set edit prepopulated fields to state, null fields are handled", () => {
      const expectedState = {
        formMode: formModes.UPDATE,
        profileId: 1,
        activitiesList: [],
        callTagsList: [],
        autoAnswered: false,
        inboundRecorded: false,
        outboundRecorded: false,
        acwOption: false,
        manualRecorded: false,
        acwDataEntry: false,
        manualRecordedInbound: false,
        agentAssistedPay: false,
        paymentProcessing: false,
        policyNumberEdit: false,
        voiceMailTranscription: false,
        callReason: false,
        clickToDial: false,
        eftAuthorization: false,
        claimNumberEdit: false,
        ftoBackup: false,
        overflowSkill: null,
        profileName: "USRM Billing & Collections",
        transferQueues: [],
        screenpops: [],
        operatingUnit: {
          ou_name: "Service",
          ou_sid: "OU94b0ff770f6278386fec5ef0b51fd021"
        },
        accessGroup: null,
        forwardToNum: {
          value: "",
          unmaskedValue: "",
          e164: "",
          updated: false,
          valid: true
        }
      };
      const action = {
        type: profileEntryFormActions.SET_UPDATE_PROFILE_FORM_STATE,
        payload: mockProfiles[1]
      };
      const result = profileEntryFormReducer(initialProfileEntryFormState, action);
      expect(result).toStrictEqual(expectedState);
    });
  });
});