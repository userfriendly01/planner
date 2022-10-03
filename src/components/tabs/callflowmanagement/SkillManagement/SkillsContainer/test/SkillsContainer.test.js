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
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  SkillsHeader: jest.fn(),
  SkillsTable: jest.fn(),
  StyledButton: jest.fn()
}));

const mockSetChecked = jest.fn();
const mockSetTableState = jest.fn();
const checked = [skillsList[0]];
const tableState = { selected: true };

const renderComponent = () => {
  return render(<SkillsContainer
    checked={checked}
    tableState={tableState}
    setChecked={mockSetChecked}
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
    test("component renders as expected", () => {
      renderComponent();
      expect(SkillsHeader.mock.calls.length).toBe(1);
      expectOnlyPassedProps(SkillsHeader, {
        tableState,
        checked,
        setTableState: mockSetTableState
      });
      expect(SkillsTable.mock.calls.length).toBe(1);
      expectOnlyPassedProps(SkillsTable, {
        checked,
        tableState,
        setChecked: mockSetChecked,
        setTableState: mockSetTableState
      });
    });
  });
});