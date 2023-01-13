/* eslint-disable react/prop-types */
import * as React from "react";

export interface LogginErrorProperties {
  message: string;
}

export const LoginError = (props: LogginErrorProperties): JSX.Element => (
  <div className="App">
    <pre>
      <code>{props.message}</code>
    </pre>
  </div>
);
