import CalabrioOrgWrapper from "../CalabrioOrgWrapper";
import {
  Group,
  Team
} from "../CalabrioOrgWrapper.Styles";
import { useAdminState } from "context/appContext";
import React from "react";
import { sortCalabrioObject } from "utils/_sortUtils";
import {
  act,
  initialTestState,
  expectOnlyPassedProps,
  render,
  setupMockedComponents
} from "testUtils";
import { Divider } from "@mui/material";

jest.mock("../CalabrioOrgWrapper.Styles", () => ({
  ...jest.requireActual("../CalabrioOrgWrapper.Styles"),
  Group: jest.fn(),
  Team: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn()
}));

jest.mock("utils/_sortUtils", () => ({
  sortCalabrioObject: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Divider: jest.fn()
}));

describe("CalabrioOrgWrapper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    sortCalabrioObject.mockReturnValueOnce(initialTestState.calabrioContext.groups);
    sortCalabrioObject.mockReturnValueOnce(initialTestState.calabrioContext.teams);
    setupMockedComponents({
      Divider,
      Group,
      Team
    });
  });

  describe("initial render", () => {
    test("renders as expected", () => {
      render(<CalabrioOrgWrapper />);
      expect(Divider.mock.calls.length).toBe(3);
      expect(Group.mock.calls.length).toBe(3);
      expectOnlyPassedProps(Group, {
        children: "Hawaii 50 Group",
        selected: true
      }, 0);
      expectOnlyPassedProps(Group, {
        children: "FNOL Group",
        selected: false
      }, 1);
      expectOnlyPassedProps(Group, {
        children: "No Teams Group",
        selected: false
      }, 2);
      expect(Team.mock.calls.length).toBe(2);
      expectOnlyPassedProps(Team, { children: "Hawaii Team 50" }, 0);
      expectOnlyPassedProps(Team, { children: "Hawaii Specialty Team" }, 1);
    });
  });
  describe("A different group is selected", () => {
    test("should re-render teams for that group", () => {
      render(<CalabrioOrgWrapper />);
      expect(Group.mock.calls.length).toBe(3);
      expect(Team.mock.calls.length).toBe(2);
      const onClick = Group.mock.calls[1][0].onClick;
      act(() => onClick());
      expect(Group.mock.calls[4][0].selected).toBe(true);
      expect(Team.mock.calls.length).toBe(3);
      expect(Team.mock.calls[2][0].children).toBe("FNOL Team");
    });
  });
});