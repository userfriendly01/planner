import TritonUsersHeader from "../TritonUsersHeader";
import {
  ManagerDropdown,
  ResetSkillsButton,
  SearchBox
} from "components";
import React from "react";
import {
  act,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  ManagerDropdown: jest.fn(),
  ResetSkillsButton: jest.fn(),
  SearchBox: jest.fn(),
  StyledButton: jest.fn()
}));

const tableState = {
  manager: "Edie Britt",
  searchBy: "Look out!"
};

const mockSetTableState = jest.fn();

const renderComponent = () => {
  render(<TritonUsersHeader tableState={tableState} setTableState={mockSetTableState}/>);
};

describe("TritonUsersHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      ManagerDropdown,
      ResetSkillsButton,
      SearchBox
    });
  });
  describe("initial render", () => {
    test("component renders as expected", () => {
      renderComponent();
      expect(ManagerDropdown.mock.calls.length).toBe(1);
      expect(ManagerDropdown.mock.calls[0][0].filterBy).toBe(tableState.manager);
      expect(SearchBox.mock.calls.length).toBe(1);
      expect(SearchBox.mock.calls[0][0].searchBy).toBe(tableState.searchBy);
      expect(ResetSkillsButton.mock.calls.length).toBe(1);
    });
  });
  describe("setFilter is called on Manager Dropdown", () => {
    test("should call setTableState", () => {
      const managerNNumber = "n0263786";
      renderComponent();
      const setFilter = ManagerDropdown.mock.calls[0][0].setFilter;
      act(() => setFilter(managerNNumber));
      expect(mockSetTableState).toHaveBeenCalledTimes(1);
      expect(mockSetTableState).toHaveBeenCalledWith({
        ...tableState,
        managerFilter: managerNNumber
      });
    });
  });
  describe("setSearch is called on SearchBox", () => {
    test("should call setTableState", () => {
      const searchBy = "Puppies";
      renderComponent();
      const setSearch = SearchBox.mock.calls[0][0].setSearch;
      act(() => setSearch(searchBy));
      expect(mockSetTableState).toHaveBeenCalledTimes(1);
      expect(mockSetTableState).toHaveBeenCalledWith({
        ...tableState,
        searchBy
      });
    });
  });
});