import {
  ProfileEntryFormState
} from "components/tabs/profilesettings/ProfileEntryForm/ProfileEntryForm.Interfaces";
import {
  Action,
  formModes
} from "globals";
import {
  formatProfileBooleanDataTrueFalse
} from "utils"

export const profileEntryFormActions = {
  RESET_FORM: "RESET_FORM",
  TOGGLE: "TOGGLE",
  SET_PROFILE_ID: "SET_PROFILE_ID",
  SET_PROFILE_NAME: "SET_PROFILE_NAME",
  SET_OVERFLOW_SKILL: "SET_OVERFLOW_SKILL",
  UPDATE_ACTIVITIES_LIST: "UPDATE_ACTIVITIES_LIST",
  SET_UPDATE_PROFILE_FORM_STATE: "SET_UPDATE_PROFILE_FORM_STATE",
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
    case profileEntryFormActions.SET_UPDATE_PROFILE_FORM_STATE: {
      const profile = action.payload.profile;
      console.log('action', profile.auto_answd_i.data[0]);
      console.log('action', profile);
      console.log('action', profile.recorded_i.data[0]);
      console.log('action', profile.otbnd_recorded_i.data[0]);
      console.log('action', profile.acw_option_i.data[0]);
      console.log('state', state);
      return {
        ...state,
        profileId: profile.profile_id,
        activitiesList: [JSON.parse(profile.activities)],
        formMode: action.payload.formMode,
        autoAnswered: formatProfileBooleanDataTrueFalse(profile.auto_answd_i.data[0]),
        inboundRecorded: formatProfileBooleanDataTrueFalse(profile.recorded_i.data[0]),
        outboundRecorded: formatProfileBooleanDataTrueFalse(profile.otbnd_recorded_i.data[0]),
        acwOption: formatProfileBooleanDataTrueFalse(profile.acw_option_i.data[0]),
        manualRecorded: formatProfileBooleanDataTrueFalse(profile.manual_recorded_i.data[0]),
        acwDataEntry: formatProfileBooleanDataTrueFalse(profile.acw_data_entry_i.data[0]),
        manualRecordedInbound: formatProfileBooleanDataTrueFalse(profile.manual_record_inbound_i.data[0]),
        agentAssistedPay: formatProfileBooleanDataTrueFalse(profile.agent_assisted_pay_i.data[0]),
        paymentProcessing: formatProfileBooleanDataTrueFalse(profile.pmt_prcsg_i.data[0]),
        policyNumberEdit: formatProfileBooleanDataTrueFalse(profile.policy_number_edit_i.data[0]),
        voiceMailTranscription: formatProfileBooleanDataTrueFalse(profile.voice_mail_transcription_i.data[0]),
        overflowSkill: {
          value: profile.overflow_skill,
          valid: true
        },
        profileName: {
          value: profile.profile_nme,
          valid: true
        }
      };
    }
    default:
      return state;
  }
};