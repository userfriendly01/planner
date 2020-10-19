import ConfirmationModal from "../ConfirmationModal";
import {
  StatusOverlay,
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
  StatusOverlay: jest.fn(),
  PaperContainer: jest.fn()
}));

const mockHandleClose = jest.fn();
const mockHandleConfirm = jest.fn();

const renderComponent = () => {
  return render(<ConfirmationModal
    handleClose={mockHandleClose}
    confirmFunction={mockHandleConfirm} 
    confirmationText={"Are you sure?"} />);
};

describe("<ConfirmationModal />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      StyledButton,
      StatusOverlay
    });
    PaperContainer.mockImplementation(props => <div>{props.children}</div>);
  });

  describe("ConfirmationModal is in its initial state", () => {
    test("should pass confirmationText and confirm/functions", () => {
      const rendered = renderComponent();
      expect(rendered.container).toHaveTextContent("Are you sure?");
      expectMockedComponent(rendered, { StyledButton }, 2);
      expectMockedComponent(rendered, { StatusOverlay }, 0);
    });
  });

  describe("Confirm Button", () => {
    test("When the Confirm Button is clicked, handleConfirm is successful", done => {
      mockHandleConfirm.mockImplementation(() => { return Promise.resolve("Yay"); });
      const rendered = renderComponent();
      const confirm = StyledButton.mock.calls[0][0].onClick;
      act(() => {
        confirm();
        return Promise.resolve();
      }).then(() => {
        expectMockedComponent(rendered, { StatusOverlay }, 1);
        expectOnlyPassedProps(StatusOverlay, {
          message: "Operation Was Successful!",
          status: "success"
        });
        act(() => jest.runAllTimers());
        expect(mockHandleClose).toHaveBeenCalledTimes(1);
        done();
      });
      expectMockedComponent(rendered, { StatusOverlay }, 0);
    });
    test("When the Confirm Button is clicked, handleConfirm fails", done => {
      mockHandleConfirm.mockImplementation(() => { return Promise.reject("Aww"); });
      const rendered = renderComponent();
      const confirm = StyledButton.mock.calls[0][0].onClick;
      act(() => {
        confirm();
        return Promise.resolve();
      }).then(() => {
        expectMockedComponent(rendered, { StatusOverlay }, 1);
        expectOnlyPassedProps(StatusOverlay, {
          message: "Operation Failed.",
          status: "fail"
        });
        act(() => jest.runAllTimers());
        expect(mockHandleClose).toHaveBeenCalledTimes(1);
        done();
      });
      expectMockedComponent(rendered, { StatusOverlay }, 0);
    });
  });

  describe("Cancel Button", () => {
    test("When the Cancel Button is clicked, handleClose is run", () => {
      renderComponent();
      expectOnlyPassedProps(StyledButton, {
        onClick: mockHandleClose
      }, 1);
      const cancel = StyledButton.mock.calls[1][0].onClick;
      act(() => cancel())
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });
  });
});