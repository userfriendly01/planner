import { Overlay } from "components/app/App.Styles";
import React from "react";

interface Props {
  message: string;
}

export const LoginError = ({ message }: Props): JSX.Element => (
  <Overlay>
    <p>Something went wrong when trying to authenticate you:</p>
    <code>{message}</code>
  </Overlay>
);
