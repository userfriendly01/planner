import { App } from "components";
import {
  StateProvider,
  FormStateProvider
} from "context";
import { theme } from "globals";
import React from "react";
import { ThemeProvider } from "styled-components";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <StateProvider>
    <FormStateProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </FormStateProvider>
  </StateProvider>
);