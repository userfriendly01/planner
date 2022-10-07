import React from "react";
import { Check } from "@mui/icons-material";

export const formatProfileBooleanData = number => {
  if (number === 1) {
    return <Check />;
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
