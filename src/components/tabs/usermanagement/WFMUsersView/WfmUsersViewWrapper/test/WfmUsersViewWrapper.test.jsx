import { WfmUsersViewWrapper } from "../WfmUsersViewWrapper";
import { Pagination } from "components/Pagination";
import { WfmUsersHeader } from "usermanagement/WfmUsersHeader";
import { WfmUserTable } from "usermanagement/WfmUserTable";
import { InfoBanner } from "usermanagement/InfoBanner";
import { WfmErrorBanner } from "usermanagement/WfmErrorBanner";
import { useAdminState } from "context/appContext";
import React from "react";
import {
  act,
  expectOnlyPassedProps,
  getLastInstanceCalled,
  initialTestState,
  render,
  setupMockedComponents
} from "testUtils";
import { getWfmPeople } from "utils/calabrioUtils";
import { sortWfmWorkersByFullName } from "utils/sortUtils";
import { ModalOverlayStatuses } from "globals/interfaces";

jest.mock("components/Pagination", () => ({
  Pagination: jest.fn()
}));

jest.mock("usermanagement/InfoBanner", () => ({
  InfoBanner: jest.fn()
}));

jest.mock("usermanagement/WfmUsersHeader", () => ({
  WfmUsersHeader: jest.fn()
}));

jest.mock("usermanagement/WfmUserTable", () => ({
  WfmUserTable: jest.fn()
}));

jest.mock("usermanagement/WfmErrorBanner", () => ({
  WfmErrorBanner: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn()
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
const businessUnitId = "123-321";
describe("WfmUsersViewWrapper", () => {
  const doRender = () => {
    const rendered =  render(<WfmUsersViewWrapper/>);
    expect(WfmUsersHeader).toHaveBeenCalledTimes(2);
    const setTableState = WfmUsersHeader.mock.calls[1][0].setTableState;
    act(() => setTableState({
      ...defaultTableState,
      businessUnitFilter: businessUnitId
    }));
    expect(WfmUsersHeader).toHaveBeenCalledTimes(4);
    const setStatus = WfmUsersHeader.mock.calls[3][0].setStatus;
    act(() => setStatus(ModalOverlayStatuses.SUCCESS));
    return rendered;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      WfmErrorBanner,
      WfmUsersHeader,
      Pagination,
      WfmUserTable,
      InfoBanner
    });
    useAdminState.mockReturnValue(initialTestState);
  });
  describe("initial render", () => {
    test("ManagementHeader, WfmUserTable, Pagination are rendered with expected props", () => {
      const expectedDefaultTableState = {
        tableState: {
          ...defaultTableState,
          businessUnitFilter: businessUnitId,
          searchResults: getWfmPeople(initialTestState).filter(p => p.BusinessUnitId === businessUnitId).sort(sortWfmWorkersByFullName),
          pagination: {
            ...defaultTableState.pagination,
            startingUserIndex: 0,
            length: 1,
            endingUserIndex: 24
          },
          filteredList: getWfmPeople(initialTestState).filter(p => p.BusinessUnitId === businessUnitId).sort(sortWfmWorkersByFullName)
        }
      };
      doRender();
      expectOnlyPassedProps(WfmUsersHeader, expectedDefaultTableState, getLastInstanceCalled(WfmUsersHeader));
      expect(WfmUserTable).toHaveBeenCalledTimes(1);
      expect(WfmErrorBanner).toHaveBeenCalledTimes(5);
      expectOnlyPassedProps(WfmUserTable, expectedDefaultTableState, getLastInstanceCalled(WfmUserTable));
      expect(Pagination).toHaveBeenCalledTimes(1);
      expectOnlyPassedProps(Pagination, expectedDefaultTableState, getLastInstanceCalled(Pagination));
    });
  });
  describe("searchBy === Faith", () => {
    test("filtered list only inlcudes expected options", async () => {
      doRender();
      const setWfmTable = WfmUserTable.mock.calls[0][0].setTableState;
      act(() => setWfmTable({
        ...defaultTableState,
        businessUnitFilter: "999-999",
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
          businessUnitFilter: businessUnitId,
          teamFilter: "111"
        }));
        expect(WfmUserTable.mock.calls.length).toBe(3);
        expect(WfmUserTable.mock.calls[2][0].tableState.filteredList).toStrictEqual([workersCopy[1]]);
      });
    });
    describe("team filter is selected with an unknown team", () => {
      test("filtered list only inlcudes expected options", () => {
        doRender();
        const setWfmTable = WfmUserTable.mock.calls[0][0].setTableState;
        act(() => setWfmTable({
          ...defaultTableState,
          businessUnitFilter: businessUnitId,
          teamFilter: "0099"
        }));
        expect(WfmUserTable.mock.calls.length).toBe(3);
        expect(WfmUserTable.mock.calls[2][0].tableState.filteredList).toStrictEqual([workersCopy[1]]);
      });
    });
    describe("team filter === no team", () => {
      test("filtered list only inlcudes expected options", () => {
        doRender();
        const setWfmTable = WfmUserTable.mock.calls[0][0].setTableState;
        act(() => setWfmTable({
          ...defaultTableState,
          businessUnitFilter: businessUnitId,
          teamFilter: "no-team"
        }));
        expect(WfmUserTable.mock.calls.length).toBe(3);
        expect(WfmUserTable.mock.calls[2][0].tableState.filteredList).toStrictEqual([]);
      });
    });
    describe("business Unit filter is selected", () => {
      test("filtered list only inlcudes expected options", () => {
        doRender();
        expect(WfmUserTable.mock.calls.length).toBe(1);
        expect(WfmUserTable.mock.calls[0][0].tableState.filteredList).toStrictEqual([workersCopy[1]]);
      });
    });
    describe("business Unit filter === People_Without_Team", () => {
      test("filtered list only inlcudes expected options", () => {
        doRender();
        const setWfmTable = WfmUserTable.mock.calls[0][0].setTableState;
        act(() => setWfmTable({
          ...defaultTableState,
          businessUnitFilter: "People_Without_Team"
        }));
        expect(WfmUserTable.mock.calls.length).toBe(3);
        expect(WfmUserTable.mock.calls[2][0].tableState.filteredList).toStrictEqual([workersCopy[0]]);
      });
    });
    describe("pagination is moved to page 2", () => {
      test("filtered list only inlcudes expected options", () => {
        doRender();
        const setWfmTable = Pagination.mock.calls[0][0].setTableState;
        act(() => setWfmTable({
          ...defaultTableState,
          businessUnitFilter: businessUnitId,
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