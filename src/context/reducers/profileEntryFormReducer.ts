import {
  ProfileEntryFormState
} from "orgmanagement/ProfileEntryForm.Interfaces";
import { Action } from "globals/interfaces";
import { formModes } from "globals";

export const profileEntryFormActions = {
  RESET_FORM: "RESET_FORM",
  SET_FORM_FIELD: "SET_FORM_FIELD",
  CLEAR_FORM_FIELD: "CLEAR_FORM_FIELD",
  SET_UPDATE_PROFILE_FORM_STATE: "SET_UPDATE_PROFILE_FORM_STATE"
};

export const initialProfileEntryFormState: ProfileEntryFormState = {
  formMode: formModes.INSERT,
  updated: false,
  profileId: null,
  activitiesList: [],
  callTagsList: [],
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
  callReason: false,
  clickToDial: false,
  eftAuthorization: false,
  claimNumberEdit: false,
  overflowSkill: null,
  profileName: "",
  transferQueues: [],
  screenpops: [],
  operatingUnit: null,
  accessGroup: null,
  ftoBackup: false,
  forwardToNum: {
    value: "",
    unmaskedValue: "",
    e164: "",
    updated: false,
    valid: true
  }
};

export const profileEntryFormReducer = (state: ProfileEntryFormState, action: Action): ProfileEntryFormState => {
  switch (action.type) {
    case profileEntryFormActions.RESET_FORM: {
      return {
        ...initialProfileEntryFormState
      };
    }
    case profileEntryFormActions.SET_FORM_FIELD: {
      const key = action.payload.key;
      const value = action.payload.value;
      return {
        ...state,
        [key]: value
      };
    }
    case profileEntryFormActions.CLEAR_FORM_FIELD: {
      const key = action.payload;
      return {
        ...state,
        [key]: initialProfileEntryFormState[key]
      };
    }
    case profileEntryFormActions.SET_UPDATE_PROFILE_FORM_STATE: {
      return {
        formMode: formModes.UPDATE,
        profileId: action.payload.profile_id,
        activitiesList: action.payload.activities || [],
        callTagsList: action.payload.call_tags || [],
        autoAnswered: action.payload.auto_ans,
        inboundRecorded: action.payload.inbnd_rec,
        outboundRecorded: action.payload.outbnd_rec,
        acwOption: action.payload.acw_option,
        manualRecorded: action.payload.man_outbnd_rec,
        acwDataEntry: action.payload.acw_tags, //is this what that is? Do we need this can we just infer it from call tags?
        manualRecordedInbound: action.payload.man_inbnd_rec,
        agentAssistedPay: action.payload.agnt_asst_pay,
        paymentProcessing: action.payload.takes_paymnts,
        policyNumberEdit: action.payload.edt_policy_num,
        voiceMailTranscription: action.payload.voice_mail_trans,
        callReason: action.payload.call_reason,
        clickToDial: action.payload.clk_to_dial,
        eftAuthorization: action.payload.eft_auth,
        claimNumberEdit: action.payload.edt_claim_num,
        overflowSkill: action.payload.overflow_skill,
        profileName: action.payload.profile_name,
        ftoBackup: action.payload.backup_workers,
        screenpops: action.payload.screenpops || [],
        transferQueues: action.payload.transfer_queues || [],
        operatingUnit: {
          ou_name: action.payload.ou_name,
          ou_sid: action.payload.ou_sid
        },
        accessGroup: action.payload.access_group,
        forwardToNum: {
          value: action.payload.fwd_to_num || "",
          unmaskedValue: action.payload.fwd_to_num || "",
          e164: "",
          updated: false,
          valid: true
        }
      };
    }
    default:
      return state;
  }
};