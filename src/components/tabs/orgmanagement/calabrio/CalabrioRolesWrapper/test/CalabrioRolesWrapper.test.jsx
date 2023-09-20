import CalabrioRolesWrapper from "../CalabrioRolesWrapper";
import {
  Role,
  Permission
} from "../CalabrioRolesWrapper.Styles";
import { useAdminState } from "context";
import React from "react";
import { sortCalabrioObject } from "utils";
import {
  act,
  initialTestState,
  expectOnlyPassedProps,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";
import { Divider } from "@mui/material";

jest.mock("../CalabrioRolesWrapper.Styles", () => ({
  ...jest.requireActual("../CalabrioRolesWrapper.Styles"),
  Role: jest.fn(),
  Permission: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

jest.mock("utils", () => ({
  sortCalabrioObject: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Divider: jest.fn()
}));

describe("CalabrioOrgWrapper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    sortCalabrioObject.mockReturnValueOnce(initialTestState.calabrioContext.roles);
    sortCalabrioObject.mockReturnValueOnce(initialTestState.calabrioContext.roles[0].permissions);
    sortCalabrioObject.mockReturnValueOnce(initialTestState.calabrioContext.roles[0].permissions);
    setupMockedComponents({
      Divider,
      Role,
      Permission
    });
  });

  describe("initial render", () => {
    test("renders as expected", () => {
      render(<CalabrioRolesWrapper />);
      expect(Divider.mock.calls.length).toBe(5);
      expect(Role.mock.calls.length).toBe(5);
      expectOnlyPassedProps(Role, {
        children: "QM Supervisor",
        selected: true
      }, 0);
      expectOnlyPassedProps(Role, {
        children: "QM Agent",
        selected: false
      }, 1);
      expectOnlyPassedProps(Role, {
        children: "WFM_Agent_NT_Dashboards",
        selected: false
      }, 2);
      expectOnlyPassedProps(Role, {
        children: "No Screen",
        selected: false
      }, 3);
      expectOnlyPassedProps(Role, {
        children: "Supervisor-Sync Only",
        selected: false
      }, 4);
      expect(Permission.mock.calls.length).toBe(1);
      expectOnlyPassedProps(Permission, { children: "permission 1" }, 0);
    });
  });
  describe("A different group is selected", () => {
    test("should re-render teams for that group", () => {
      render(<CalabrioRolesWrapper />);
      expect(Role.mock.calls.length).toBe(5);
      expect(Permission.mock.calls.length).toBe(1);
      const onClick = Role.mock.calls[1][0].onClick;
      act(() => onClick())
      expect(Role.mock.calls[6][0].selected).toBe(true);
      expect(Permission.mock.calls.length).toBe(3);
      expect(Permission.mock.calls[1][0].children).toBe("permission 2");
      expect(Permission.mock.calls[2][0].children).toBe("permission 3");
    });
  });
});