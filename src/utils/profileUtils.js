import React from "react";
import _ from "lodash";
import {
  Check,
  AutoAwesomeMotion
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { logger } from "./logger";

export const formatProfileBooleanData = value => {
  if (value === 1) {
    return <Check />;
  }
  return "";
};

export const formatProfileBooleanDataTrueFalse = value => {
  if (value === 1) {
    return { value: true };
  }
  return { value: false };
};

export const formatProfileACWDataEntry = (value, options, BubbleDiv, HighlightRed) => {
  if (value === 1 && options.length) {
    return options.map(option => {
      return <Tooltip key={option.wrkr_tsk_info_id} placement="top" title={option.options ? option.options.toString().replace(/,/g,", ") : ""}>
        <BubbleDiv key={option.wrkr_tsk_info_id}>{option.display_nme}</BubbleDiv>
      </Tooltip>;
    });
  }
  if (value === 1 && !options.length) {
    return  <HighlightRed>{"Call tags not configured but feature enabled"}</HighlightRed>;
  }
  if (value === 0 && options.length) {
    return  <HighlightRed>{"Call tags configured but feature disabled"}</HighlightRed>;
  }
  return "";
};

export const formatSimpleText = text => {
  if (text === null) {
    return  "";
  }
  return text;
};

export const formatActivityData = (activity, BubbleDiv) => {
  if (activity === null) {
    return "";
  }
  return <BubbleDiv>{activity}</BubbleDiv>;
};

export const formatCallTagsName = name => {
  return _.startCase(name);
};

export const formatSelfServiceIndicatorData = profileId => {
  const formattedProfileId = typeof profileId === "string" ? parseInt(profileId) : profileId; // do we need this extra step? 
  if(formattedProfileId >= 39){
    return  <Check />;
  }
  return "";
};

export const profileSettingsViews = [
  {
    value: "PROFILE_DIRECTORY",
    label: "Profile Directory"
  },
  {
    value: "PROFILE_SETTINGS",
    label: "Profile Settings"
  }
];

export const formatAggregateQueues = (aggregateQueues, BubbleDiv) => {
  return aggregateQueues.map(queue => {
    if (queue.aggregate_queues_type === "aggregate") {
      return <BubbleDiv key={queue.aggregate_queues_nme}>{queue.aggregate_queues_nme} <AutoAwesomeMotion fontSize="1 rem"/></BubbleDiv>;
    } else {
      return <BubbleDiv key={`${queue.aggregate_queues_nme}`}>{queue.aggregate_queues_nme}</BubbleDiv>;
    }
  });
};

export const createProfilePayload = form => {
  return {
    profile_id: form.profileId,
    profile_nme: form.profileName.value,
    activities: form.activitiesList.map(activity => activity.activity_id),
    recorded_i: form.inboundRecorded.value,
    auto_answd_i: form.autoAnswered.value,
    pmt_prcsg_i: form.paymentProcessing.value,
    otbnd_recorded_i: form.outboundRecorded.value,
    callTags: form.callTagsList.map(callTag => {
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
    transferQueues: form.transferQueues.filter(queue => queue.ctmSkillId > 0).map(queue => {
      return {
        skill_id: queue.ctmSkillId,
        skill_nme: queue.ctmSkillDisplayName
      };
    }),
    access_group: form.accessGroup.value || null,
    // Aggregate queues need to be set to a negative ID in order to not clash with single transfer queues / skills. In the payload we need to change that back to a positive integer
    aggregateQueues: form.transferQueues.filter(queue => queue.ctmSkillId < 0).map(queue => Math.abs(queue.ctmSkillId)),
    operating_unit_sid: form.operatingUnit.ou_sid,
    operating_unit_nme: form.operatingUnit.ou_name,
    access_group_id: form.accessGroup.value ? form.accessGroupId : null
  };
};

export const updateProfilePayload = form => {
  const payload = {
    profile_id: form.profileId
  };

  form.profileName.updated ? payload.profile_nme = form.profileName.value : null;
  form.overflowSkill.updated ? payload.overflow_skill = form.overflowSkill.value || null : null;
  form.activitiesUpdated ? payload.activities = form.activitiesList.map(activity => activity.activity_id) : null;
  form.queuesUpdated ? payload.transferQueues = form.transferQueues.filter(queue => queue.ctmSkillId > 0).map(queue => {
    return {
      skill_id: queue.ctmSkillId,
      skill_nme: queue.ctmSkillDisplayName
    };
  }) : null;
  // Aggregate queues need to be set to a negative ID in order to not clash with single transfer queues / skills. In the payload we need to change that back to a positive integer
  form.queuesUpdated ? payload.aggregateQueues = form.transferQueues.filter(queue => queue.ctmSkillId < 0).map(queue => Math.abs(queue.ctmSkillId)) : null;
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
  form.callTagsUpdated ? payload.callTags = form.callTagsList.map(callTag => {
    return {
      wrkr_tsk_info_id: callTag.wrkr_tsk_info_id,
      display_nme: formatCallTagsName(callTag.wrkr_tsk_info_nme),
      options_id: callTag.options_id
    };
  }) : null;
  logger.log(form.accessGroupIdUpdated,"****form.accessGroupId*****",form.accessGroupId);
  form.accessGroupIdUpdated ? payload.access_group_id = form.accessGroupId : null;
  return payload;
};
