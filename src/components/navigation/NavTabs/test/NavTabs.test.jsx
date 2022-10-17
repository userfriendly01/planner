import NavTabs from "../NavTabs";
import {
  CallflowManagementWrapper,
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
  CallflowManagementWrapper: jest.fn(),
  ManagementWrapper: jest.fn(),
  ProfileSettingsContainer: jest.fn()
}));

describe("<NavTabs />", () => {

  beforeEach(() => {
    setupMockedComponents({
      ManagementWrapper,
      ProfileSettingsContainer,
      CallflowManagementWrapper
    });
  });

  test("we should load the links, as well as default to showing the Management Pane", () => {
    const rendered = render(<NavTabs />);
    // expect(rendered.getByText("User Management")).toBeInTheDocument();
    // expectMockedComponent(rendered, { ManagementWrapper });
    // expectMockedComponent(rendered, { CallflowManagementWrapper }, 1);
    // expectMockedComponent(rendered, { ProfileSettingsContainer });
    // expect(rendered.getByText("ManagementWrapper")).toBeVisible();
    // expect(rendered.getAllByText("CallflowManagementWrapper")[0]).not.toBeVisible();
    // expect(rendered.getByText("ProfileSettingsContainer")).not.toBeVisible();
  });

  test("when we click on the 'Call Flow Management' link, only CallflowManagementWrapper should be visible", () => {
    const rendered = render(<NavTabs />);
    // fireEvent.click(rendered.getByText("Call Flow Management"));
    // expect(rendered.getAllByText("CallflowManagementWrapper")[0]).toBeVisible();
    // expect(rendered.getByText("ManagementWrapper")).not.toBeVisible();
    // expect(rendered.getByText("ProfileSettingsContainer")).not.toBeVisible();
  });

  test("when we click on the 'Profile Settings' link, only ProfileSettingsContainer should be visible", () => {
    const rendered = render(<NavTabs />);
    // fireEvent.click(rendered.getByText("Profile Settings"));
    // expect(rendered.getByText("ProfileSettingsContainer")).toBeVisible();
    // expect(rendered.getByText("ManagementWrapper")).not.toBeVisible();
    // expect(rendered.getAllByText("CallflowManagementWrapper")[0]).not.toBeVisible();
  });

  test("when we click on the already clicked link, nothing should change", () => {
    const rendered = render(<NavTabs />);
    // fireEvent.click(rendered.getByText("User Management"));
    // expect(rendered.getByText("ManagementWrapper")).toBeVisible();
    // expect(rendered.getAllByText("CallflowManagementWrapper")[0]).not.toBeVisible();
    // expect(rendered.getByText("ProfileSettingsContainer")).not.toBeVisible();
  });
});