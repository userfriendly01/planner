import React from "react";
import {
  Check,
  AutoAwesomeMotion
} from "@mui/icons-material";
import {
  BubbleDiv,
  HighlightRed
} from "../components/tabs/profilesettings/ProfileSettingsTable/ProfileSettingsTable.Styles";

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

export const formatProfileACWDataEntry = (value, options) => {
  if (value === 1 && options.length) {
    return options.map(option => {
      return <BubbleDiv key={option.wrkr_tsk_info_id}>{option.display_nme}</BubbleDiv>;
    });
  }
  if (value === 1 && !options.length) {
    return  <HighlightRed>{"Options not configured but feature enabled"}</HighlightRed>;
  }
  if (value === 0 && options.length) {
    return  <HighlightRed>{"Options configured but feature disabled"}</HighlightRed>;
  }
  return "";
};

export const formatOverflowSkillData = overflowSkill => {
  if (overflowSkill === null) {
    return  "";
  }
  return overflowSkill;
};

export const formatActivityData = activity => {
  if (activity === null) {
    return "";
  }
  return <BubbleDiv>{activity}</BubbleDiv>;
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

export const formatAggregateQueues = aggregateQueues => {
  return aggregateQueues.map(queue => {
    if (queue.aggregate_queues_type === "aggregate") {
      return <BubbleDiv key={queue.aggregate_queues_nme}>{queue.aggregate_queues_nme} <AutoAwesomeMotion fontSize="1 rem"/></BubbleDiv>;
    } else {
      return <BubbleDiv key={`${queue.aggregate_queues_nme}`}>{queue.aggregate_queues_nme}</BubbleDiv>;
    }
  });
};
