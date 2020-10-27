import ConfirmationModal from "../ConfirmationModal";
import {
  ModalOverlay,
  PaperContainer,
  StyledButton
} from "components";
import React from "react";
import { act } from "react-dom/test-utils";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  render,
  setupMockedComponents
} from "testUtils";

jest.useFakeTimers();

jest.mock("components", () => ({
  __esModule: true,
  StyledButton: jest.fn(),
  ModalOverlay: jest.fn(),
  PaperContainer: jest.fn()
}));

const mockHandleClose = jest.fn();
const mockHandleConfirm = jest.fn();
const initialSaveResult = {
  status: null,
  message: null
};

const body = {
  confirmationText: "Are you sure?",
  data: "Peter Griffin"
};

const renderComponent = () => {
  return render(<ConfirmationModal
    handleClose={mockHandleClose}
    onConfirm={mockHandleConfirm}
    body={body}
    saveResult={initialSaveResult} />);
};

describe("<ConfirmationModal />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      StyledButton,
      ModalOverlay
    });
    PaperContainer.mockImplementation(props => <div>{props.children}</div>);
  });

  describe("ConfirmationModal is in its initial state", () => {
    test("should pass confirmationText and confirm/cancel functions, and the save result", () => {
      const rendered = renderComponent();
      expect(rendered.container).toHaveTextContent("Are you sure?");
      expect(rendered.container).toHaveTextContent("Peter Griffin");
      expectMockedComponent(rendered, { StyledButton }, 2);
      expectMockedComponent(rendered, { ModalOverlay }, 0);
    });
  });
  describe("Confirm Button", () => {
    test("When the Confirm Button is clicked, handleConfirm fails", () => {
      renderComponent();
      expectOnlyPassedProps(StyledButton, {
        onClick: mockHandleConfirm
      }, 0);
      const confirm = StyledButton.mock.calls[0][0].onClick;
      act(() => confirm());
      expect(mockHandleConfirm).toHaveBeenCalledTimes(1);
    });
  });
  describe("Cancel Button", () => {
    test("When the Cancel Button is clicked, handleClose is run", () => {
      renderComponent();
      expectOnlyPassedProps(StyledButton, {
        onClick: mockHandleClose
      }, 1);
      const cancel = StyledButton.mock.calls[1][0].onClick;
      act(() => cancel());
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });
  });
  describe("When the Save Result is not null, ModalOverlay is present", () => {
    const renderComponent = saveResult => {
      return render(<ConfirmationModal
        handleClose={mockHandleClose}
        onConfirm={mockHandleConfirm}
        body={body}
        saveResult={saveResult} />);
    };
    test("When the Save Result is successful, the ModalOverlay is passed the correct props, handleClose is run", () => {
      const rendered = renderComponent({
        status: "success",
        message: "yay!"
      });
      expectMockedComponent(rendered, { ModalOverlay }, 1);
      expectOnlyPassedProps(ModalOverlay, {
        handleClose: mockHandleClose,
        status: "success",
        message: "yay!"
      }, 0);
    });
    test("When the Save Result is fail, the ModalOverlay is passed the correct props, handleClose is run", () => {
      const rendered = renderComponent({
        status: "fail",
        message: "boo!"
      });
      expectMockedComponent(rendered, { ModalOverlay }, 1);
      expectOnlyPassedProps(ModalOverlay, {
        handleClose: mockHandleClose,
        status: "fail",
        message: "boo!"
      }, 0);
    });
  });
});