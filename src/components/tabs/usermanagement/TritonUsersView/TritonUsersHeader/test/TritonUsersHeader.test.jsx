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
import { Chip } from "@mui/material";

jest.mock("components", () => ({
  FilterButton: jest.fn(),
  ResetSkillsButton: jest.fn(),
  SearchBox: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("@mui/material", () => ({
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

const mockAdminDispatch = jest.fn();

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
      ExportButton,
      Chip
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

  describe("Filters are displayed", () => {
    describe("Manager filter", () => {
      const testState = {
        ...initialTestState,
        userManagementTableFilters: {
          ...initialTestState.userManagementTableFilters,
          managerFilter: "n1234567"
        }
      };
      beforeEach(() => {
        useAdminState.mockReturnValue(testState);
      });
      test("Selected manager shows in Chip", () => {
        renderComponent();
        expect(Chip.mock.calls.length).toBe(1);
        expect(Chip.mock.calls[0][0].label).toEqual("John Wick");
      });
      test("Selected manager Chip clicked, calls dispatch to remove filter", () => {
        renderComponent();
        expect(Chip.mock.calls.length).toBe(1);
        const onDelete = Chip.mock.calls[0][0].onDelete;
        act(() => onDelete());
        expect(mockAdminDispatch).toHaveBeenCalledWith({
          type: "updateManagerFilter",
          payload: null
        });
      });
    });
    describe("Profile filter", () => {
      const testState = {
        ...initialTestState,
        userManagementTableFilters: {
          ...initialTestState.userManagementTableFilters,
          profileFilterArray: [
            {
              value: "1",
              label: "test1"
            },
            {
              value: "2",
              label: "test2"
            }
          ]
        }
      };
      beforeEach(() => {
        useAdminState.mockReturnValue(testState);
      });
      test("Selected profile shows in Chip", () => {
        renderComponent();
        expect(Chip.mock.calls.length).toBe(2);
        expect(Chip.mock.calls[0][0].label).toEqual("test1");
        expect(Chip.mock.calls[1][0].label).toEqual("test2");
      });
      test("Selected profile Chip clicked, calls dispatch to remove filter", () => {
        renderComponent();
        expect(Chip.mock.calls.length).toBe(2);
        const onDeleteChip1 = Chip.mock.calls[0][0].onDelete;
        act(() => onDeleteChip1());
        expect(mockAdminDispatch).toHaveBeenCalledTimes(1);
        expect(mockAdminDispatch).toHaveBeenCalledWith({
          type: "updateProfileFilter",
          payload: [
            {
              value: "2",
              label: "test2"
            }
          ]
        });
      });
    });
    describe("OU filter", () => {
      const testState = {
        ...initialTestState,
        userManagementTableFilters: {
          ...initialTestState.userManagementTableFilters,
          ouFilterArray: [
            {
              value: "testsid",
              label: "testname"
            }
          ]
        }
      };
      beforeEach(() => {
        useAdminState.mockReturnValue(testState);
      });
      test("Selected ou shows in Chip", () => {
        renderComponent();
        expect(Chip.mock.calls.length).toBe(1);
        expect(Chip.mock.calls[0][0].label).toEqual("OU: testname");
      });
      test("Selected ou Chip clicked, calls dispatch to remove filter", () => {
        renderComponent();
        expect(Chip.mock.calls.length).toBe(1);
        const onDeleteChip = Chip.mock.calls[0][0].onDelete;
        act(() => onDeleteChip());
        expect(mockAdminDispatch).toHaveBeenCalledTimes(1);
        expect(mockAdminDispatch).toHaveBeenCalledWith({
          type: "updateOuFilter",
          payload: []
        });
      });
    });
  });
});