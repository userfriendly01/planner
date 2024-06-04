import React from "react";
import { CallFlowManagementSkills } from "../CallFlowManagementSkills";
import { getAuthenticationProfileTemplates } from "authentication/authenticationProfiles";
import { CallFlowConfirmationModal } from "callflowmanagement/CallFlowConfirmationModal";
import { ActionContainer } from "callflowmanagement/ActionContainer";
import { SkillsContainer } from "callflowmanagement/SkillsContainer";
import { useAdminState } from "context/appContext";
import {
  skillsList,
  render,
  getLastInstanceCalled,
  expectOnlyPassedProps,
  setupMockedComponents,
  initialTestState,
  act,
  authenticationProfileTemplates
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
  useAdminState: jest.fn()
}));

const initialTableState = {
  closedFilter: false,
  filteredList: [skillsList[2], skillsList[3]],
  flashFilter: false,
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
    test("initial form renders as expected", () => {
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
  });
  describe("setTableState is called", () => {
    describe("tablestate.profiles length > 0", () => {
      test("initial form renders as expected", () => {
        render(<CallFlowManagementSkills />);
        const setTableState = ActionContainer.mock.calls[0][0].setTableState;
        act(() => setTableState({
          ...initialTableState,
          profiles: [{ profile_id: 32 }]
        }));
        expect(ActionContainer.mock.calls[3][0].tableState.filteredList).toStrictEqual([initialTestState.skillContext.skills[0]]);
      });
    });
    describe("tablestate.closedFilter === true", () => {
      test("initial form renders as expected", () => {
        render(<CallFlowManagementSkills />);
        const setTableState = ActionContainer.mock.calls[0][0].setTableState;
        act(() => setTableState({
          ...initialTableState,
          closedFilter: true
        }));
        expect(ActionContainer.mock.calls[3][0].tableState.filteredList).toStrictEqual([
          initialTestState.skillContext.skills[1],
          initialTestState.skillContext.skills[2]
        ]);
      });
    });
    describe("tablestate.flashFilter === true", () => {
      test("initial form renders as expected", () => {
        render(<CallFlowManagementSkills />);
        const setTableState = ActionContainer.mock.calls[0][0].setTableState;
        act(() => setTableState({
          ...initialTableState,
          flashFilter: true
        }));
        expect(ActionContainer.mock.calls[3][0].tableState.filteredList).toStrictEqual([
          initialTestState.skillContext.skills[2]
        ]);
      });
    });
  });

  describe("confirmationModalOpts.open === true", () => {
    test("CallFlowConfirmationModal should be rendered", () => {
      render(<CallFlowManagementSkills />);
      const modalOpts = ActionContainer.mock.calls[0][0].confirmationModalOpts;
      const setModalOpts = ActionContainer.mock.calls[0][0].setConfirmationModalOpts;
      act(() => {
        setModalOpts({
          ...modalOpts,
          open: true
        });
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