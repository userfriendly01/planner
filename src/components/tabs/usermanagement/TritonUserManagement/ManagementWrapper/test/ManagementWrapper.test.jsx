import ManagementWrapper from "../ManagementWrapper";
import {
  ManagementHeader,
  ManagementPagination,
  ManagementTable,
  UserEntryForm
} from "components";
import { initialState } from "context";
import { workersPerPage } from "globals";
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
  ManagementHeader: jest.fn(),
  ManagementPagination: jest.fn(),
  ManagementTable: jest.fn(),
  UserEntryForm: jest.fn(),
  ProfileSettingsContainer: jest.fn(),
  CallflowManagementWrapper: jest.fn(),
  AlohaFlowContainer: jest.fn(),
  AlohaRoutingContainer: jest.fn()
}));

const mockSkills=[
  {
    skill: "aisg145"
  },
  {
    skill: "Farm15"
  }
];

const getWorker = (number, managerNumber = 0, defaultSkills = [], skills = [], skillsDifferent = false, fullNameUndefined) => {
  const numberStr = `${number}`;
  const managerNumberStr = `${managerNumber}`;
  return {
    id: `n${numberStr.repeat(7)}`,
    sid: `WK${number}`,
    attributes: {
      default_skills: {
        skills: defaultSkills
      },
      full_name: fullNameUndefined ? undefined : numberStr,
      manager_n_number: `n${managerNumberStr.repeat(7)}`,
      routing: {
        skills
      }
    },
    skillsDifferent
  };
};

describe("ManagementWrapper", () => {

  const component = <ManagementWrapper />;

  const doRender = (workers = []) => {
    const state = { ...initialState };
    state.workerContext.workers = workers;
    state.skillContext.skills = mockSkills;
    return render(component, state);
  };

  beforeEach(() => {
    setupMockedComponents({
      ManagementHeader,
      ManagementPagination,
      ManagementTable,
      UserEntryForm
    });
  });

  const commonTests = workers => {
    test("should render ManagementHeader, ManagementPagination, ManagementTable", () => {
      const rendered = doRender(workers);
      expectMockedComponent(rendered, { ManagementHeader });
      expectMockedComponent(rendered, { ManagementPagination });
      expectMockedComponent(rendered, { ManagementTable });
    });
  };
  describe("6 workers. less than workersPerPage. some with undefined full_name", () => {
    const workers = [
      getWorker(0, 0, null, null, null, true),
      getWorker(5, 1),
      getWorker(3, 0, null, null, null, true),
      getWorker(3, 1, null, null, null, true),
      getWorker(4, 1),
      getWorker(1, 0)
    ];
    const sortedWorkers = [
      getWorker(1, 0),
      getWorker(4, 1),
      getWorker(5, 1),
      getWorker(0, 0, null, null, null, true),
      getWorker(3, 0, null, null, null, true),
      getWorker(3, 1, null, null, null, true)
    ];
    commonTests(workers);
    describe("initial state", () => {
      test("ManagementHeader should be passed filterBy show-all", () => {
        doRender(workers);
        expectOnlyPassedProps(ManagementHeader, { filterBy: "show-all" });
      });
      test("ManagementTable should be passed all workers (sorted with undefined full_name last) as prop", () => {
        doRender(workers);
        expectOnlyPassedProps(ManagementTable, {
          deltaToggle: false,
          workers: sortedWorkers
        });
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
  });
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
      test("ManagementHeader should be passed filterBy show-all", () => {
        doRender(workers);
        expectOnlyPassedProps(ManagementHeader, { filterBy: "show-all" });
      });
      test("ManagementTable should be passed all workers (sorted) as prop", () => {
        doRender(workers);
        expectOnlyPassedProps(ManagementTable, {
          deltaToggle: false,
          workers: sortedWorkers
        });
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
        const setStateFromFilterChange = ManagementHeader.mock.calls[0][0].setFilter;
        setStateFromFilterChange("n0000000");
      });
      test("ManagementHeader should be passed filterBy n0000000", () => {
        doRender(workers);
        doSetFilter();
        expectOnlyPassedProps(ManagementHeader, { filterBy: "n0000000" }, 1);
      });
      test("ManagementTable should be passed filtered workers having manager n0000000", () => {
        doRender(workers);
        doSetFilter();
        expectOnlyPassedProps(ManagementTable, {
          paginatedWorkers: [
            sortedWorkers[0],
            sortedWorkers[1],
            sortedWorkers[2]
          ],
          workers: sortedWorkers,
          skills: mockSkills
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
      getWorker("f", 1, ["466"], ["psu-L1"]),
      getWorker("g", 1, ["466"], ["psu-L1"], true),
      getWorker("h", 2, ["bsc"], ["test"]),
      getWorker("i", 2, ["bsc"], ["test"]),
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
      getWorker("aldo", 3),
      getWorker("z", 2),
      getWorker("q", 2),
      getWorker("r", 2),
      getWorker("s", 2),
      getWorker("t", 2),
      getWorker("u", 2)
    ];
    const sortedWorkers = [
      getWorker("aldo", 3),
      getWorker("b", 3),
      getWorker("c", 3),
      getWorker("d", 1),
      getWorker("e", 1),
      getWorker("f", 1, ["466"], ["psu-L1"]),
      getWorker("g", 1, ["466"], ["psu-L1"], true),
      getWorker("h", 2, ["bsc"], ["test"]),
      getWorker("i", 2, ["bsc"], ["test"]),
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
      test("ManagementHeader should be passed filterBy show-all", () => {
        doRender(workers);
        expectOnlyPassedProps(ManagementHeader, { filterBy: "show-all" });
      });
      test(`ManagementTable should be passed first ${workersPerPage} workers (sorted) as prop`, () => {
        doRender(workers);
        expectOnlyPassedProps(ManagementTable, {
          paginatedWorkers: sortedWorkers.slice(0, workersPerPage),
          workers: sortedWorkers,
          skills: mockSkills
        });
      });
      test(`ManagementPagination should be passed end = ${workersPerPage}, length = 26, page = 1, start = 1`, () => {
        doRender(workers);
        expectOnlyPassedProps(ManagementPagination, {
          end: workersPerPage,
          length: 26,
          page: 1,
          start: 1
        });
      });
    });
    describe("when set filter to manager n3333333", () => {
      const doSetFilter = () => act(() => {
        const setStateFromFilterChange = ManagementHeader.mock.calls[0][0].setFilter;
        setStateFromFilterChange("n3333333");
      });
      test("ManagementHeader should be passed filterBy n3333333", () => {
        doRender(workers);
        doSetFilter();
        expectOnlyPassedProps(ManagementHeader, { filterBy: "n3333333" }, 1);
      });
      test("ManagementTable should be passed filtered workers having manager n3333333", () => {
        doRender(workers);
        doSetFilter();
        expectOnlyPassedProps(ManagementTable, {
          paginatedWorkers: [
            sortedWorkers[0],
            sortedWorkers[1],
            sortedWorkers[2]
          ],
          workers: sortedWorkers,
          skills: mockSkills
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
        const setStateFromFilterChange = getMockedComponentProps(ManagementHeader, getLastInstanceCalled(ManagementHeader)).setFilter;
        setStateFromFilterChange("n2222222");
      });
      test("ManagementHeader should be passed filterBy n2222222", () => {
        doRender(workers);
        doSetFilter();
        expectOnlyPassedProps(ManagementHeader, { filterBy: "n2222222" }, 1);
      });
      test("ManagementTable should be passed filtered workers h -> v", () => {
        doRender(workers);
        doSetFilter();
        expectOnlyPassedProps(ManagementTable, {
          paginatedWorkers: [
            sortedWorkers[7],
            sortedWorkers[8],
            sortedWorkers[9],
            sortedWorkers[10],
            sortedWorkers[11],
            sortedWorkers[12],
            sortedWorkers[13],
            sortedWorkers[14],
            sortedWorkers[15],
            sortedWorkers[16],
            sortedWorkers[17],
            sortedWorkers[18],
            sortedWorkers[19],
            sortedWorkers[20],
            sortedWorkers[21]
          ],
          workers: sortedWorkers,
          skills: mockSkills
        }, 1);
      });
      test(`ManagementPagination should be passed end = ${workersPerPage}, length = 19, page = 1, start = 1`, () => {
        doRender(workers);
        doSetFilter();
        expectOnlyPassedProps(ManagementPagination, {
          end: workersPerPage,
          length: 19,
          page: 1,
          start: 1
        }, 1);
      });
    });
    describe("when set filter to manager 2 and then change page to 2", () => {
      const doSetFilterAndChangePage = () => {
        act(() => {
          const setStateFromFilterChange = getMockedComponentProps(ManagementHeader, getLastInstanceCalled(ManagementHeader)).setFilter;
          setStateFromFilterChange("n2222222");
        });
        act(() => {
          const setStateFromPageChange = getMockedComponentProps(ManagementPagination, getLastInstanceCalled(ManagementPagination)).setPage;
          setStateFromPageChange(2);
        });
      };
      test("ManagementHeader should be passed filterBy n2222222", () => {
        doRender(workers);
        doSetFilterAndChangePage();
        expectOnlyPassedProps(ManagementHeader, { filterBy: "n2222222" }, getLastInstanceCalled(ManagementHeader));
      });
      test("ManagementTable should be passed filtered workers w -> z", () => {
        doRender(workers);
        doSetFilterAndChangePage();
        expectOnlyPassedProps(ManagementTable, {
          paginatedWorkers: [
            sortedWorkers[22],
            sortedWorkers[23],
            sortedWorkers[24],
            sortedWorkers[25]
          ],
          workers: sortedWorkers,
          skills: mockSkills
        }, getLastInstanceCalled(ManagementTable));
      });
      test(`ManagementPagination should be passed end = 19, length = 19, page = 2, start = ${workersPerPage + 1}`, () => {
        doRender(workers);
        doSetFilterAndChangePage();
        expectOnlyPassedProps(ManagementPagination, {
          end: 19,
          length: 19,
          page: 2,
          start: workersPerPage + 1
        }, getLastInstanceCalled(ManagementPagination));
      });
    });
    describe("testing searching on default skills", () => {
      const doSetSearch = () => act(() => {
        const setStateFromSearchChange = ManagementHeader.mock.calls[0][0].setSearch;
        setStateFromSearchChange("466");
      });
      test("ManagementHeader should be passed searchBy '466'", () => {
        doRender(workers);
        doSetSearch();
        expectOnlyPassedProps(ManagementHeader, { searchBy: "466" }, 1);
      });
      test("ManagementTable should be passed filtered workers having the default skill 466", () => {
        doRender(workers);
        doSetSearch();
        expectOnlyPassedProps(ManagementTable, {
          paginatedWorkers: [
            sortedWorkers[5],
            sortedWorkers[6]
          ],
          workers: sortedWorkers,
          skills: mockSkills
        }, 1);
      });
      test("ManagementPagination should be passed end = 2, length = 2, page = 1, start = 1", () => {
        doRender(workers);
        doSetSearch();
        expectOnlyPassedProps(ManagementPagination, {
          end: 2,
          length: 2,
          page: 1,
          start: 1
        }, 1);
      });
    });
    describe("testing searching on applied skills", () => {
      const doSetSearch = () => act(() => {
        const setStateFromSearchChange = ManagementHeader.mock.calls[0][0].setSearch;
        setStateFromSearchChange("test");
      });
      test("ManagementHeader should be passed searchBy 'test'", () => {
        doRender(workers);
        doSetSearch();
        expectOnlyPassedProps(ManagementHeader, { searchBy: "test" }, 1);
      });
      test("ManagementTable should be passed filtered workers having the applied skill 'test'", () => {
        doRender(workers);
        doSetSearch();
        expectOnlyPassedProps(ManagementTable, {
          paginatedWorkers: [
            sortedWorkers[7],
            sortedWorkers[8]
          ],
          workers: sortedWorkers,
          skills: mockSkills
        }, 1);
      });
      test("ManagementPagination should be passed end = 2, length = 2, page = 1, start = 1", () => {
        doRender(workers);
        doSetSearch();
        expectOnlyPassedProps(ManagementPagination, {
          end: 2,
          length: 2,
          page: 1,
          start: 1
        }, 1);
      });
    });
    describe("testing searching on name", () => {
      const doSetSearch = () => act(() => {
        const setStateFromSearchChange = ManagementHeader.mock.calls[0][0].setSearch;
        setStateFromSearchChange("aldo");
      });
      test("ManagementHeader should be passed searchBy 'aldo'", () => {
        doRender(workers);
        doSetSearch();
        expectOnlyPassedProps(ManagementHeader, { searchBy: "aldo" }, 1);
      });
      test("ManagementTable should be passed filtered workers having the name 'aldo'", () => {
        doRender(workers);
        doSetSearch();
        expectOnlyPassedProps(ManagementTable, {
          paginatedWorkers: [
            sortedWorkers[0]
          ],
          workers: sortedWorkers,
          skills: mockSkills
        }, 1);
      });
      test("ManagementPagination should be passed end = 1, length = 1, page = 1, start = 1", () => {
        doRender(workers);
        doSetSearch();
        expectOnlyPassedProps(ManagementPagination, {
          end: 1,
          length: 1,
          page: 1,
          start: 1
        }, 1);
      });
    });
    describe("testing toggling on only different skills", () => {
      const doSetSearch = () => act(() => {
        const setStateFromSearchChange = ManagementTable.mock.calls[0][0].setDeltaToggle;
        setStateFromSearchChange(true);
      });
      test("ManagementTable should be passed deltaToggle 'true'", () => {
        doRender(workers);
        doSetSearch();
        expectOnlyPassedProps(ManagementTable, { deltaToggle: true }, 1);
      });
      test("ManagementTable should be passed filtered workers having current skills that differ from applied skills", () => {
        doRender(workers);
        doSetSearch();
        expectOnlyPassedProps(ManagementTable, {
          paginatedWorkers: [
            sortedWorkers[6]
          ],
          workers: sortedWorkers,
          skills: mockSkills
        }, 1);
      });
      test("ManagementPagination should be passed end = 1, length = 1, page = 1, start = 1", () => {
        doRender(workers);
        doSetSearch();
        expectOnlyPassedProps(ManagementPagination, {
          end: 1,
          length: 1,
          page: 1,
          start: 1
        }, 1);
      });
    });
  });
  describe("User Entry Form Modal", () => {
    test("form should not render on initial state", () => {
      const rendered = doRender([]);
      expectMockedComponent(rendered, { UserEntryForm }, 0);
    });
    test("userEntryForm is rendered when setUserEntryFormState is set to open === true", () => {
      const rendered = doRender([]);
      expectMockedComponent(rendered, { UserEntryForm }, 0);
      const setFormState = ManagementTable.mock.calls[0][0].setUserModalState;
      act(() => {
        setFormState({
          open: true,
          worker: null
        });
      });
      expectMockedComponent(rendered, { UserEntryForm }, 1);
    });
    test("When UserEntryForm handleClose is called, setUserEntryFormState is set to open === false", () => {
      const rendered = doRender([]);
      expectMockedComponent(rendered, { UserEntryForm }, 0);
      const setFormState = ManagementTable.mock.calls[0][0].setUserModalState;
      act(() => {
        setFormState({
          open: true,
          worker: null
        });
      });
      const handleClose = UserEntryForm.mock.calls[0][0].handleClose;
      act(() => {
        handleClose();
      });
      expectMockedComponent(rendered, { UserEntryForm }, 0);
    });
    test("When UserEntryForm handleClose is called with reopen, setUserEntryFormState is set to open === true", () => {
      const rendered = doRender([]);
      expectMockedComponent(rendered, { UserEntryForm }, 0);
      const setFormState = ManagementTable.mock.calls[0][0].setUserModalState;
      act(() => {
        setFormState({
          open: true,
          worker: null
        });
      });
      const handleClose = UserEntryForm.mock.calls[0][0].handleClose;
      act(() => {
        handleClose(true);
      });
      expectMockedComponent(rendered, { UserEntryForm }, 1);
    });
  });
});