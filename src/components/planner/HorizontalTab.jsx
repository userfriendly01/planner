/* eslint-disable react/prop-types */
import { Tab } from "@mui/material";
import React from "react";

export const HorizontalTab = ({
  color,
  label
}) => {

  return (
    <Tab
      label={label}
      sx={{
        width: "25%",
        minHeight: "5px",
        fontFamily: "Optima, sans-serif",
        fontSize: "12px",
        height: "5px",
        backgroundColor: color,
        borderRadius: "30% 30% 0% 0%",
        boxShadow: "4px -4px 10px grey"
      }}
    />
  );
};
