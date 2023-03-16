import {
  useAdminState
} from "context";
import React from "react";
import {
  initialTestState,
  render,
  setupMockedComponents,
  tabs
} from "testUtils";
import NavTabs from "../NavTabs";
import { getAzureSPAClientId } from "utils";
import {
  Tab, Tabs, Typography
} from "@mui/material";

jest.mock("@mui/material", () => ({
  Tab: jest.fn(),
  Tabs: jest.fn(),
  Typography: jest.fn()
}));
jest.mock("authentication", () => ({
  getTabs: jest.requireActual("authentication").getTabs
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
jest.mock("utils", () => ({
  getAzureSPAClientId: jest.fn()
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

const renderNavTabs = () => {
  render(<NavTabs />);
  render(Tabs.mock.calls[1][0].children);
};

describe("<NavTabs />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(state);
    setupMockedComponents({
      Tab,
      Tabs,
      Typography
    });
  });

  test("we should load the links, as well as default to showing the Management Pane", () => {
    renderNavTabs(<NavTabs />);
    Typography.mock.calls.forEach(m => {
      render(m[0].children);
    });
    expect(Tabs.mock.calls[1][0].value).toBe(0);
    expect(tabs.TRITON_USER_MANAGEMENT.component).toHaveBeenCalledTimes(1);
    expect(tabs.TRITON_PROFILE_SETTINGS.component).toHaveBeenCalledTimes(1);
    expect(tabs.TRITON_CALL_FLOW_MANAGEMENT.component).toHaveBeenCalledTimes(1);
    expect(tabs.ALOHA_CALL_FLOW_MANAGEMENT.component).toHaveBeenCalledTimes(1);
    expect(tabs.ALOHA_ROUTING_RULES.component).toHaveBeenCalledTimes(0);
    expect(getAzureSPAClientId).toBeCalled();
  });

  test("when we click on the 'Call Flow Management' link, only CallflowManagementWrapper should be visible", () => {
    renderNavTabs(<NavTabs />);
    expect(Tabs.mock.calls.length).toBe(2);
    expect(Tabs.mock.calls[1][0].value).toBe(0);
    Tabs.mock.calls[1][0].onChange(null, 1);
    expect(Tabs.mock.calls.length).toBe(3);
    expect(Tabs.mock.calls[2][0].value).toBe(1);
  });
});