import React from "react";
import _ from "lodash";
import {
  Check,
  AutoAwesomeMotion
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { logger } from "utils/logger";
import { ProfileEntryFormState } from "orgmanagement/ProfileEntryForm.Interfaces";
import { TwilioQueue } from "components/tabs/callflowmanagement/SkillManagement/Skills.Interfaces";
import { CallTag } from "globals/interfaces";

export const isProfileFormValid = (form: ProfileEntryFormState): boolean => {
  if (form.operatingUnit.ou_name && form.activitiesList.length
    && form.profileName.valid && form.overflowSkill.valid
    && (form.forwardToNum.valid || !form.forwardToNum.unmaskedValue) // allow null
    && ((form.acwDataEntry.value === true && form.callTagsList.length) || (form.acwDataEntry.value === false && !form.callTagsList.length))
    && ((form.accessGroup.value === true && form.accessGroupId) || form.accessGroup.value === false)) {
    return true;
  }
  return false;
};

export const isProfileNameValid = (profileName: string): boolean => {
  return profileName.length && profileName.length <= 80 ? true : false;
};

export const isOverflowSkillValid = (overflowSkill: string): boolean => {
  const overflowSkillRegEx = /^[0-9a-zA-Z]+$/;
  return !overflowSkill || (overflowSkill.length <= 80 && overflowSkill.match(overflowSkillRegEx)) ? true : false;
};


export const formatProfileACWDataEntry = (acwOption: boolean, callTags: CallTag[], BubbleDiv: any, HighlightRed: any) => {
  if (acwOption && callTags) {
    return callTags.map((callTag: CallTag) => {
      return <Tooltip key={callTag.attribute_name} placement="top" title={callTag.options ? callTag.options.toString().replace(/,/g,", ") : ""}>
        <BubbleDiv key={callTag.attribute_name}>{callTag.display_name}</BubbleDiv>
      </Tooltip>;
    });
  }
  if (acwOption && !callTags) {
    return  <HighlightRed>{"Call tags not configured but feature enabled"}</HighlightRed>;
  }
  if (!acwOption && callTags) {
    return  <HighlightRed>{"Call tags configured but feature disabled"}</HighlightRed>;
  }
  return "";
};

export const formatSimpleText = (text?: string) => {
  if (text === null) {
    return  "";
  }
  return text;
};

export const formatCallTagsName = (name: string) => {
  return _.startCase(name);
};

export const formatSelfServiceIndicatorData = (profileId: number) => {
  if(profileId >= 39){
    return  <Check />;
  }
  return "";
};

export const formatTransferQueues = (transferQueueSids: string[], taskQueues: TwilioQueue[],  BubbleDiv: any) => {
  return transferQueueSids?.map(sid => {
    const taskQueue: Partial<TwilioQueue> = taskQueues.find(t => t.sid === sid) || { friendly_name: "Unknown" };
    return <BubbleDiv key={`${taskQueue.sid}`}>{taskQueue.friendly_name}</BubbleDiv>;
  });
};

export const createProfilePayload = (form: any) => {
  return {
    profile_id: form.profileId,
    profile_name: form.profileName.value,
    activities: form.activitiesList.map((activity: any) => activity.activity_id),
    recorded_i: form.inboundRecorded.value,
    auto_answd_i: form.autoAnswered.value,
    pmt_prcsg_i: form.paymentProcessing.value,
    otbnd_recorded_i: form.outboundRecorded.value,
    callTags: form.callTagsList.map((callTag: any) => {
      return {
        wrkr_tsk_info_id: callTag.wrkr_tsk_info_id,
        display_nme: formatCallTagsName(callTag.wrkr_tsk_info_nme),
        options_id: callTag.options_id
      };
    }),
    acw_option_i: form.acwOption.value,
    manual_recorded_i: form.manualRecorded.value,
    acw_data_entry_i: form.acwDataEntry.value,
    manual_record_inbound_i: form.manualRecordedInbound.value,
    agent_assisted_pay_i: form.agentAssistedPay.value,
    overflow_skill: form.overflowSkill.value || null,
    policy_number_edit_i: form.policyNumberEdit.value,
    voice_mail_transcription_i: form.voiceMailTranscription.value,
    click_to_dial_i: form.clickToDial.value,
    call_reason_i: form.callReason.value,
    eft_authorization_i: form.eftAuthorization.value,
    claim_number_edit_i: form.claimNumberEdit.value,
    transferQueues: form.transferQueues.filter((queue: any) => queue.ctmSkillId > 0).map((queue: any) => {
      return {
        skill_id: queue.ctmSkillId,
        skill_nme: queue.ctmSkillDisplayName
      };
    }),
    access_group: form.accessGroup.value || null,
    // Aggregate queues need to be set to a negative ID in order to not clash with single transfer queues / skills. In the payload we need to change that back to a positive integer
    aggregateQueues: form.transferQueues.filter((queue: any) => queue.ctmSkillId < 0).map((queue: any) => Math.abs(queue.ctmSkillId)),
    operating_unit_sid: form.operatingUnit.ou_sid,
    operating_unit_nme: form.operatingUnit.ou_name,
    access_group_id: form.accessGroup.value ? form.accessGroupId : null,
    fwd_to_num: form.forwardToNum.unmaskedValue ? form.forwardToNum.unmaskedValue : null
  };
};

export const updateProfilePayload = (form: any) => {
  const payload: any = {
    profile_id: form.profileId
  };

  form.profileName.updated ? payload.profile_name = form.profileName.value : null;
  form.overflowSkill.updated ? payload.overflow_skill = form.overflowSkill.value || null : null;
  form.activitiesUpdated ? payload.activities = form.activitiesList.map((activity: any) => activity.activity_id) : null;
  form.queuesUpdated ? payload.transferQueues = form.transferQueues.filter((queue: any) => queue.ctmSkillId > 0).map((queue: any) => {
    return {
      skill_id: queue.ctmSkillId,
      skill_nme: queue.ctmSkillDisplayName
    };
  }) : null;
  // Aggregate queues need to be set to a negative ID in order to not clash with single transfer queues / skills. In the payload we need to change that back to a positive integer
  form.queuesUpdated ? payload.aggregateQueues = form.transferQueues.filter((queue: any) => queue.ctmSkillId < 0).map((queue: any) => Math.abs(queue.ctmSkillId)) : null;
  form.inboundRecorded.updated ? payload.recorded_i = form.inboundRecorded.value : null;
  form.autoAnswered.updated ? payload.auto_answd_i = form.autoAnswered.value : null;
  form.paymentProcessing.updated ? payload.pmt_prcsg_i = form.paymentProcessing.value : null;
  form.outboundRecorded.updated ? payload.otbnd_recorded_i = form.outboundRecorded.value : null;
  form.acwOption.updated ? payload.acw_option_i = form.acwOption.value : null;
  form.manualRecorded.updated ? payload.manual_recorded_i = form.manualRecorded.value : null;
  form.acwDataEntry.updated ? payload.acw_data_entry_i = form.acwDataEntry.value : null;
  form.manualRecordedInbound.updated ? payload.manual_record_inbound_i = form.manualRecordedInbound.value : null;
  form.agentAssistedPay.updated ? payload.agent_assisted_pay_i = form.agentAssistedPay.value : null;
  form.policyNumberEdit.updated ? payload.policy_number_edit_i = form.policyNumberEdit.value : null;
  form.voiceMailTranscription.updated ? payload.voice_mail_transcription_i = form.voiceMailTranscription.value : null;
  form.callReason.updated ? payload.call_reason_i = form.callReason.value : null;
  form.clickToDial.updated ? payload.click_to_dial_i = form.clickToDial.value : null;
  form.eftAuthorization.updated ? payload.eft_authorization_i = form.eftAuthorization.value : null;
  form.claimNumberEdit.updated ? payload.claim_number_edit_i = form.claimNumberEdit.value : null;
  form.callTagsUpdated ? payload.callTags = form.callTagsList.map((callTag: any) => {
    return {
      wrkr_tsk_info_id: callTag.wrkr_tsk_info_id,
      display_nme: formatCallTagsName(callTag.wrkr_tsk_info_nme),
      options_id: callTag.options_id
    };
  }) : null;
  logger.log(form.accessGroupIdUpdated,"****form.accessGroupId*****",form.accessGroupId);
  form.accessGroupIdUpdated ? payload.access_group_id = form.accessGroupId : null;
  form.forwardToNum.updated ? payload.fwd_to_num = form.forwardToNum.unmaskedValue : null;
  return payload;
};


export const profileTableColumnHeader = [
  {
    COLUMN_NAME: "ID",
    TOOLTIP: "Unique Profile Identification"
  },
  {
    COLUMN_NAME: "Name",
    TOOLTIP: "Profile Name"
  },
  {
    COLUMN_NAME: "Operating Unit",
    TOOLTIP: "Which OU a profile is assigned to"
  },
  {
    COLUMN_NAME: "Inbound Recorded",
    TOOLTIP: "All inbound calls are automatically recorded"
  },
  {
    COLUMN_NAME: "Outbound Recorded",
    TOOLTIP: "All outbound calls are automatically recorded"
  },
  {
    COLUMN_NAME: "Manual Recorded Inbound",
    TOOLTIP: "UI Feature: Manual recording button appears in call controls when enabled. User will have the ability to manually start and stop recordings on inbound calls"
  },
  {
    COLUMN_NAME: "Manual Outbound Recorded",
    TOOLTIP: "UI Feature: Manual recording button appears in call controls when enabled. User will have the ability to manually start and stop recordings"
  },
  {
    COLUMN_NAME: "Auto Answered",
    TOOLTIP: "Automatically accepts a call and routes to an agent"
  },
  {
    COLUMN_NAME: "Payment Processing",
    TOOLTIP: "UI Feature: Click for payment button is enabled to manually pause/resume call recordings"
  },
  {
    COLUMN_NAME: "Agent Assisted Pay",
    TOOLTIP: "Not a currently enabled UI feature"
  },
  {
    COLUMN_NAME: "Policy Number Edit",
    TOOLTIP: "UI Feature: An agent can capture and save a different policy number than what the IVR previously loaded"
  },
  {
    COLUMN_NAME: "Voice Mail Transcription",
    TOOLTIP: "Voice mail will be transcribed and sent within the notification email to the user"
  },
  {
    COLUMN_NAME: "Click To Dial",
    TOOLTIP: "Enable click-to-dial/transfer from external application"
  },
  {
    COLUMN_NAME: "Call Reason",
    TOOLTIP: "UI Feature: Allows agent to record call reason data."
  },
  {
    COLUMN_NAME: "EFT Authorization",
    TOOLTIP: "Enable EFT authorization tagging on recordings"
  },
  {
    COLUMN_NAME: "Claim Number Edit",
    TOOLTIP: "UI Feature: An agent can capture and save a different claim number than what the IVR previously loaded"
  },
  {
    COLUMN_NAME: "Self Service Indicator",
    TOOLTIP: "Self service indicator is applicable to profiles with an id of 39 and above, but is actually set at the worker attribute level"
  },
  {
    COLUMN_NAME: "ACW Option",
    TOOLTIP: "UI Feature: Agent has the choice to enable or disable after call work (wrap-up). Default setting is off"
  },
  {
    COLUMN_NAME: "ACW Data Entry",
    TOOLTIP: "UI Feature: If enabled, during wrap-up, call tagging toggle appears which gives an input form to the user"
  },
  {
    COLUMN_NAME: "Activities",
    TOOLTIP: "Profile Activities"
  },
  {
    COLUMN_NAME: "Transfer Queues",
    TOOLTIP: "UI Feature: Additional transfer queues that will appear in the Triton queue ticker"
  },
  {
    COLUMN_NAME: "Overflow Skill",
    TOOLTIP: "An agent misses a call and it is forwarded to the next available agent with the same manager"
  },
  {
    COLUMN_NAME: "Forward to Number",
    TOOLTIP: "Default forward to number to be used when no overflow skill exists"
  },
  {
    COLUMN_NAME: "Access Group",
    TOOLTIP: "Access Group Name for BPO profiles"
  }
];