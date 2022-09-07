import NavTabs from "../NavTabs";
import {
  CallFlowContainer,
  ManagementWrapper,
  ProfileSettingsContainer
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
  CallFlowContainer: jest.fn(),
  ManagementWrapper: jest.fn(),
  ProfileSettingsContainer: jest.fn()
}));

describe("<NavTabs />", () => {

  beforeEach(() => {
    setupMockedComponents({
      ManagementWrapper,
      ProfileSettingsContainer,
      CallFlowContainer
    });
  });

  test("we should load the links, as well as default to showing the Management Pane", () => {
    const rendered = render(<NavTabs />);
    expect(MessageContainer.mock.calls[0][0].value).toBe("flash");
    expect(rendered.getByText("User Management")).toBeInTheDocument();
    // expect(rendered.getByText("Settings", { selector: "span" })).toBeInTheDocument();
    expectMockedComponent(rendered, { ManagementWrapper });
    expectMockedComponent(rendered, { CallFlowContainer }, 1);
    expectMockedComponent(rendered, { ProfileSettingsContainer });
    expect(rendered.getByText("ManagementWrapper")).toBeVisible();
    expect(rendered.getAllByText("CallFlowContainer")[0]).not.toBeVisible();
    expect(rendered.getByText("ProfileSettingsContainer")).not.toBeVisible();
  });

  test("when we click on the 'Call Flow Management' link, only MessageContainer should be visible", () => {
    const rendered = render(<NavTabs />);
    fireEvent.click(rendered.getByText("Flash Message"));
    expect(rendered.getAllByText("MessageContainer")[0]).toBeVisible();
    expect(rendered.getAllByText("MessageContainer")[1]).not.toBeVisible();
    expect(rendered.getByText("ManagementWrapper")).not.toBeVisible();
    expect(rendered.getByText("ProfileSettingsContainer")).not.toBeVisible();
  });

  test("when we click on the 'Closed Message' link, only MessageContainer should be visible", () => {
    const rendered = render(<NavTabs />);
    fireEvent.click(rendered.getByText("Closed Message"));
    expect(rendered.getAllByText("MessageContainer")[0]).not.toBeVisible();
    expect(rendered.getAllByText("MessageContainer")[1]).toBeVisible();
    expect(rendered.getByText("ManagementWrapper")).not.toBeVisible();
    expect(rendered.getByText("ProfileSettingsContainer")).not.toBeVisible();
  });

  test("when we click on the 'Profile Settings' link, only ProfileSettingsContainer should be visible", () => {
    const rendered = render(<NavTabs />);
    fireEvent.click(rendered.getByText("Profile Settings"));
    expect(rendered.getByText("ProfileSettingsContainer")).toBeVisible();
    expect(rendered.getByText("ManagementWrapper")).not.toBeVisible();
    expect(rendered.getAllByText("CallFlowContainer")[0]).not.toBeVisible();
  });

  test("when we click on the already clicked link, nothing should change", () => {
    const rendered = render(<NavTabs />);
    fireEvent.click(rendered.getByText("User Management"));
    expect(rendered.getByText("ManagementWrapper")).toBeVisible();
    expect(rendered.getAllByText("CallFlowContainer")[0]).not.toBeVisible();
    expect(rendered.getByText("ProfileSettingsContainer")).not.toBeVisible();
  });
});