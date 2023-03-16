/* eslint-disable react/prop-types */
import * as React from "react";

export interface LoginErrorProperties {
  message: string;
}

export const LoginError = (props: LoginErrorProperties): JSX.Element => (
  <div className="App">
    <pre>
      <code>{props.message}</code>
    </pre>
  </div>
);
