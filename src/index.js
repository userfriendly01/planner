import { App } from "components";
import {
  initialState,
  reducer,
  StateProvider
} from "context";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <StateProvider initialState={initialState} reducer={reducer}>
    <App />
  </StateProvider>,
  document.getElementById("root")
);