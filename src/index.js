import { App } from "components";
import { StateProvider } from "context";
import { theme } from "globals";
import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";

ReactDOM.render(
  <StateProvider>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StateProvider>,
  document.getElementById("root")
);