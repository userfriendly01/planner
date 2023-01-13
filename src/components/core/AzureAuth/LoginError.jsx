/* eslint-disable react/prop-types */
import * as React from "react";

export const LoginError = props => (
  <div className="App">
    <pre>
      <code>{props.message}</code>
    </pre>
  </div>
);
