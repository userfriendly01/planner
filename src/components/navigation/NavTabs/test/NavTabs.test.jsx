import React from "react";
import NavTabs from "../NavTabs";
import { StyledTab, DropdownContainer, StyledTabContainer } from "../NavTabs.Styles";
import { useAdminState } from "context";
import { Link, useNavigate } from "react-router-dom";
import {
  render,
  fireEvent,
  expectOnlyPassedProps,
  setupMockedComponents,
  initialTestState,
  tabs,
  act,
  waitFor
} from "testUtils";
import {
  Button
} from "@mui/material";

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Button: jest.fn()
}));

jest.mock("../NavTabs.Styles", () => ({
  Content: jest.requireActual("../NavTabs.Styles").Content,
  DropdownContainer: jest.requireActual("../NavTabs.Styles").DropdownContainer,
  StyledLink: jest.requireActual("../NavTabs.Styles").StyledLink,
  StyledTab: jest.fn(),
  StyledTabContainer: jest.requireActual("../NavTabs.Styles").StyledTabContainer
}));

jest.mock("authentication", () => ({
  getTabs: jest.requireActual("authentication").getTabs
}));

jest.mock("react-router-dom", () => ({
  Link: jest.fn(),
  useNavigate: jest.fn()
}));

const mockNavigate = jest.fn();

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

describe("NavTabs", () => {
  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
    useAdminState.mockReturnValue(state);
    setupMockedComponents({
      Link,
      StyledTab,
      Button
    });
  });
  describe("initial render", () => {
    test("renders Nav Tabs", () => {
      render(<NavTabs />);
      expect(StyledTab.mock.calls.length).toBe(4);
      expect(StyledTab.mock.calls[0][0].children).toBe("User Management");
      expect(StyledTab.mock.calls[1][0].children).toBe("Profile Settings");
      expect(StyledTab.mock.calls[2][0].children).toBe("Call Flow Management");
      expect(StyledTab.mock.calls[3][0].children).toBe("Aloha Flow Management");
      expect(Link.mock.calls.length).toBe(0);
    });
  });
  describe("handleDropdown", () => {
    describe("dropdown is array of routes", () => {
      test("Links Render", async () => {
        const rendered = render(<NavTabs />);
        expect(StyledTab.mock.calls.length).toBe(4);
        expect(Link.mock.calls.length).toBe(0);
        const dropdownActionDivs = rendered.getAllByTestId("dropdown-action");
        expect(dropdownActionDivs.length).toBe(4);
        act(() => fireEvent.mouseEnter(dropdownActionDivs[0]));
        expect(Link.mock.calls.length).toBe(3);
        act(() => fireEvent.mouseLeave(dropdownActionDivs[0]));
        expect(Link.mock.calls.length).toBe(3);
      });
    });
    describe("dropdown is null", () => {
      test("No Links Render", async () => {
        const rendered = render(<NavTabs />);
        expect(Link.mock.calls.length).toBe(0);
        const dropdownActionDivs = rendered.getAllByTestId("dropdown-action");
        expect(dropdownActionDivs.length).toBe(4);
        act(() => fireEvent.mouseEnter(dropdownActionDivs[3]));
        expect(Link.mock.calls.length).toBe(0);
      });
    });
  });
  describe("tab is clicked", () => {
    test("navigates to route", () => {
      const rendered = render(<NavTabs />);
      expect(StyledTab.mock.calls.length).toBe(4);
      const onClick = StyledTab.mock.calls[0][0].onClick;
      act(() => onClick());
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });
});