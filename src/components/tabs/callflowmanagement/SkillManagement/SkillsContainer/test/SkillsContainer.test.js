import { SkillsContainer } from "../SkillsContainer";
import React from "react";
import { SkillsHeader } from "callflowmanagement/SkillsHeader";
import { SkillsTable } from "callflowmanagement/SkillsTable";
import {
  render,
  expectOnlyPassedProps,
  skillsList,
  setupMockedComponents,
  waitFor
} from "testUtils";
import { getTimeOfDays } from "services/timeOfDays";
import { getTaskQueues } from "services/taskQueues";
import { getApplications } from "services/applications";

jest.mock("context/reducer", () => ({
  reducer: jest.fn()
}));

jest.mock("context/userFormReducer", () => ({
  userFormReducer: jest.fn()
}));

jest.mock("callflowmanagement/SkillsHeader", () => ({
  SkillsHeader: jest.fn()
}));

jest.mock("callflowmanagement/SkillsTable", () => ({
  SkillsTable: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("services/taskQueues", () => ({
  getTaskQueues: jest.fn()
}));

jest.mock("services/applications", () => ({
  getApplications: jest.fn()
}));

jest.mock("services/timeOfDays", () => ({
  getTimeOfDays: jest.fn()
}));

const mockSetTableState = jest.fn();
const tableState = { selected: skillsList[0] };

const renderComponent = () => {
  return render(<SkillsContainer
    tableState={tableState}
    setTableState={mockSetTableState}
  />);
};

describe("<SkillsContainer />", () => {
  beforeEach(() => {
    setupMockedComponents({
      SkillsHeader,
      SkillsTable
    });
  });
  describe("initial render", () => {
    getApplications.mockResolvedValue([{ application: "yo" }]);
    getTaskQueues.mockResolvedValue([{ taskque: "cool" }]);
    getTimeOfDays.mockResolvedValue([{ time: "hey" }]);
    test("component renders as expected", async () => {
      renderComponent();
      expect(SkillsHeader.mock.calls.length).toBe(1);
      expectOnlyPassedProps(SkillsHeader, {
        tableState,
        setTableState: mockSetTableState,
        taskQueues: [],
        applications: [],
        timeOfDays: []
      });
      expect(SkillsTable.mock.calls.length).toBe(1);
      expectOnlyPassedProps(SkillsTable, {
        tableState,
        setTableState: mockSetTableState
      });
      expect(getApplications).toHaveBeenCalledTimes(1);
      expect(getTaskQueues).toHaveBeenCalledTimes(1);
      expect(getTimeOfDays).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expectOnlyPassedProps(SkillsHeader, {
          tableState,
          setTableState: mockSetTableState,
          taskQueues: [{ taskque: "cool" }],
          applications: [{ application: "yo" }],
          timeOfDays: [{ time: "hey" }]
        });
      });
    });
  });
});