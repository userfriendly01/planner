import { CircularProgress } from "@mui/material";
import {
  LoadingMessage, Overlay
} from "components/app/App.Styles";
import { theme } from "globals";
import React from "react";

export const LoginInProgress = (): JSX.Element => (
  <Overlay>
    <LoadingMessage>Authenticating...</LoadingMessage>
    <CircularProgress size={theme.circularProgressSize} />
  </Overlay>
);
