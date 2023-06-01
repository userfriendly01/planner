import WfmUsersViewWrapper from "../WfmUsersViewWrapper";
import {
  WfmErrorBanner,
  WfmUsersHeader,
  Pagination,
  WfmUserTable
} from "components";
import { useAdminState } from "context";
import { useNavigate } from 'react-router-dom';
import WFMLoadRetryModal from "../../../BulkChanges/WFMLoadRetryModal";
import React from "react";
import {
  act,
  expectOnlyPassedProps,
  getLastInstanceCalled,
  initialTestState,
  render,
  setupMockedComponents
} from "testUtils";
import {
  getWfmPeople,
  sortWfmWorkersByFullName
} from "utils";

jest.mock("components", () => ({
  WfmErrorBanner: jest.fn(),
  WfmUsersHeader: jest.fn(),
  Pagination: jest.fn(),
  WfmUserTable: jest.fn()
}));

jest.mock("../../../BulkChanges/WFMLoadRetryModal", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn()
}));

const defaultTableState = {
  searchBy: "",
  selected: [],
  teamFilter: null,
  businessUnitFilter: null,
  searchResults: getWfmPeople(initialTestState),
  pagination: {
    usersPerPage: 25,
    pageNumber: 1,
    length: 0,
    startingUserIndex: null,
    endingUserIndex: null
  },
  filteredList: []
};

const workersCopy = getWfmPeople(initialTestState).slice();
const mockNavigate = jest.fn();

describe("WfmUsersViewWrapper", () => {
  const doRender = () => {
    return render(<WfmUsersViewWrapper/>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      WfmErrorBanner,
      WfmUsersHeader,
      Pagination,
      WfmUserTable,
      WFMLoadRetryModal
    });
    useAdminState.mockReturnValue(initialTestState);
    useNavigate.mockReturnValue(mockNavigate);
  });
  describe("initial render", () => {
    test("ManagementHeader, WfmUserTable, Pagination are rendered with expected props", () => {
      const expectedDefaultTableState = {
        tableState: {
          ...defaultTableState,
          searchResults: getWfmPeople(initialTestState).sort(sortWfmWorkersByFullName),
          pagination: {
            ...defaultTableState.pagination,
            startingUserIndex: 0,
            length: 3,
            endingUserIndex: 24
          },
          filteredList: getWfmPeople(initialTestState).sort(sortWfmWorkersByFullName)
        }
      }
      doRender();
      expect(WfmUsersHeader).toHaveBeenCalledTimes(2);
      expectOnlyPassedProps(WfmUsersHeader, expectedDefaultTableState, getLastInstanceCalled(WfmUsersHeader));
      expect(WfmUserTable).toHaveBeenCalledTimes(2);
      expect(WfmErrorBanner).toHaveBeenCalledTimes(2);
      expectOnlyPassedProps(WfmUserTable, expectedDefaultTableState, getLastInstanceCalled(WfmUserTable));
      expect(Pagination).toHaveBeenCalledTimes(1);
      expectOnlyPassedProps(Pagination, expectedDefaultTableState, getLastInstanceCalled(Pagination));
    });
    describe("WFM state is not loaded", () => {
      beforeEach(() => {
        useAdminState.mockReturnValue({
          ...initialTestState,
          calabrioContext: {
            wfmOrg: null
          }
        });
      });
      test("should render WFMLoadRetryModal", () => {
        doRender();
        expect(WFMLoadRetryModal).toHaveBeenCalledTimes(1);
      });
      describe.only("WFMLoadRetryModal handleClose is called", () => {
        test("should call navigate with -1", () => {
          doRender();
          expect(WFMLoadRetryModal).toHaveBeenCalledTimes(1);     
          const handleClose = WFMLoadRetryModal.mock.calls[0][0].handleClose;
          act(() => handleClose());
          expect(mockNavigate).toHaveBeenCalledTimes(1);
          expect(mockNavigate).toHaveBeenCalledWith(-1);
        });
      })
    });
  });
  describe("searchBy === Faith", () => {
    test("filtered list only inlcudes expected options", () => {
      doRender();
      const setWfmTable = WfmUserTable.mock.calls[0][0].setTableState;
      act(() => setWfmTable({
        ...defaultTableState,
        searchBy: "FaiTh"
      }));
      expect(WfmUserTable.mock.calls.length).toBe(3);
      expect(WfmUserTable.mock.calls[2][0].tableState.filteredList).toStrictEqual([workersCopy[2]]);
    });
    describe("team filter is selected", () => {
      test("filtered list only inlcudes expected options", () => {
        doRender();
        const setWfmTable = WfmUserTable.mock.calls[0][0].setTableState;
        act(() => setWfmTable({
          ...defaultTableState,
          teamFilter: "111"
        }));
        expect(WfmUserTable.mock.calls.length).toBe(3);
        expect(WfmUserTable.mock.calls[2][0].tableState.filteredList).toStrictEqual([workersCopy[1]]);
      });
    });
    describe("business Unit filter is selected", () => {
      test("filtered list only inlcudes expected options", () => {
        doRender();
        const setWfmTable = WfmUserTable.mock.calls[0][0].setTableState;
        act(() => setWfmTable({
          ...defaultTableState,
          businessUnitFilter: "123-321"
        }));
        expect(WfmUserTable.mock.calls.length).toBe(3);
        expect(WfmUserTable.mock.calls[2][0].tableState.filteredList).toStrictEqual([workersCopy[1]]);
      });
    });
    describe("pagination is moved to page 2", () => {
      test("filtered list only inlcudes expected options", () => {
        doRender();
        const setWfmTable = Pagination.mock.calls[0][0].setTableState;
        act(() => setWfmTable({
          ...defaultTableState,
          pagination: {
            ...defaultTableState.pagination,
            pageNumber: 2
          }
        }));
        expect(Pagination.mock.calls.length).toBe(3);
        expect(Pagination.mock.calls[2][0].tableState.filteredList).toStrictEqual([]);
      });
    });
  });
});