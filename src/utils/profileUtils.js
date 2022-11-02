import React from "react";
import { Check } from "@mui/icons-material";
import { ActivitiesDiv } from "../components/tabs/profilesettings/ProfileSettingsTable/ProfileSettingsTable.Styles";

export const formatProfileBooleanData = value => {
  if (value === 1) {
    return <Check />;
  }
  return "";
};

export const formatProfileBooleanDataTrueFalse = value => {
  if (value === 1) {
    return true;
  }
  return false;
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
  return <ActivitiesDiv>{activity}</ActivitiesDiv>;
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
