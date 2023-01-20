import TritonUserManagementWrapper from "../TritonUsersViewWrapper";
import {
  TritonUsersHeader,
  Pagination,
  TritonUserTable
} from "components";
import { useAdminState } from "context";
import React from "react";
import {
  expectOnlyPassedProps,
  getLastInstanceCalled,
  initialTestState,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  TritonUsersHeader: jest.fn(),
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
      TritonUsersHeader,
      Pagination,
      TritonUserTable
    });
    useAdminState.mockReturnValue(initialTestState);
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
            length: 4,
            endingUserIndex: 25
          },
          filteredList: initialTestState.workerContext.workers
        }
      }, getLastInstanceCalled(TritonUsersHeader));
    });
  });
});