import TritonUsersHeader from "../TritonUsersHeader";
import ExportButton from "../ExportUsersButton";
import {
  ManagerDropdown,
  FilterButton,
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
  //ManagerDropdown: jest.fn(),
  FilterButton: jest.fn(),
  ResetSkillsButton: jest.fn(),
  SearchBox: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("../ExportUsersButton", () => ({
  __esModule: true,
  default: jest.fn()
}));

const tableState = {
  //manager: "Edie Britt",
  searchBy: "Look out!",
  searchResults: ["aww edie"]
};

const mockSetTableState = jest.fn();

const renderComponent = () => {
  render(<TritonUsersHeader tableState={tableState} setTableState={mockSetTableState}/>);
};

describe("TritonUsersHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      FilterButton,
      ResetSkillsButton,
      SearchBox,
      ExportButton
    });
  });
  describe("initial render", () => {
    test("component renders as expected", () => {
      renderComponent();
      expect(ExportButton.mock.calls.length).toBe(1);
      expect(ExportButton.mock.calls[0][0].selected).toBe(tableState.searchResults);
      expect(ExportButton.mock.calls[0][0].label).toBe("Export");
      expect(SearchBox.mock.calls.length).toBe(1);
      expect(SearchBox.mock.calls[0][0].searchBy).toBe(tableState.searchBy);
      expect(ResetSkillsButton.mock.calls.length).toBe(1);
      expect(FilterButton.mock.calls.length).toBe(1);
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