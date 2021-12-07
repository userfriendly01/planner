import NavTabs from "../NavTabs";
import {
  MessageContainer,
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
  MessageContainer: jest.fn(),
  ManagementWrapper: jest.fn(),
  ProfileSettingsContainer: jest.fn()
}));

describe("<NavTabs />", () => {

  beforeEach(() => {
    setupMockedComponents({
      ManagementWrapper,
      ProfileSettingsContainer,
      MessageContainer
    });
  });

  test("we should load the links, as well as default to showing the Management Pane", () => {
    const rendered = render(<NavTabs />);
    expect(MessageContainer.mock.calls[0][0].value).toBe("flash");
    expect(rendered.getByText("User Management", { selector: "span" })).toBeInTheDocument();
    // expect(rendered.getByText("Settings", { selector: "span" })).toBeInTheDocument();
    expectMockedComponent(rendered, { ManagementWrapper });
    expectMockedComponent(rendered, { MessageContainer }, 2);
    expectMockedComponent(rendered, { ProfileSettingsContainer });
    expect(rendered.getByText("ManagementWrapper")).toBeVisible();
    expect(rendered.getAllByText("MessageContainer")[0]).not.toBeVisible();
    expect(rendered.getAllByText("MessageContainer")[1]).not.toBeVisible();
    expect(rendered.getByText("ProfileSettingsContainer")).not.toBeVisible();
  });

  test("when we click on the 'Flash Message' link, only MessageContainer should be visible", () => {
    const rendered = render(<NavTabs />);
    fireEvent.click(rendered.getByText("Flash Message", { selector: "span" }));
    expect(rendered.getAllByText("MessageContainer")[0]).toBeVisible();
    expect(rendered.getAllByText("MessageContainer")[1]).not.toBeVisible();
    expect(rendered.getByText("ManagementWrapper")).not.toBeVisible();
    expect(rendered.getByText("ProfileSettingsContainer")).not.toBeVisible();
  });

  test("when we click on the 'Closed Message' link, only MessageContainer should be visible", () => {
    const rendered = render(<NavTabs />);
    fireEvent.click(rendered.getByText("Closed Message", { selector: "span" }));
    expect(rendered.getAllByText("MessageContainer")[0]).not.toBeVisible();
    expect(rendered.getAllByText("MessageContainer")[1]).toBeVisible();
    expect(rendered.getByText("ManagementWrapper")).not.toBeVisible();
    expect(rendered.getByText("ProfileSettingsContainer")).not.toBeVisible();
  });

  test("when we click on the 'Profile Settings' link, only ProfileSettingsContainer should be visible", () => {
    const rendered = render(<NavTabs />);
    fireEvent.click(rendered.getByText("Profile Settings", { selector: "span" }));
    expect(rendered.getByText("ProfileSettingsContainer")).toBeVisible();
    expect(rendered.getByText("ManagementWrapper")).not.toBeVisible();
    expect(rendered.getAllByText("MessageContainer")[0]).not.toBeVisible();
    expect(rendered.getAllByText("MessageContainer")[1]).not.toBeVisible();
  });

  test("when we click on the already clicked link, nothing should change", () => {
    const rendered = render(<NavTabs />);
    fireEvent.click(rendered.getByText("User Management", { selector: "span" }));
    expect(rendered.getByText("ManagementWrapper")).toBeVisible();
    expect(rendered.getAllByText("MessageContainer")[0]).not.toBeVisible();
    expect(rendered.getAllByText("MessageContainer")[1]).not.toBeVisible();
    expect(rendered.getByText("ProfileSettingsContainer")).not.toBeVisible();
  });
});