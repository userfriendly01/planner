import React from "react";
import { CallFlowManagementSkills } from "../CallFlowManagementSkills";
import { getAuthenticationProfileTemplates } from "authentication/authenticationProfiles";
import { CallFlowConfirmationModal } from "callflowmanagement/CallFlowConfirmationModal";
import { ActionContainer } from "callflowmanagement/ActionContainer";
import { SkillsContainer } from "callflowmanagement/SkillsContainer";
import {
  useAdminState, useSkillState
} from "context/appContext";
import {
  mockSkills,
  render,
  getLastInstanceCalled,
  expectOnlyPassedProps,
  setupMockedComponents,
  initialTestState,
  authenticationProfileTemplates,
  mockTimeOfDays,
  mockApplications,
  mockTaskQueues,
  mockOperatingUnits,
  waitFor
} from "testUtils";
import { Modal } from "@mui/material";

jest.mock("authentication/authenticationProfiles", () => ({
  getAuthenticationProfileTemplates: jest.fn()
}));

jest.mock("callflowmanagement/CallFlowConfirmationModal", () => ({
  CallFlowConfirmationModal: jest.fn()
}));

jest.mock("callflowmanagement/ActionContainer", () => ({
  ActionContainer: jest.fn()
}));

jest.mock("callflowmanagement/SkillsContainer", () => ({
  SkillsContainer: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Modal: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useSkillState: jest.fn()
}));

const initialTableState = {
  closedFilter: false,
  filteredList: [mockSkills[2], mockSkills[3]],
  flashFilter: false,
  discrepancyFilter: false,
  profiles: [],
  searchBy: "",
  selected: []
};

const confirmationModalOpts = {
  open: false,
  exportButton: false,
  confirmationText: "",
  callbackMethods: {
    onConfirm: null,
    handleClose: null
  }
};

describe("CallFlowManagementSkills", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getAuthenticationProfileTemplates.mockReturnValue(authenticationProfileTemplates);
    useSkillState.mockReturnValue({
      skills: mockSkills,
      timeOfDays: mockTimeOfDays,
      applications: mockApplications,
      taskQueues: mockTaskQueues,
      operatingUnits: mockOperatingUnits
    });
    useAdminState.mockReturnValue({
      ...initialTestState,
      userContext: {
        ...initialTestState.userContext,
        isAdmin: true,
        profileId: 0
      }
    });
    setupMockedComponents({
      CallFlowConfirmationModal,
      Modal,
      ActionContainer,
      SkillsContainer
    });
  });
  describe("initial render", () => {
    beforeEach(() => {
      useAdminState.mockReturnValue(initialTestState);
    });
    test("initial form renders as expected - state is already loaded", () => {
      render(<CallFlowManagementSkills />);
      expectOnlyPassedProps(SkillsContainer, {
        tableState: initialTableState
      }, getLastInstanceCalled(SkillsContainer));
      expectOnlyPassedProps(ActionContainer, {
        confirmationModalOpts
      }, getLastInstanceCalled(ActionContainer));
      expectOnlyPassedProps(Modal, {
        open: false
      }, getLastInstanceCalled(Modal));
    });
    test("initial form renders as expected", () => {
      useSkillState.mockReturnValue({
        skills: [],
        timeOfDays: [],
        applications: [],
        taskQueues: [],
        operatingUnits: []
      });
      render(<CallFlowManagementSkills />);
    });
  });
  describe("setTableState is called", () => {
    describe("tablestate.profiles length > 0 - isAdmin", () => {
      test("initial form renders as expected", async () => {
        render(<CallFlowManagementSkills />);
        const setTableState = ActionContainer.mock.calls[0][0].setTableState;
        setTableState({
          ...initialTableState,
          profiles: [{ profile_id: 32 }]
        });
        await waitFor(() => expect(ActionContainer.mock.calls.length).toBe(4));
        expect(ActionContainer.mock.calls[3][0].tableState.filteredList).toStrictEqual([mockSkills[0]]);
      });
    });
    describe("tablestate.profiles length > 0", () => {
      test("initial form renders as expected", async () => {
        render(<CallFlowManagementSkills />);
        const setTableState = ActionContainer.mock.calls[0][0].setTableState;
        setTableState({
          ...initialTableState,
          profiles: [{ profile_id: 32 }]
        });
        await waitFor(() => expect(ActionContainer.mock.calls.length).toBe(4));
        expect(ActionContainer.mock.calls[3][0].tableState.filteredList).toStrictEqual([mockSkills[0]]);
      });
    });
    describe("tablestate.closedFilter === true", () => {
      test("initial form renders as expected", async () => {
        render(<CallFlowManagementSkills />);
        const setTableState = ActionContainer.mock.calls[0][0].setTableState;
        setTableState({
          ...initialTableState,
          closedFilter: true
        });
        await waitFor(() => expect(ActionContainer.mock.calls.length).toBe(4));
        expect(ActionContainer.mock.calls[3][0].tableState.filteredList).toStrictEqual([
          mockSkills[1],
          mockSkills[2]
        ]);
      });
    });
    describe("tablestate.flashFilter === true", () => {
      test("initial form renders as expected", async () => {
        render(<CallFlowManagementSkills />);
        const setTableState = ActionContainer.mock.calls[0][0].setTableState;
        setTableState({
          ...initialTableState,
          flashFilter: true
        });
        await waitFor(() => expect(ActionContainer.mock.calls.length).toBe(4));
        expect(ActionContainer.mock.calls[3][0].tableState.filteredList).toStrictEqual([
          mockSkills[2]
        ]);
      });
    });
    describe("tablestate.discrepancyFilter === true", () => {
      test("initial form renders as expected", async () => {
        render(<CallFlowManagementSkills />);
        const setTableState = ActionContainer.mock.calls[0][0].setTableState;
        setTableState({
          ...initialTableState,
          discrepancyFilter: true
        });
        await waitFor(() => expect(ActionContainer.mock.calls.length).toBe(4));
        expect(ActionContainer.mock.calls[3][0].tableState.filteredList).toStrictEqual([
          mockSkills[1]
        ]);
      });
    });
  });
  describe("confirmationModalOpts.open === true", () => {
    test("CallFlowConfirmationModal should be rendered", () => {
      render(<CallFlowManagementSkills />);
      const modalOpts = ActionContainer.mock.calls[0][0].confirmationModalOpts;
      const setModalOpts = ActionContainer.mock.calls[0][0].setConfirmationModalOpts;
      setModalOpts({
        ...modalOpts,
        open: true
      });
      render(Modal.mock.calls[2][0].children);
      expect(CallFlowConfirmationModal.mock.calls.length).toBe(1);
      expectOnlyPassedProps(CallFlowConfirmationModal, {
        confirmationModalOpts: {
          ...confirmationModalOpts,
          open: true
        },
        saveResult: {
          message: null,
          status: null
        }
      }, getLastInstanceCalled(CallFlowConfirmationModal));
    });
  });
});