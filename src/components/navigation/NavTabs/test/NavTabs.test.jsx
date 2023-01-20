import NavTabs from "../NavTabs";
import {
  CallflowManagementWrapper,
  ManagementWrapper,
  ProfileSettingsContainer,
  AlohaFlowContainer,
  AlohaRoutingContainer
} from "components";
import {
  useAdminState
} from "context";
import React from "react";
import {
  expectMockedComponent,
  fireEvent,
  initialTestState,
  render,
  setupMockedComponents,
  tabs
} from "testUtils";
import { getAzureSPAClientId } from "utils";

jest.mock("utils", () => ({
  getAzureSPAClientId: jest.fn(),
}));
jest.mock("components", () => ({
  CallflowManagementWrapper: jest.fn(),
  ManagementWrapper: jest.fn(),
  ProfileSettingsContainer: jest.fn(),
  AlohaFlowContainer: jest.fn(),
  AlohaRoutingContainer: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

jest.mock("authentication", () => ({
  getTabs: jest.requireActual("authentication").getTabs
}));

const state = {
  ...initialTestState,
  userContext: {
    ...initialTestState.userContext,
    authenticationProfiles: [
      {
        tabs: [
          tabs.TRITON_USER_MANAGEMENT,
          tabs.TRITON_PROFILE_SETTINGS,
          tabs.TRITON_CALL_FLOW_MANAGEMENT
        ]
      },
      {
        tabs: [
          tabs.ALOHA_CALL_FLOW_MANAGEMENT
        ]
      }
    ]
  }
};

describe("<NavTabs />", () => {
  beforeEach(() => {
    useAdminState.mockReturnValue(state);
    setupMockedComponents({
      ManagementWrapper,
      ProfileSettingsContainer,
      CallflowManagementWrapper,
      AlohaFlowContainer,
      AlohaRoutingContainer
    });
  });

  test("we should load the links, as well as default to showing the Management Pane", () => {
    const rendered = render(<NavTabs />);
    expect(rendered.getByText("User Management")).toBeInTheDocument();
    expectMockedComponent(rendered, { ManagementWrapper }, 1);
    expectMockedComponent(rendered, { CallflowManagementWrapper }, 1);
    expectMockedComponent(rendered, { ProfileSettingsContainer }, 1);
    expectMockedComponent(rendered, { AlohaFlowContainer }, 1);
    expectMockedComponent(rendered, { AlohaRoutingContainer }, 0);
    expect(rendered.getByText("ManagementWrapper")).toBeVisible();
    expect(rendered.getAllByText("CallflowManagementWrapper")[0]).not.toBeVisible();
    expect(rendered.getByText("ProfileSettingsContainer")).not.toBeVisible();
    expect(rendered.getByText("AlohaFlowContainer")).not.toBeVisible();
    expect(getAzureSPAClientId).toBeCalled();
  });

  test("when we click on the 'Call Flow Management' link, only CallflowManagementWrapper should be visible", () => {
    const rendered = render(<NavTabs />);
    fireEvent.click(rendered.getAllByText("Call Flow Management")[0]);
    expect(rendered.getAllByText("CallflowManagementWrapper")[0]).toBeVisible();
    expect(rendered.getByText("ManagementWrapper")).not.toBeVisible();
    expect(rendered.getByText("ProfileSettingsContainer")).not.toBeVisible();
    expect(rendered.getByText("AlohaFlowContainer")).not.toBeVisible();
  });

  test("when we click on the 'Profile Settings' link, only ProfileSettingsContainer should be visible", () => {
    const rendered = render(<NavTabs />);
    fireEvent.click(rendered.getByText("Profile Settings"));
    expect(rendered.getByText("ProfileSettingsContainer")).toBeVisible();
    expect(rendered.getByText("ManagementWrapper")).not.toBeVisible();
    expect(rendered.getAllByText("CallflowManagementWrapper")[0]).not.toBeVisible();
    expect(rendered.getByText("AlohaFlowContainer")).not.toBeVisible();
  });

  test("when we click on the 'Aloha Flow Container' link, only AlohaFlowContainer should be visible", () => {
    const rendered = render(<NavTabs />);
    fireEvent.click(rendered.getByText("Call Flow DB Management"));
    expect(rendered.getByText("ProfileSettingsContainer")).not.toBeVisible();
    expect(rendered.getByText("ManagementWrapper")).not.toBeVisible();
    expect(rendered.getAllByText("CallflowManagementWrapper")[0]).not.toBeVisible();
    expect(rendered.getByText("AlohaFlowContainer")).toBeVisible();
  });

  test("when we click on the already clicked link, nothing should change", () => {
    const rendered = render(<NavTabs />);
    fireEvent.click(rendered.getByText("User Management"));
    expect(rendered.getByText("ManagementWrapper")).toBeVisible();
    expect(rendered.getAllByText("CallflowManagementWrapper")[0]).not.toBeVisible();
    expect(rendered.getByText("ProfileSettingsContainer")).not.toBeVisible();
    expect(rendered.getByText("AlohaFlowContainer")).not.toBeVisible();
  });
});