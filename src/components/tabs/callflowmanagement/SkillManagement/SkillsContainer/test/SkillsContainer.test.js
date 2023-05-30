import SkillsContainer from "../SkillsContainer";
import React from "react";
import {
  SkillsHeader,
  SkillsTable
} from "components";
import {
  render,
  expectOnlyPassedProps,
  skillsList,
  setupMockedComponents,
  waitFor
} from "testUtils";
import {
  getTaskQueues,
  getApplications,
  getTimeOfDays
} from "services";

jest.mock("components", () => ({
  SkillsHeader: jest.fn(),
  SkillsTable: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("services", () => ({
  getTaskQueues: jest.fn(),
  getApplications: jest.fn(),
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