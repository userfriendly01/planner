import ManagementWrapper from "../ManagementWrapper";
import {
  ManagementFilter,
  ManagementPagination,
  ManagementTable
} from "components";
import { initialState } from "context";
import React from "react";
import {
  act,
  expectMockedComponent,
  expectOnlyPassedProps,
  getLastInstanceCalled,
  getMockedComponentProps,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  ManagementFilter: jest.fn(),
  ManagementPagination: jest.fn(),
  ManagementTable: jest.fn()
}));

const getWorker = (number, managerNumber = 0) => {
  const numberStr = `${number}`;
  const managerNumberStr = `${managerNumber}`;
  return {
    id: `n${numberStr.repeat(7)}`,
    sid: `WK${number}`,
    attributes: {
      full_name: numberStr,
      manager_n_number: `n${managerNumberStr.repeat(7)}`
    }
  };
};

describe("ManagementWrapper", () => {

  const component = <ManagementWrapper />;

  const doRender = (workers = []) => {
    const state = { ...initialState };
    state.workerContext.workers = workers;
    return render(component, state);
  };

  beforeEach(() => {
    setupMockedComponents({
      ManagementFilter,
      ManagementPagination,
      ManagementTable
    });
  });

  const commonTests = workers => {
    test("should render ManagementFilter, ManagementPagination, ManagementTable", () => {
      const rendered = doRender(workers);
      expectMockedComponent(rendered, { ManagementFilter });
      expectMockedComponent(rendered, { ManagementPagination });
      expectMockedComponent(rendered, { ManagementTable });
    });
  };
  describe("6 workers. less than workersPerPage", () => {
    const workers = [
      getWorker(0, 0),
      getWorker(5, 1),
      getWorker(4, 1),
      getWorker(1, 0),
      getWorker(3, 0),
      getWorker(3, 1)
    ];
    const sortedWorkers = [
      getWorker(0, 0),
      getWorker(1, 0),
      getWorker(3, 0),
      getWorker(3, 1),
      getWorker(4, 1),
      getWorker(5, 1)
    ];
    commonTests(workers);
    describe("initial state", () => {
      test("ManagementFilter should be passed filterBy show-all", () => {
        doRender(workers);
        expectOnlyPassedProps(ManagementFilter, { filterBy: "show-all" });
      });
      test("ManagementTable should be passed all workers (sorted) as prop", () => {
        doRender(workers);
        expectOnlyPassedProps(ManagementTable, { workers: sortedWorkers });
      });
      test("ManagementPagination should be passed end = 6, length = 6, page = 1, start = 1", () => {
        doRender(workers);
        expectOnlyPassedProps(ManagementPagination, {
          end: 6,
          length: 6,
          page: 1,
          start: 1
        });
      });
    });
    describe("when set filter to manager n0000000", () => {
      const doSetFilter = () => act(() => {
        const setStateFromFilterChange = ManagementFilter.mock.calls[0][0].setFilter;
        setStateFromFilterChange("n0000000");
      });
      test("ManagementFilter should be passed filterBy n0000000", () => {
        doRender(workers);
        doSetFilter();
        expectOnlyPassedProps(ManagementFilter, { filterBy: "n0000000" }, 1);
      });
      test("ManagementTable should be passed filtered workers having manager n0000000", () => {
        doRender(workers);
        doSetFilter();
        expectOnlyPassedProps(ManagementTable, {
          workers: [
            sortedWorkers[0],
            sortedWorkers[1],
            sortedWorkers[2]
          ]
        }, 1);
      });
      test("ManagementPagination should be passed end = 3, length = 3, page = 1, start = 1", () => {
        doRender(workers);
        doSetFilter();
        expectOnlyPassedProps(ManagementPagination, {
          end: 3,
          length: 3,
          page: 1,
          start: 1
        }, 1);
      });
    });
  });
  describe("26 workers. more than workersPerPage", () => {
    const workers = [
      getWorker("f", 1),
      getWorker("g", 1),
      getWorker("h", 2),
      getWorker("i", 2),
      getWorker("c", 3),
      getWorker("d", 1),
      getWorker("e", 1),
      getWorker("l", 2),
      getWorker("m", 2),
      getWorker("b", 3),
      getWorker("p", 2),
      getWorker("v", 2),
      getWorker("w", 2),
      getWorker("x", 2),
      getWorker("y", 2),
      getWorker("n", 2),
      getWorker("o", 2),
      getWorker("j", 2),
      getWorker("k", 2),
      getWorker("a", 3),
      getWorker("z", 2),
      getWorker("q", 2),
      getWorker("r", 2),
      getWorker("s", 2),
      getWorker("t", 2),
      getWorker("u", 2)
    ];
    const sortedWorkers = [
      getWorker("a", 3),
      getWorker("b", 3),
      getWorker("c", 3),
      getWorker("d", 1),
      getWorker("e", 1),
      getWorker("f", 1),
      getWorker("g", 1),
      getWorker("h", 2),
      getWorker("i", 2),
      getWorker("j", 2),
      getWorker("k", 2),
      getWorker("l", 2),
      getWorker("m", 2),
      getWorker("n", 2),
      getWorker("o", 2),
      getWorker("p", 2),
      getWorker("q", 2),
      getWorker("r", 2),
      getWorker("s", 2),
      getWorker("t", 2),
      getWorker("u", 2),
      getWorker("v", 2),
      getWorker("w", 2),
      getWorker("x", 2),
      getWorker("y", 2),
      getWorker("z", 2)
    ];
    commonTests(workers);
    describe("initial state", () => {
      test("ManagementFilter should be passed filterBy show-all", () => {
        doRender(workers);
        expectOnlyPassedProps(ManagementFilter, { filterBy: "show-all" });
      });
      test("ManagementTable should be passed first 10 workers (sorted) as prop", () => {
        doRender(workers);
        expectOnlyPassedProps(ManagementTable, { workers: sortedWorkers.slice(0, 10) });
      });
      test("ManagementPagination should be passed end = 10, length = 26, page = 1, start = 1", () => {
        doRender(workers);
        expectOnlyPassedProps(ManagementPagination, {
          end: 10,
          length: 26,
          page: 1,
          start: 1
        });
      });
    });
    describe("when set filter to manager n3333333", () => {
      const doSetFilter = () => act(() => {
        const setStateFromFilterChange = ManagementFilter.mock.calls[0][0].setFilter;
        setStateFromFilterChange("n3333333");
      });
      test("ManagementFilter should be passed filterBy n3333333", () => {
        doRender(workers);
        doSetFilter();
        expectOnlyPassedProps(ManagementFilter, { filterBy: "n3333333" }, 1);
      });
      test("ManagementTable should be passed filtered workers having manager n3333333", () => {
        doRender(workers);
        doSetFilter();
        expectOnlyPassedProps(ManagementTable, {
          workers: [
            sortedWorkers[0],
            sortedWorkers[1],
            sortedWorkers[2]
          ]
        }, 1);
      });
      test("ManagementPagination should be passed end = 3, length = 3, page = 1, start = 1", () => {
        doRender(workers);
        doSetFilter();
        expectOnlyPassedProps(ManagementPagination, {
          end: 3,
          length: 3,
          page: 1,
          start: 1
        }, 1);
      });
    });
    describe("when set filter to manager n2222222", () => {
      const doSetFilter = () => act(() => {
        const setStateFromFilterChange = getMockedComponentProps(ManagementFilter, getLastInstanceCalled(ManagementFilter)).setFilter;
        setStateFromFilterChange("n2222222");
      });
      test("ManagementFilter should be passed filterBy n2222222", () => {
        doRender(workers);
        doSetFilter();
        expectOnlyPassedProps(ManagementFilter, { filterBy: "n2222222" }, 1);
      });
      test("ManagementTable should be passed filtered workers h -> q", () => {
        doRender(workers);
        doSetFilter();
        expectOnlyPassedProps(ManagementTable, {
          workers: [
            sortedWorkers[7],
            sortedWorkers[8],
            sortedWorkers[9],
            sortedWorkers[10],
            sortedWorkers[11],
            sortedWorkers[12],
            sortedWorkers[13],
            sortedWorkers[14],
            sortedWorkers[15],
            sortedWorkers[16]
          ]
        }, 1);
      });
      test("ManagementPagination should be passed end = 10, length = 19, page = 1, start = 1", () => {
        doRender(workers);
        doSetFilter();
        expectOnlyPassedProps(ManagementPagination, {
          end: 10,
          length: 19,
          page: 1,
          start: 1
        }, 1);
      });
    });
    describe("when set filter to manager 2 and then change page to 2", () => {
      const doSetFilterAndChangePage = () => {
        act(() => {
          const setStateFromFilterChange = getMockedComponentProps(ManagementFilter, getLastInstanceCalled(ManagementFilter)).setFilter;
          setStateFromFilterChange("n2222222");
        });
        act(() => {
          const setStateFromPageChange = getMockedComponentProps(ManagementPagination, getLastInstanceCalled(ManagementPagination)).setPage;
          setStateFromPageChange(2);
        });
      };
      test("ManagementFilter should be passed filterBy n2222222", () => {
        doRender(workers);
        doSetFilterAndChangePage();
        expectOnlyPassedProps(ManagementFilter, { filterBy: "n2222222" }, getLastInstanceCalled(ManagementFilter));
      });
      test("ManagementTable should be passed filtered workers r -> z", () => {
        doRender(workers);
        doSetFilterAndChangePage();
        expectOnlyPassedProps(ManagementTable, {
          workers: [
            sortedWorkers[17],
            sortedWorkers[18],
            sortedWorkers[19],
            sortedWorkers[20],
            sortedWorkers[21],
            sortedWorkers[22],
            sortedWorkers[23],
            sortedWorkers[24],
            sortedWorkers[25]
          ]
        }, getLastInstanceCalled(ManagementTable));
      });
      test("ManagementPagination should be passed end = 19, length = 19, page = 2, start = 11", () => {
        doRender(workers);
        doSetFilterAndChangePage();
        expectOnlyPassedProps(ManagementPagination, {
          end: 19,
          length: 19,
          page: 2,
          start: 11
        }, getLastInstanceCalled(ManagementPagination));
      });
    });
  });
});