import { TritonUsersViewWrapper } from "../TritonUsersViewWrapper";
import { Pagination } from "components/Pagination";
import { TritonUsersHeader } from "usermanagement/TritonUsersHeader";
import { TritonUserTable } from "usermanagement/TritonUserTable";
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
import {
  sortWorkersByFullName
} from "utils/_sortUtils";
import { PageLoadSpinner } from "components/PageLoadSpinner";

jest.mock("components/Pagination", () => ({
  Pagination: jest.fn()
}));

jest.mock("usermanagement/TritonUsersHeader", () => ({
  TritonUsersHeader: jest.fn()
}));

jest.mock("usermanagement/TritonUserTable", () => ({
  TritonUserTable: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn()
}));

jest.mock("components/PageLoadSpinner", () => ({
  PageLoadSpinner: jest.fn()
}));

const defaultTableState = {
  searchBy: "",
  searchResults: initialTestState.workerContext.workers,
  selected: [],
  deltaFilter: false,
  pagination: {
    usersPerPage: 25,
    pageNumber: 1,
    length: 0,
    startingUserIndex: null,
    endingUserIndex: null
  },
  filteredList: []
};

const workersCopy = initialTestState.workerContext.workers.slice();

describe("TritonUsersViewWrapper", () => {
  const doRender = () => {
    return render(<TritonUsersViewWrapper/>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      TritonUsersHeader,
      Pagination,
      TritonUserTable,
      PageLoadSpinner
    });
    useAdminState.mockReturnValue({
      ...initialTestState,
      workerContext: {
        loadStatus: "success",
        workers: initialTestState.workerContext.workers.slice()
      }
    });
  });
  describe("initial render - loadStatus === success", () => {
    test.only("ManagementHeader, TritonUserTable, Pagination are rendered with expected props", () => {
      doRender();
      expect(TritonUsersHeader).toHaveBeenCalledTimes(2);
      expectOnlyPassedProps(TritonUsersHeader, {
        tableState: {
          ...defaultTableState,
          pagination: {
            ...defaultTableState.pagination,
            startingUserIndex: 0,
            length: 7,
            endingUserIndex: 24
          },
          filteredList: initialTestState.workerContext.workers.sort(sortWorkersByFullName)
        }
      }, getLastInstanceCalled(TritonUsersHeader));
      expect(TritonUserTable).toHaveBeenCalledTimes(2);
      expectOnlyPassedProps(TritonUserTable, {
        tableState: {
          ...defaultTableState,
          pagination: {
            ...defaultTableState.pagination,
            startingUserIndex: 0,
            length: 7,
            endingUserIndex: 24
          },
          filteredList: initialTestState.workerContext.workers.sort(sortWorkersByFullName)
        }
      }, getLastInstanceCalled(TritonUserTable));
      expect(Pagination).toHaveBeenCalledTimes(2);
      expectOnlyPassedProps(Pagination, {
        tableState: {
          ...defaultTableState,
          pagination: {
            ...defaultTableState.pagination,
            startingUserIndex: 0,
            length: 7,
            endingUserIndex: 24
          },
          filteredList: initialTestState.workerContext.workers.sort(sortWorkersByFullName)
        }
      }, getLastInstanceCalled(Pagination));
    });
  });
  describe("initial render - loadStatus === loading", () => {
    test("ManagementHeader, TritonUserTable, Pagination are rendered with expected props", () => {
      useAdminState.mockReturnValue({
        ...initialTestState,
        workerContext: {
          loadStatus: "loading",
          workers: initialTestState.workerContext.workers.slice()
        }
      });
      doRender();
      expect(PageLoadSpinner).toHaveBeenCalled();
    });
  });
  describe("initial render - loadStatus === loading", () => {
    test("ManagementHeader, TritonUserTable, Pagination are rendered with expected props", () => {
      useAdminState.mockReturnValue({
        ...initialTestState,
        workerContext: {
          loadStatus: "fail",
          workers: initialTestState.workerContext.workers.slice()
        }
      });
      const rendered = doRender();
      expect(rendered.container).toHaveTextContent("An error was thrown loading users, please refresh Triton to try again");
    });
  });
  describe("managerFilter === true", () => {
    test("filtered list only includes expected options", () => {
      const testState = {
        ...initialTestState,
        userManagementTableFilters: {
          managerFilter: "n0263786",
          profileFilterArray: [],
          ouFilterArray: []
        }
      };
      useAdminState.mockReturnValue(testState);
      doRender();
      expect(TritonUsersHeader.mock.calls.length).toBe(2);
      expect(TritonUsersHeader.mock.calls[1][0].tableState.filteredList).toStrictEqual([workersCopy[1]]);
    });
  });
  describe("profileFilterArray === true", () => {
    test("filtered list only inlcudes expected options", () => {
      const testState = {
        ...initialTestState,
        userManagementTableFilters: {
          managerFilter: null,
          profileFilterArray: [{
            label: "0 - profile0",
            value: "0"
          }],
          ouFilterArray: []
        }
      };
      useAdminState.mockReturnValue(testState);
      doRender();
      expect(TritonUsersHeader.mock.calls.length).toBe(2);
      expect(TritonUsersHeader.mock.calls[1][0].tableState.filteredList).toStrictEqual([workersCopy[3], workersCopy[4]]);
    });
  });

  describe("ouFilterArray === true", () => {
    test("filtered list only inlcudes expected options", () => {
      const testState = {
        ...initialTestState,
        userManagementTableFilters: {
          managerFilter: null,
          profileFilterArray: [],
          ouFilterArray: [{
            label: "operatingUnitName",
            value: "operatingUnitSid1"
          }]
        }
      };
      useAdminState.mockReturnValue(testState);
      doRender();
      expect(TritonUsersHeader.mock.calls.length).toBe(2);
      expect(TritonUsersHeader.mock.calls[1][0].tableState.filteredList).toStrictEqual([workersCopy[5]]);
    });
  });
  describe("searchBy === Faith", () => {
    test("filtered list only inlcudes expected options", () => {
      doRender();
      const setTritonTable = TritonUserTable.mock.calls[1][0].setTableState;
      act(() => setTritonTable({
        ...defaultTableState,
        searchBy: "FaiTh"
      }));
      expect(TritonUserTable.mock.calls.length).toBe(4);
      expect(TritonUserTable.mock.calls[3][0].tableState.filteredList).toStrictEqual([workersCopy[0]]);
    });
    describe("deltaFilter === true", () => {
      test("filtered list only inlcudes expected options", () => {
        doRender();
        const setTritonTable = TritonUserTable.mock.calls[1][0].setTableState;
        act(() => setTritonTable({
          ...defaultTableState,
          deltaFilter: true
        }));
        expect(TritonUserTable.mock.calls.length).toBe(4);
        expect(TritonUserTable.mock.calls[3][0].tableState.filteredList).toStrictEqual([workersCopy[0]]);
      });
    });
    describe("pagination is moved to page 2", () => {
      test("filtered list only inlcudes expected options", () => {
        doRender();
        const setTritonTable = Pagination.mock.calls[1][0].setTableState;
        act(() => setTritonTable({
          ...defaultTableState,
          pagination: {
            ...defaultTableState.pagination,
            pageNumber: 2
          }
        }));
        expect(Pagination.mock.calls.length).toBe(4);
        expect(Pagination.mock.calls[3][0].tableState.filteredList).toStrictEqual([]);
      });
    });
  });
});