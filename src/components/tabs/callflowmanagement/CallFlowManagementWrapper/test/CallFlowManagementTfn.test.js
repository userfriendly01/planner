import React from "react";
import { CallFlowManagementTfn } from "../CallFlowManagementTfn";
import { CallFlowConfirmationModal } from "callflowmanagement/CallFlowConfirmationModal/CallFlowConfirmationModal";
import { TfnActivation } from "callflowmanagement/TfnActivation/TfnActivation";
import {
  render,
  getLastInstanceCalled,
  expectOnlyPassedProps,
  setupMockedComponents,
  act
} from "testUtils";
import { Modal } from "@mui/material";

jest.mock("callflowmanagement/CallFlowConfirmationModal/CallFlowConfirmationModal", () => ({
  CallFlowConfirmationModal: jest.fn()
}));


jest.mock("callflowmanagement/TfnActivation/TfnActivation", () => ({
  TfnActivation: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Modal: jest.fn()
}));

const confirmationModalOpts = {
  open: false,
  exportButton: false,
  confirmationText: "",
  callbackMethods: {
    onConfirm: null,
    handleClose: null
  }
};

describe("CallFlowManagementTfn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      CallFlowConfirmationModal,
      Modal,
      TfnActivation
    });
  });
  describe("initial render", () => {
    test("initial form renders as expected", () => {
      render(<CallFlowManagementTfn />);
      expectOnlyPassedProps(TfnActivation, {
        confirmationModalOpts: confirmationModalOpts
      }, getLastInstanceCalled(TfnActivation));
      expectOnlyPassedProps(Modal, {
        open: false
      }, getLastInstanceCalled(Modal));
    });
  });
  describe("confirmationModalOpts.open === true", () => {
    test("CallFlowConfirmationModal should be rendered", () => {
      render(<CallFlowManagementTfn />);
      const modalOpts = TfnActivation.mock.calls[0][0].confirmationModalOpts;
      const setModalOpts = TfnActivation.mock.calls[0][0].setConfirmationModalOpts;
      act(() => {
        setModalOpts({
          ...modalOpts,
          open: true
        });
      });
      render(Modal.mock.calls[1][0].children);
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