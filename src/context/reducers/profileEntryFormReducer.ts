import {
  ProfileEntryFormState
} from "components/tabs/profilesettings/ProfileEntryForm/ProfileEntryForm.Interfaces";
import {
  Action,
  formModes
} from "globals";
import {
  formatProfileBooleanDataTrueFalse,
  formatOverflowSkillData
} from "utils";

export const profileEntryFormActions = {
  RESET_FORM: "RESET_FORM",
  TOGGLE: "TOGGLE",
  SET_PROFILE_ID: "SET_PROFILE_ID",
  SET_PROFILE_NAME: "SET_PROFILE_NAME",
  SET_OVERFLOW_SKILL: "SET_OVERFLOW_SKILL",
  UPDATE_ACTIVITIES_LIST: "UPDATE_ACTIVITIES_LIST",
  UPDATE_ACW_OPTIONS_LIST: "UPDATE_ACW_OPTIONS_LIST",
  SET_UPDATE_PROFILE_FORM_STATE: "SET_UPDATE_PROFILE_FORM_STATE",
};

export const initialProfileEntryFormState: ProfileEntryFormState = {
  profileId: null,
  activitiesList: [],
  callTagsList: [],
  formMode: formModes.INSERT,
  autoAnswered: {
    value: true
  },
  inboundRecorded: {
    value: true
  },
  outboundRecorded: {
    value: true
  },
  callTag: {
    value: false
  },
  workerTaskInfoOptions: [],
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
    value: false
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
  clickToDial: {
    value: false
  },
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
        [action.fieldKey]: {
          value: !state[action.fieldKey].value,
          updated: true
        }
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
        activitiesList: action.payload,
        activitiesUpdated: true
      };
    }
    case profileEntryFormActions.UPDATE_ACW_OPTIONS_LIST: {
      return {
        ...state,
        callTagsList: action.payload,
        callTagsUpdated: true
      };
    }
    case profileEntryFormActions.SET_UPDATE_PROFILE_FORM_STATE: {
      const profile = action.payload.profile;
      
      console.log("rz profile.worker_task_info=", profile.callTags);

      const callTagsList = profile.callTags.map((callTag: { display_nme: string; options_id: number; profile_id: number; row_crtn_dtm: string; row_updt_dtm:string; wrkr_tsk_info_id:number}) => {
        console.log("rz callTag=", callTag);
        return {
          display_nme: callTag.display_nme,
          options_id: callTag.options_id,
          profile_id: callTag.profile_id,
          wrkr_tsk_info_id: callTag.wrkr_tsk_info_id
        }
      });
      
      const activitiesList = profile.activities.map((activity: { activity_id: number; activity_nme: string; availability: number; }) => {
        return {
          activity_id: activity.activity_id,
          activity_nme: activity.activity_nme,
          available_i: {
            data: [activity.availability],
            type: "Buffer"
          }
        };
      });

      return {
        ...state,
        profileId: profile.profile_id,
        formMode: action.payload.formMode,
        activitiesList,
        callTagsList,
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
        clickToDial: formatProfileBooleanDataTrueFalse(profile.click_to_dial_i.data[0]),
        overflowSkill: {
          value: formatOverflowSkillData(profile.overflow_skill),
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