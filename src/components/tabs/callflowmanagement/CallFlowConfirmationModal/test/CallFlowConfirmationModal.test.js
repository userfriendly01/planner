import React from "react";
import CallFlowConfirmationModal from "../CallFlowConfirmationModal";
import {
  ModalOverlay,
  ExportButton,
  StyledButton
} from "components";
import { ModalOverlayStatuses } from "globals";
import {
  act,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  ExportButton: jest.fn(),
  ModalOverlay: jest.fn(),
  PaperContainer: jest.requireActual("components").PaperContainer,
  StyledButton: jest.fn()
}));

const mockOnConfirm = jest.fn();
const mockHandleClose = jest.fn();

const confirmationModalOpts = {
  open: true,
  exportButton: true,
  confirmationText: "You sure Bruh?",
  callbackMethods: {
    onConfirm: mockOnConfirm,
    handleClose: mockHandleClose
  }
};

const tableState = {
  selected: []
};

describe("CallFlowConfirmationModal",() => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      ExportButton,
      ModalOverlay,
      StyledButton
    });
  });
  describe("initial render", () => {
    const saveResult = {
      status: null,
      message: null
    };
    test("initial form renders as expected", () => {
      const rendered = render(<CallFlowConfirmationModal saveResult={saveResult} confirmationModalOpts={confirmationModalOpts} tableState={tableState}/>);
      expect(rendered.container).toHaveTextContent(confirmationModalOpts.confirmationText);
      expect(ModalOverlay.mock.calls.length).toBe(0);
      expect(StyledButton.mock.calls.length).toBe(2);
      expect(StyledButton.mock.calls[0][0].onClick).toBe(mockHandleClose);
      expect(StyledButton.mock.calls[0][0].children).toBe("Cancel");
      expect(StyledButton.mock.calls[1][0].onClick).toBe(mockOnConfirm);
      expect(StyledButton.mock.calls[1][0].children).toBe("Confirm");
      expect(ExportButton.mock.calls.length).toBe(1);
    });
    describe("saveResult.status !== null", () => {
      const saveResult = {
        status: ModalOverlayStatuses.SAVING,
        message: "Hold your horses"
      };
      test("ModalOverlay is rendered", () => {
        render(<CallFlowConfirmationModal saveResult={saveResult} confirmationModalOpts={confirmationModalOpts}  tableState={tableState}/>);
        expect(StyledButton.mock.calls.length).toBe(2);
        expect(ModalOverlay.mock.calls.length).toBe(1);
        expect(ModalOverlay.mock.calls[0][0]).toStrictEqual({
          message: saveResult.message,
          status: saveResult.status,
          handleClose: mockHandleClose
        });
      });
    });
  });
  describe("handleClose is called", () => {
    const saveResult = {
      status: null,
      message: null
    };
    test("mockHandleClose is called", () => {
      render(<CallFlowConfirmationModal saveResult={saveResult} confirmationModalOpts={confirmationModalOpts}  tableState={tableState}/>);
      const confirmhandleClose = StyledButton.mock.calls[0][0].onClick;
      act(() => {
        confirmhandleClose();
      });
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });
  });
  describe("onConfirm is called", () => {
    const saveResult = {
      status: null,
      message: null
    };
    test("mockOnConfirm is called", () => {
      render(<CallFlowConfirmationModal saveResult={saveResult} confirmationModalOpts={confirmationModalOpts}  tableState={tableState}/>);
      const confirmOnClick = StyledButton.mock.calls[1][0].onClick;
      act(() => {
        confirmOnClick();
      });
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });
  });
});