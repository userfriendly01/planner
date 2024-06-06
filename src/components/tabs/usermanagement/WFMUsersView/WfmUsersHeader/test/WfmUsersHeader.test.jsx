import { WfmUsersHeader } from "../WfmUsersHeader";
import { ExportWfmUsersButton } from "usermanagement/ExportWfmUsersButton";
import { Dropdown } from "components/Dropdown";
import { SearchBox } from "components/SearchBox";
import React from "react";
import {
  act,
  render,
  setupMockedComponents,
  initialTestState,
  waitFor
} from "testUtils";
import { useAdminState } from "context/appContext";
import {
  getCalabrioWfmOrg
} from "utils/calabrioUtils";
import { ModalOverlayStatuses } from "globals/interfaces";

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

jest.mock("utils/calabrioUtils", () => ({
  getCalabrioWfmOrg: jest.fn(),
  getWfmTeams: jest.requireActual("utils/calabrioUtils").getWfmTeams,
  getWfmBusinessUnits: jest.requireActual("utils/calabrioUtils").getWfmBusinessUnits
}));

jest.mock("components/Dropdown", () => ({
  Dropdown: jest.fn()
}));

jest.mock("components/SearchBox", () => ({
  SearchBox: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("usermanagement/ExportWfmUsersButton", () => ({
  ExportWfmUsersButton: jest.fn()
}));

const tableState = {
  manager: "Edie Britt",
  searchBy: "Look out!",
  searchResults: ["aww edie"]
};

const mockSetStatus = jest.fn();
const mockSetTableState = jest.fn();

const renderComponent = customTableState => {
  render(<WfmUsersHeader
    setStatus={mockSetStatus}
    tableState={customTableState || tableState}
    setTableState={mockSetTableState}/>);
};

describe("WfmUsersHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    getCalabrioWfmOrg.mockResolvedValue("yay!");
    setupMockedComponents({
      Dropdown,
      SearchBox,
      ExportWfmUsersButton
    });
  });
  describe("initial render", () => {
    test("component renders as expected", () => {
      renderComponent();
      expect(ExportWfmUsersButton.mock.calls.length).toBe(1);
      expect(ExportWfmUsersButton.mock.calls[0][0].selected).toBe(tableState.searchResults);
      expect(ExportWfmUsersButton.mock.calls[0][0].label).toBe("Export");
      expect(SearchBox.mock.calls.length).toBe(1);
      expect(SearchBox.mock.calls[0][0].searchBy).toBe(tableState.searchBy);
      expect(Dropdown.mock.calls.length).toBe(2);
      expect(ExportWfmUsersButton.mock.calls.length).toBe(1);
    });
  });
  describe("updateValue is called on Business Unit Dropdown", () => {
    describe("getCalabrioWfmOrg is successful", () => {
      test("should call setTableState", async () => {
        const BUId = "123-321";
        renderComponent();
        const updateValue = Dropdown.mock.calls[0][0].updateValue;
        act(() => updateValue({}, { value: BUId }));
        expect(mockSetTableState).toHaveBeenCalledTimes(1);
        expect(mockSetTableState).toHaveBeenCalledWith({
          ...tableState,
          businessUnitFilter: BUId,
          pagination: {
            ...tableState.pagination,
            pageNumber: 1
          }
        });
        await waitFor(() => {
          expect(mockSetStatus).toHaveBeenCalledTimes(2);
          expect(mockSetStatus).toHaveBeenCalledWith(ModalOverlayStatuses.SAVING);
          expect(mockSetStatus).toHaveBeenCalledWith(ModalOverlayStatuses.SUCCESS);
        });
      });
    });
    describe("getCalabrioWfmOrg fails", () => {
      test("should call setTableState", async () => {
        getCalabrioWfmOrg.mockRejectedValue("yay!");
        const BUId = "123-321";
        renderComponent();
        const updateValue = Dropdown.mock.calls[0][0].updateValue;
        act(() => updateValue({}, { value: BUId }));
        expect(mockSetTableState).toHaveBeenCalledTimes(1);
        expect(mockSetTableState).toHaveBeenCalledWith({
          ...tableState,
          businessUnitFilter: BUId,
          pagination: {
            ...tableState.pagination,
            pageNumber: 1
          }
        });
        await waitFor(() => {
          expect(mockSetStatus).toHaveBeenCalledTimes(2);
          expect(mockSetStatus).toHaveBeenCalledWith(ModalOverlayStatuses.SAVING);
          expect(mockSetStatus).toHaveBeenCalledWith(ModalOverlayStatuses.FAIL);
        });
      });
    });
  });
  describe("existing bu value is unknown", () => {
    test("should call setTableState", () => {
      renderComponent({
        ...tableState,
        businessUnitFilter: "unknown"
      });
      const option = Dropdown.mock.calls[0][0].value;
      expect(option).toBe("");
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
  describe("existing team value is populated", () => {
    test("should call setTableState", () => {
      renderComponent({
        ...tableState,
        teamFilter: "111"
      });
      const option = Dropdown.mock.calls[1][0].value;
      expect(option.label).toBe("Team1");
      expect(option.value).toBe("111");
    });
  });
  describe("existing team value is unknown", () => {
    test("should call setTableState", () => {
      renderComponent({
        ...tableState,
        teamFilter: "77655"
      });
      const option = Dropdown.mock.calls[1][0].value;
      expect(option).toBe("");
    });
  });
  describe("existing team value === no-team", () => {
    test("should call setTableState", () => {
      renderComponent({
        ...tableState,
        teamFilter: "no-team"
      });
      const option = Dropdown.mock.calls[1][0].value;
      expect(option.value).toBe("no-team");
      expect(option.label).toBe("No Team");
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