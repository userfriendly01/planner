import React from "react";
import UserManagementWrapper from "../UserManagementWrapper";
import { views } from "../UserManagement.Interfaces";
import {
  UserEntryForm,
  Dropdown,
  TritonUsersViewWrapper
} from "components";
import {
  useAdminState
} from "context";
import {
  act,
  setupMockedComponents,
  expectOnlyPassedProps,
  initialTestState,
  render
} from "testUtils";

jest.mock("components", () => ({
  UserEntryForm: jest.fn(),
  Dropdown: jest.fn(),
  BulkChanges: jest.fn(),
  TritonUsersViewWrapper: jest.fn()
}));

jest.mock("context", () => ({
  FormStateProvider: jest.requireActual("context").FormStateProvider,
  useAdminState: jest.fn()
}));

const defaultWorkerOpts = {
  worker: {},
  action: "add",
  routedFrom: views.TRITON_USERS,
  systems: {
    triton: true,
    calabrio_qm: true,
    calabrio_wfm: false
  }
};

describe("", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      UserEntryForm,
      Dropdown,
      TritonUsersViewWrapper
    });
  });
  describe("initial render", () => {
    test("should render as expected", () => {
      render(<UserManagementWrapper/>);
      expectOnlyPassedProps(Dropdown, {
        label: "What would you like to do?",
        options: Object.values(views),
        value: views.TRITON_USERS
      });
      expect(UserEntryForm).toHaveBeenCalledTimes(0);
      expect(TritonUsersViewWrapper).toHaveBeenCalledTimes(1);
      expectOnlyPassedProps(TritonUsersViewWrapper, {
        workerOpts: defaultWorkerOpts
      });
    });
  });
  describe("view === views.ONBOARD_NEW_USER", () => {
    test("should render UserEntryForm ", () => {
      render(<UserManagementWrapper/>);
      const updateValue = Dropdown.mock.calls[0][0].updateValue;
      act(() => updateValue(null, views.ONBOARD_NEW_USER));
      expect(UserEntryForm).toHaveBeenCalledTimes(1);
      expectOnlyPassedProps(UserEntryForm, {
        workerOpts: defaultWorkerOpts
      });
    });
  });
  describe("Edit view", () => {
    test("should render UserEntryForm ", () => {
      render(<UserManagementWrapper/>);
      const setWorkerOpts = TritonUsersViewWrapper.mock.calls[0][0].setWorkerOpts;
      act(() => setWorkerOpts({
        ...defaultWorkerOpts,
        action: "edit",
        systems: {
          triton: true,
          calabrio_qm: false,
          calabrio_wfm: false
        },
        worker: initialTestState.workerContext.workers[1]
      }));
      expect(UserEntryForm).toHaveBeenCalledTimes(1);
      expectOnlyPassedProps(UserEntryForm, {
        workerOpts: {
          ...defaultWorkerOpts,
          action: "edit",
          systems: {
            triton: true,
            calabrio_qm: false,
            calabrio_wfm: false
          },
          worker: initialTestState.workerContext.workers[1]
        }
      });
    });
  });
  describe("Close UserEntryForm", () => {
    test("should set view to routed from ", () => {
      render(<UserManagementWrapper/>);
      const setWorkerOpts = TritonUsersViewWrapper.mock.calls[0][0].setWorkerOpts;
      act(() => setWorkerOpts({
        ...defaultWorkerOpts,
        routedFrom: views.TRITON_USERS,
        action: "edit",
        worker: initialTestState.workerContext.workers[1]
      }));
      expect(UserEntryForm).toHaveBeenCalledTimes(1);
      const handleClose = UserEntryForm.mock.calls[0][0].handleClose;
      expect(TritonUsersViewWrapper).toHaveBeenCalledTimes(2);
      act(() => handleClose());
      expect(TritonUsersViewWrapper).toHaveBeenCalledTimes(3);
    });
  });
});