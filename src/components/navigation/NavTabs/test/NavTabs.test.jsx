import NavTabs from "../NavTabs";
import {
  ManagementWrapper,
  SettingsWrapper
} from "components";
import React from "react";
import {
  expectMockedComponent,
  fireEvent,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  ManagementWrapper: jest.fn(),
  SettingsWrapper: jest.fn()
}));

describe("<NavTabs />", () => {

  beforeEach(() => {
    setupMockedComponents({
      ManagementWrapper,
      SettingsWrapper
    });
  });

  test("we should load the two links, as well as default to showing the Management Pane", () => {
    const rendered = render(<NavTabs />);
    expect(rendered.getByText("My Team", { selector: "span" })).toBeInTheDocument();
    expect(rendered.getByText("Settings", { selector: "span" })).toBeInTheDocument();
    expectMockedComponent(rendered, { ManagementWrapper });
    expectMockedComponent(rendered, { SettingsWrapper });
    expect(rendered.getByText("ManagementWrapper")).toBeVisible();
    expect(rendered.getByText("SettingsWrapper")).not.toBeVisible();
  });

  test("when we click on the 'Settings' link, Settings should be visible, not management", () => {
    const rendered = render(<NavTabs />);
    fireEvent.click(rendered.getByText("Settings", { selector: "span" }));
    expect(rendered.getByText("ManagementWrapper")).not.toBeVisible();
    expect(rendered.getByText("SettingsWrapper")).toBeVisible();
  });

  test("when we click on the already clicked link, nothing should change", () => {
    const rendered = render(<NavTabs />);
    fireEvent.click(rendered.getByText("My Team", { selector: "span" }));
    expect(rendered.getByText("ManagementWrapper")).toBeVisible();
    expect(rendered.getByText("SettingsWrapper")).not.toBeVisible();
  });
});