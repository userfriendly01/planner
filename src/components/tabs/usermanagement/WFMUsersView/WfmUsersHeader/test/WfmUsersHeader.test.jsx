import WfmUsersHeader from "../WfmUsersHeader";
import ExportButton from "../ExportUsersButton";
import {
  Dropdown,
  SearchBox
} from "components";
import React from "react";
import {
  act,
  render,
  setupMockedComponents,
  initialTestState
} from "testUtils";
import { useAdminState } from "context";

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

jest.mock("components", () => ({
  Dropdown: jest.fn(),
  SearchBox: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("../ExportUsersButton", () => ({
  __esModule: true,
  default: jest.fn()
}));

const tableState = {
  manager: "Edie Britt",
  searchBy: "Look out!",
  searchResults: ["aww edie"]
};

const mockSetTableState = jest.fn();

const renderComponent = () => {
  render(<WfmUsersHeader tableState={tableState} setTableState={mockSetTableState}/>);
};

describe("WfmUsersHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      Dropdown,
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
      expect(Dropdown.mock.calls.length).toBe(2);
      expect(ExportButton.mock.calls.length).toBe(1);
    });
  });
  describe("updateValue is called on Business Unit Dropdown", () => {
    test("should call setTableState", () => {
      const BUId = "123-321";
      renderComponent();
      const updateValue = Dropdown.mock.calls[0][0].updateValue;
      act(() => updateValue({}, BUId));
      expect(mockSetTableState).toHaveBeenCalledTimes(1);
      expect(mockSetTableState).toHaveBeenCalledWith({
        ...tableState,
        businessUnitFilter: BUId
      });
    });
  });
  describe("updateValue is called on Team Dropdown", () => {
    test("should call setTableState", () => {
      const TeamId = { value: "111" };
      renderComponent();
      const updateValue = Dropdown.mock.calls[1][0].updateValue;
      act(() => updateValue({}, TeamId));
      expect(mockSetTableState).toHaveBeenCalledTimes(1);
      expect(mockSetTableState).toHaveBeenCalledWith({
        ...tableState,
        teamFilter: "111"
      });
    });
  });
  describe("setSearch is called on SearchBox", () => {
    test("should call setTableState", () => {
      const searchBy = "hi";
      renderComponent();
      const setSearch = SearchBox.mock.calls[0][0].setSearch;
      act(() => setSearch(searchBy));
      expect(mockSetTableState).toHaveBeenCalledTimes(1);
      expect(mockSetTableState).toHaveBeenCalledWith({
        ...tableState,
        searchBy,
        pagination: {
          pageNumber: 1
        }
      });
    });
  });
});