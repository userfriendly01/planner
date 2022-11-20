import TritonUserManagementWrapper from "../TritonUsersViewWrapper";
import {
  ManagementHeader,
  Pagination,
  TritonUserTable
} from "components";
import {
  initialState,
  useAdminState
} from "context";
import { workersPerPage } from "globals";
import React from "react";
import {
  act,
  expectMockedComponent,
  expectOnlyPassedProps,
  getLastInstanceCalled,
  getMockedComponentProps,
  initialTestState,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  ManagementHeader: jest.fn(),
  Pagination: jest.fn(),
  ManagementTable: jest.fn(),
  TritonUserTable: jest.fn(),
  ProfileSettingsContainer: jest.fn(),
  CallflowManagementWrapper: jest.fn(),
  AlohaFlowContainer: jest.fn(),
  AlohaRoutingContainer: jest.fn()
}));

jest.mock("context", () => ({
  initialState: jest.requireActual("context").initialState,
  useAdminState: jest.fn()
}));

const mockWorkerOpts = {
  worker: "opts"
};
const setWorkerOpts = jest.fn();

const defaultTableState = {
  searchBy: "",
  selected: [],
  managerFilter: null,
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

describe("TritonUserManagementWrapper", () => {
  const doRender = workerOpts => {
    return render(<TritonUserManagementWrapper
      workerOpts={workerOpts || mockWorkerOpts}
      setWorkerOpts={setWorkerOpts}
    />);
  };

  beforeEach(() => {
    setupMockedComponents({
      ManagementHeader,
      Pagination,
      TritonUserTable
    });
    useAdminState.mockReturnValue(initialTestState);
  });
  describe("initial render", () => {
    test("ManagementHeader, TritonUserTable, Pagination are rendered with expected props", () => {
      doRender();
      expect(ManagementHeader).toHaveBeenCalledTimes(2);
      expectOnlyPassedProps(ManagementHeader, {
        tableState: {
          ...defaultTableState,
          pagination: {
            ...defaultTableState.pagination,
            startingUserIndex: 0,
            length: 4,
            endingUserIndex: 25
          },
          filteredList: initialTestState.workerContext.workers
        }
      }, getLastInstanceCalled(ManagementHeader));
    });
  });
});