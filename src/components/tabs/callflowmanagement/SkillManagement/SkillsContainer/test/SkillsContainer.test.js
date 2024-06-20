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
import { useSkillState } from "context/appContext";

jest.mock("context/appContext", () => ({
  useSkillState: jest.fn()
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
    useSkillState.mockReturnValue({
      taskQueues: [{ taskque: "cool" }],
      applications: [{ application: "yo" }],
      timeOfDays: [{ time: "hey" }]
    });
  });
  describe("initial render", () => {
    test("component renders as expected", async () => {
      renderComponent();
      expect(SkillsTable.mock.calls.length).toBe(1);
      expectOnlyPassedProps(SkillsTable, {
        tableState,
        setTableState: mockSetTableState
      });
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