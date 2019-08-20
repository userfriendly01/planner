import { App } from "components";
import { StateProvider } from "context";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <StateProvider>
    <App />
  </StateProvider>,
  document.getElementById("root")
);