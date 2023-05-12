import TritonUserManagementWrapper from "../TritonUsersViewWrapper";
import {
  TritonUsersHeader,
  Pagination,
  TritonUserTable
} from "components";
import { useAdminState } from "context";
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
  sortWorkersByFullName,
  findOuFromProfile 
} from "utils";

jest.mock("components", () => ({
  TritonUsersHeader: jest.fn(),
  Pagination: jest.fn(),
  TritonUserTable: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

const defaultTableState = {
  searchBy: "",
  searchResults: initialTestState.workerContext.workers,
  selected: [],
  managerFilter: null,
  ouFilter: null,
  profileFilter: null,
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
const state = initialTestState;

describe("TritonUsersViewWrapper", () => {
  const doRender = () => {
    return render(<TritonUserManagementWrapper/>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      TritonUsersHeader,
      Pagination,
      TritonUserTable
    });
    useAdminState.mockReturnValue({
      ...initialTestState,
      workerContext: {
        workers: initialTestState.workerContext.workers.slice()
      }
    });
  });
  describe("initial render", () => {
    test("ManagementHeader, TritonUserTable, Pagination are rendered with expected props", () => {
      doRender();
      expect(TritonUsersHeader).toHaveBeenCalledTimes(2);
      expectOnlyPassedProps(TritonUsersHeader, {
        tableState: {
          ...defaultTableState,
          pagination: {
            ...defaultTableState.pagination,
            startingUserIndex: 0,
            length: 6,
            endingUserIndex: 25
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
            length: 6,
            endingUserIndex: 25
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
            length: 6,
            endingUserIndex: 25
          },
          filteredList: initialTestState.workerContext.workers.sort(sortWorkersByFullName)
        }
      }, getLastInstanceCalled(Pagination));
    });
  });
  describe("managerFilter === true", () => {
    test("filtered list only inlcudes expected options", () => {
      doRender();
      const setTritonTable = TritonUsersHeader.mock.calls[1][0].setTableState;
      act(() => setTritonTable({
        ...defaultTableState,
        managerFilter: "n0263786"
      }));
      expect(TritonUsersHeader.mock.calls.length).toBe(4);
      expect(TritonUsersHeader.mock.calls[3][0].tableState.filteredList).toStrictEqual([workersCopy[1]]);
    });
  });
  describe("profileFilter === true", () => {
    test("filtered list only inlcudes expected options", () => {
      doRender();
      const setTritonTable = TritonUsersHeader.mock.calls[1][0].setTableState;
      act(() => setTritonTable({
        ...defaultTableState,
        profileFilter: "0"
      }));
      expect(TritonUsersHeader.mock.calls.length).toBe(4);
      expect(TritonUsersHeader.mock.calls[3][0].tableState.filteredList).toStrictEqual([workersCopy[3], workersCopy[4]]);
    });
  });
  // TODO : FIX THIS OU FILTER TEST 
  // describe("ouFilter === true", () => {
  //   test("filtered list only inlcudes expected options", () => {
  //     doRender();
  //     const state = initialTestState;
  //     const setTritonTable = TritonUsersHeader.mock.calls[1][0].setTableState;
  //     act(() => setTritonTable({
  //       ...defaultTableState,
  //       ouFilter: "operatingUnitName"
  //     }));
  //     expect(TritonUsersHeader.mock.calls.length).toBe(4);
  //     expect(TritonUsersHeader.mock.calls[3][0]).toStrictEqual("what");
  //   });
  // });
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