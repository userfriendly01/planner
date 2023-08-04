import TritonUsersHeader from "../TritonUsersHeader";
import ExportButton from "../ExportUsersButton";
import {
  FilterButton,
  ResetSkillsButton,
  SearchBox
} from "components";
import React from "react";
import {
  act,
  initialTestState,
  render,
  setupMockedComponents
} from "testUtils";
import {
  useAdminState, useAdminDispatch
} from "context";

jest.mock("components", () => ({
  FilterButton: jest.fn(),
  ResetSkillsButton: jest.fn(),
  SearchBox: jest.fn(),
  StyledButton: jest.fn(),
  Chip: jest.fn()
}));

jest.mock("../ExportUsersButton", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("context", () => ({
  useAdminDispatch: jest.fn(),
  useAdminState: jest.fn()
}));

const tableState = {
  searchBy: "Look out!",
  searchResults: ["aww edie"]
};

const mockSetTableState = jest.fn();

const mockAdminDispatch = jest.fn()


const renderComponent = () => {
  render(<TritonUsersHeader tableState={tableState} setTableState={mockSetTableState}/>);
};

describe("TritonUsersHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminDispatch.mockReturnValue(mockAdminDispatch);
    useAdminState.mockReturnValue(initialTestState);
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

  // TODO - unit test the chips
  // describe("")
});