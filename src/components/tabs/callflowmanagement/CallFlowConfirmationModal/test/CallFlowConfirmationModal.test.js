import React from "react";
import { CallFlowConfirmationModal } from "../CallFlowConfirmationModal";
import { ModalOverlay } from "components/ModalOverlay";
import { PaperContainer } from "components/PaperContainer";
import { StyledButton } from "components/StyledButton";
import { ExportButton } from "callflowmanagement/ExportButton";
import { ModalOverlayStatuses } from "globals/interfaces";
import {
  act,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components/ModalOverlay", () => ({
  ModalOverlay: jest.fn()
}));

jest.mock("components/PaperContainer", () => ({
  PaperContainer: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("callflowmanagement/ExportButton", () => ({
  ExportButton: jest.fn()
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

const renderComponent = (saveResult, confirmationOpts) => {
  render(<CallFlowConfirmationModal
    saveResult={saveResult}
    confirmationModalOpts={confirmationOpts || confirmationModalOpts}
    tableState={tableState}/>);
  return render(PaperContainer.mock.calls[0][0].children);
};

describe("CallFlowConfirmationModal",() => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      PaperContainer,
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
      const rendered = renderComponent(saveResult);
      expect(rendered.container).toHaveTextContent(confirmationModalOpts.confirmationText);
      expect(ModalOverlay.mock.calls.length).toBe(0);
      expect(StyledButton.mock.calls.length).toBe(2);
      expect(StyledButton.mock.calls[0][0].onClick).toBe(mockHandleClose);
      expect(StyledButton.mock.calls[0][0].children).toBe("Cancel");
      expect(StyledButton.mock.calls[1][0].onClick).toBe(mockOnConfirm);
      expect(StyledButton.mock.calls[1][0].children).toBe("Confirm");
      expect(ExportButton.mock.calls.length).toBe(1);
    });
    describe("exportButton === false", () => {
      test("should not render export button", () => {
        renderComponent(saveResult, {
          ...confirmationModalOpts,
          exportButton: false
        });
        expect(ExportButton.mock.calls.length).toBe(0);
      });
    });
    describe("saveResult.status !== null", () => {
      const saveResult = {
        status: ModalOverlayStatuses.SAVING,
        message: "Hold your horses"
      };
      test("ModalOverlay is rendered", () => {
        renderComponent(saveResult);
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
      renderComponent(saveResult);
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
      renderComponent(saveResult);
      const confirmOnClick = StyledButton.mock.calls[1][0].onClick;
      act(() => {
        confirmOnClick();
      });
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });
  });
});