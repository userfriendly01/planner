/* eslint-disable react/prop-types */
import { Tab } from "@mui/material";
import React from "react";

export const VerticalTab = ({
  color,
  label
}) => {

  return (
    <Tab
      label={label}
      sx={{
        minWidth: "0px",
        minHeight: "55px",
        width: "3px",
        fontSize: "12px",
        fontFamily: "Optima, sans-serif",
        backgroundColor: color,
        writingMode: "vertical-rl",
        borderRadius: "0% 30% 30% 0%",
        boxShadow: "4px -4px 10px grey"
      }}
    />
  );
};
