import React from "react";
import _ from "lodash";
import {
  Check,
  AutoAwesomeMotion
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";

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

export const formatOverflowSkillData = overflowSkill => {
  if (overflowSkill === null) {
    return  "";
  }
  return overflowSkill;
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

export const createProfilePayload = (form) => {
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
    transferQueues: form.transferQueues.filter(queue => queue.ctmSkillId > 0).map(queue => {
      return {
        skill_id: queue.ctmSkillId,
        skill_nme: queue.ctmSkillDisplayName
      };
    }),
    aggregateQueues: form.transferQueues.filter(queue => queue.ctmSkillId < 0).map(queue => Math.abs(queue.ctmSkillId))
  };
}
