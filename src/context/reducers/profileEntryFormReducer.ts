import {
  ProfileEntryFormState
} from "components/tabs/orgmanagement/triton/ProfileEntryForm/ProfileEntryForm.Interfaces";
import {
  Action,
  formModes,
  OperatingUnit
} from "globals";
import {
  formatProfileBooleanDataTrueFalse,
  formatSimpleText
} from "utils/profileUtils";

export const profileEntryFormActions = {
  RESET_FORM: "RESET_FORM",
  SET_OPERATING_UINIT: "SET_OPERATING_UINIT",
  SET_OVERFLOW_SKILL: "SET_OVERFLOW_SKILL",
  SET_PROFILE_ID: "SET_PROFILE_ID",
  SET_PROFILE_NAME: "SET_PROFILE_NAME",
  SET_UPDATE_PROFILE_FORM_STATE: "SET_UPDATE_PROFILE_FORM_STATE",
  TOGGLE: "TOGGLE",
  UPDATE_ACCESS_GROUP: "UPDATE_ACCESS_GROUP",
  UPDATE_ACCESS_GROUP_ID: "UPDATE_ACCESS_GROUP_ID",
  UPDATE_ACTIVITIES_LIST: "UPDATE_ACTIVITIES_LIST",
  UPDATE_CALL_TAGS_LIST: "UPDATE_CALL_TAGS_LIST",
  UPDATE_TRANSFER_QUEUES: "UPDATE_TRANSFER_QUEUES"
};

export const initialProfileEntryFormState: ProfileEntryFormState = {
  profileId: null,
  activitiesList: [],
  callTagsList: [],
  callTagOptions: [],
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
  callReason: {
    value: false
  },
  clickToDial: {
    value: false
  },
  eftAuthorization: {
    value: false
  },
  overflowSkill: {
    value: "",
    valid: true
  },
  profileName: {
    value: "",
    valid: false
  },
  transferQueues: [],
  operatingUnit: {} as OperatingUnit,
  accessGroup: {
    value: false
  },
  accessGroupId: null
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
    case profileEntryFormActions.UPDATE_CALL_TAGS_LIST: {
      return {
        ...state,
        callTagsList: action.payload,
        callTagsUpdated: true
      };
    }
    case profileEntryFormActions.UPDATE_TRANSFER_QUEUES: {
      return {
        ...state,
        transferQueues: action.payload,
        queuesUpdated: true
      };
    }
    case profileEntryFormActions.SET_OPERATING_UINIT: {
      return {
        ...state,
        operatingUnit: action.payload
      };
    }
    case profileEntryFormActions.UPDATE_ACCESS_GROUP: {
      return {
        ...state,
        accessGroup: {
          value: !state[action.fieldKey].value,
          updated: true
        },
        accessGroupId: state[action.fieldKey].value ? null : state.accessGroupId,
        accessGroupIdUpdated: true
      };
    }
    case profileEntryFormActions.UPDATE_ACCESS_GROUP_ID: {
      return {
        ...state,
        accessGroupId: action.payload,
        accessGroupIdUpdated: true
      };
    }
    case profileEntryFormActions.SET_UPDATE_PROFILE_FORM_STATE: {
      const profile = action.payload.profile;

      const callTagsList = profile.callTags.map((callTag: { display_nme: string; wrkr_tsk_info_id: number; options_id: number; }) => {
        return {
          wrkr_tsk_info_nme: callTag.display_nme,
          wrkr_tsk_info_id: callTag.wrkr_tsk_info_id,
          options_id: callTag.options_id
        };
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

      const transferQueues = profile.aggregateQueues.map((queue: { aggregate_queues_id: number; aggregate_queues_nme: string; aggregate_queues_type: string; queues: { skill_id: number; }[] }) => {
        return {
          // Aggregate queues need to be set to a negative ID in order to not clash with single transfer queues / skills
          ctmSkillId: queue.aggregate_queues_type === "aggregate" ? -Math.abs(queue.aggregate_queues_id) : queue.queues[0].skill_id,
          ctmSkillDisplayName: queue.aggregate_queues_nme
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
        callReason: formatProfileBooleanDataTrueFalse(profile.call_reason_i.data[0]),
        clickToDial: formatProfileBooleanDataTrueFalse(profile.click_to_dial_i.data[0]),
        eftAuthorization: formatProfileBooleanDataTrueFalse(profile.eft_authorization_i.data[0]),
        overflowSkill: {
          value: formatSimpleText(profile.overflow_skill),
          valid: true
        },
        profileName: {
          value: profile.profile_nme,
          valid: true
        },
        transferQueues,
        operatingUnit: {
          ou_name: profile.operating_unit_nme,
          ou_sid: profile.operating_unit_sid
        },
        accessGroupId: profile.access_group_id,
        accessGroup: { value: profile.access_group_id ? true : false }
      };
    }
    default:
      return state;
  }
};