import {
  ProfileEntryFormState
} from "components/tabs/profilesettings/ProfileEntryForm/ProfileEntryForm.Interfaces";
import {
  Action,
  formModes
} from "globals";

export const profileEntryFormActions = {
  RESET_FORM: "RESET_FORM",
  TOGGLE: "TOGGLE",
  SET_PROFILE_ID: "SET_PROFILE_ID",
  SET_PROFILE_NAME: "SET_PROFILE_NAME",
  SET_OVERFLOW_SKILL: "SET_OVERFLOW_SKILL",
  UPDATE_ACTIVITIES_LIST: "UPDATE_ACTIVITIES_LIST"
};

export const initialProfileEntryFormState: ProfileEntryFormState = {
  profileId: null,
  activitiesList: [],
  formMode: formModes.INSERT,
  autoAnswered: true,
  inboundRecorded: true,
  outboundRecorded: true,
  acwOption: false,
  manualRecorded: false,
  acwDataEntry: false,
  manualRecordedInbound: false,
  agentAssistedPay: false,
  paymentProcessing: false,
  policyNumberEdit: false,
  voiceMailTranscription: false,
  overflowSkill: {
    value: "",
    valid: true
  },
  profileName: {
    value: "",
    valid: false
  }
};

export const profileEntryFormReducer = (state: ProfileEntryFormState, action: Action): ProfileEntryFormState => {
  switch (action.type) {
    case profileEntryFormActions.RESET_FORM: {
      return {
        ...initialProfileEntryFormState
      };
    }
    case profileEntryFormActions.TOGGLE: {
      return {
        ...state,
        [action.fieldKey]: !state[action.fieldKey]
      };
    }
    case profileEntryFormActions.SET_PROFILE_ID: {
      return {
        ...state,
        profileId: action.payload
      };
    }
    case profileEntryFormActions.SET_PROFILE_NAME: {
      return {
        ...state,
        profileName: action.payload
      };
    }
    case profileEntryFormActions.SET_OVERFLOW_SKILL: {
      return {
        ...state,
        overflowSkill: action.payload
      };
    }
    case profileEntryFormActions.UPDATE_ACTIVITIES_LIST: {
      return {
        ...state,
        activitiesList: action.payload
      };
    }
    default:
      return state;
  }
};