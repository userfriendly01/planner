import React from "react";
import { Check } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import {
  ProfileEntryFormState, ToggleFormField
} from "orgmanagement/ProfileEntryForm.Interfaces";
import { TwilioQueue } from "components/tabs/callflowmanagement/SkillManagement/Skills.Interfaces";
import {
  Activity, CallTag, ProfilePayload, Screenpop
} from "globals/interfaces";
import {
  formModes, numMatcher
} from "globals/index";

export const isProfileFormValid = (form: ProfileEntryFormState): boolean => {
  const isAccessGroupValid = (form.accessGroup?.isNew && form.accessGroup?.access_group_name?.length && form.accessGroup?.twilio_dashboard_url?.length) || (!form.accessGroup?.isNew);
  return !!(form.profileId?.toString().match(numMatcher) && form.forwardToNum.valid && form.operatingUnit &&
  form.activitiesList.length && form.profileName && form.profileName.trim().length && form.updated && isAccessGroupValid);
};
export const formatProfileACWDataEntry = (acwTags: boolean, callTags: CallTag[], BubbleDiv: any, HighlightRed: any) => {
  if (acwTags && callTags?.length) {
    return callTags.map((callTag: CallTag) => {
      return <Tooltip key={callTag.attribute_name} placement="top" title={callTag.options ? callTag.options.toString().replace(/,/g,", ") : ""}>
        <BubbleDiv key={callTag.attribute_name}>{callTag.display_name}</BubbleDiv>
      </Tooltip>;
    });
  }
  if (acwTags && !callTags?.length) {
    return  <HighlightRed>{"Call tags not configured but feature enabled"}</HighlightRed>;
  }
  if (!acwTags && callTags?.length) {
    return  <HighlightRed>{"Call tags configured but feature disabled"}</HighlightRed>;
  }
  return "";
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
    return <BubbleDiv key={`${sid}`}>{taskQueue.friendly_name}</BubbleDiv>;
  });
};

export const constructProfilePayload = (form: ProfileEntryFormState) => {
  const payload: ProfilePayload = {
    profile_name: form.profileName,
    overflow_skill: form.overflowSkill?.name || null,
    acw_option: form.acwOption,
    acw_tags: form.acwDataEntry,
    agnt_asst_pay: form.agentAssistedPay,
    auto_ans: form.autoAnswered,
    edt_policy_num: form.policyNumberEdit,
    edt_claim_num: form.claimNumberEdit,
    call_reason: form.callReason,
    clk_to_dial: form.clickToDial,
    eft_auth: form.eftAuthorization,
    inbnd_rec: form.inboundRecorded,
    man_outbnd_rec: form.manualRecorded,
    man_inbnd_rec: form.manualRecordedInbound,
    outbnd_rec: form.outboundRecorded,
    takes_paymnts: form.paymentProcessing,
    voice_mail_trans: form.voiceMailTranscription,
    ou_name: form.operatingUnit?.ou_name,
    ou_sid: form.operatingUnit?.ou_sid,
    fwd_to_num: form.forwardToNum.unmaskedValue ? form.forwardToNum.unmaskedValue : null,
    screenpop_ids: form.screenpops.map((pop: Screenpop) => pop.id),
    access_group_id: form.accessGroup?.id || null,
    activity_sids: form.activitiesList.map((activity: Activity) => activity.activity_sid),
    call_tags: form.callTagsList.map((tag: CallTag) => ({
      attribute_name: tag.attribute_name,
      display_name: tag.display_name,
      options: tag.options
    })),
    transfer_queues: form.transferQueues.map((queue: TwilioQueue) => queue.sid)
  };

  if(form.formMode === formModes.INSERT) { payload.profile_id = form.profileId; }

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

export const toggleControls: ToggleFormField[] = [
  {
    fieldKey: "inboundRecorded",
    label: "Inbound Recorded"
  },
  {
    fieldKey: "paymentProcessing",
    label: "Payment Processing"
  },
  {
    fieldKey: "acwOption",
    label: "ACW Option"
  },
  {
    fieldKey: "acwDataEntry",
    label: "ACW Data Entry"
  },
  {
    fieldKey: "agentAssistedPay",
    label: "Agent Assisted Pay"
  },
  {
    fieldKey: "voiceMailTranscription",
    label: "Voice Mail Transcription"
  },
  {
    fieldKey: "callReason",
    label: "Call Reason"
  },
  {
    fieldKey: "autoAnswered",
    label: "Auto Answered"
  },
  {
    fieldKey: "outboundRecorded",
    label: "Outbound Recorded"
  },
  {
    fieldKey: "manualRecorded",
    label: "Manual Recorded"
  },
  {
    fieldKey: "manualRecordedInbound",
    label: "Manual Recorded Inbound"
  },
  {
    fieldKey: "policyNumberEdit",
    label: "Policy Number Edit"
  },
  {
    fieldKey: "clickToDial",
    label: "Click To Dial"
  },
  {
    fieldKey: "eftAuthorization",
    label: "EFT Authorization"
  },
  {
    fieldKey: "claimNumberEdit",
    label: "Claim Number Edit"
  }
];