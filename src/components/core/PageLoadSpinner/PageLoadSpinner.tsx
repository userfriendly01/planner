
import React from "react";
import {
  Overlay,
  LoadingMessage
} from "./PageLoadSpinner.Styles";
import { CircularProgress } from "@mui/material";
import { theme } from "globals/theme";

export const PageLoadSpinner = (props: { message?: string }) => {
  return (
    <Overlay>
      <LoadingMessage>{props.message || "Loading"}...</LoadingMessage>
      <CircularProgress size={theme.circularProgressSize} />
    </Overlay>
  );
};