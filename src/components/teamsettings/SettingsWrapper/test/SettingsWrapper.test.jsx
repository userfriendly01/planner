import SettingsWrapper from "../SettingsWrapper";
import React from "react";
import { render } from "testUtils";

describe("<SettingsWrapper />", () => {
  test("we should show the temporary text.", () => {
    const rendered = render(<SettingsWrapper />);
    expect(rendered.getByText("Settings Page")).toBeTruthy();
  });
});