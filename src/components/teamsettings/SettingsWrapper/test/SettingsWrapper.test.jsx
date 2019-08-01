import SettingsWrapper from "../SettingsWrapper";
import React from "react";
import { render } from "@testing-library/react";

describe("<SettingsWrapper />", () => {
  test("we should show the temporary text.", () => {
    const rendered = render(<SettingsWrapper />);
    expect(rendered.getByText("Settings Page")).toBeTruthy();
  });
});