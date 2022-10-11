import React from "react";
import { Check } from "@mui/icons-material";

export const formatProfileBooleanData = value => {
  if (value === 1) {
    return <Check />;
  }
  return "";
};

export const formatOverflowSkillData = value => {
  if (value === null) {
    return  "";
  }
  return value;
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
