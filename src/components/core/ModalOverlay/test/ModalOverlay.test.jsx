import ModalOverlay from "../ModalOverlay";
import { ModalOverlayStatuses } from "globals";
import React from "react";
import {
  fireEvent, render
} from "testUtils";

const mockHandleClose = jest.fn();

describe("<ModalOverlay />", () => {
  describe("status = 'saving'", () => {
    test("should display 'whatever'", () => {
      const rendered = render(<ModalOverlay status={ModalOverlayStatuses.SAVING} message="whatever" />);
      expect(rendered).toBeTruthy();
      expect(rendered.getByText("whatever")).toBeInTheDocument();
      expect(rendered.queryByTestId("close-button")).not.toBeInTheDocument();
    });
  });
  describe("status = 'success'", () => {
    const successMessage = "something good";
    test("should display success message", () => {
      const rendered = render(<ModalOverlay status={ModalOverlayStatuses.SUCCESS} message={successMessage} />);
      expect(rendered).toBeTruthy();
      expect(rendered.getByText(successMessage)).toBeInTheDocument();
      expect(rendered.queryByTestId("close-button")).not.toBeInTheDocument();
    });
  });
  describe("status = 'partial fail' && handleClose is passed", () => {
    const failMessage = "2nd place winner";
    test("should display partial fail message", () => {
      const rendered = render(<ModalOverlay status={ModalOverlayStatuses.PARTIAL_FAIL} message={failMessage} handleClose={jest.fn()}/>);
      expect(rendered).toBeTruthy();
      expect(rendered.getByText(failMessage)).toBeInTheDocument();
      expect(rendered.getByTestId("close-button")).toBeInTheDocument();
    });
  });
  describe("status = 'partial fail' && handleClose is not passed", () => {
    const failMessage = "2nd place winner";
    test("should display partial fail message", () => {
      const rendered = render(<ModalOverlay status={ModalOverlayStatuses.PARTIAL_FAIL} message={failMessage}/>);
      expect(rendered).toBeTruthy();
      expect(rendered.getByText(failMessage)).toBeInTheDocument();
      expect(rendered.queryByTestId("close-button")).not.toBeInTheDocument();
    });
  });
  describe("status = 'fail' && handleClose is passed", () => {
    const failMessage = "oh nooooo";
    test("should display fail message", () => {
      const rendered = render(<ModalOverlay status={ModalOverlayStatuses.FAIL} message={failMessage} handleClose={jest.fn()}/>);
      expect(rendered).toBeTruthy();
      expect(rendered.getByText(failMessage)).toBeInTheDocument();
      expect(rendered.getByTestId("close-button")).toBeInTheDocument();
    });
  });
  describe("status = 'fail' && handleClose is not passed", () => {
    const failMessage = "oh nooooo";
    test("should display fail message", () => {
      const rendered = render(<ModalOverlay status={ModalOverlayStatuses.FAIL} message={failMessage}/>);
      expect(rendered).toBeTruthy();
      expect(rendered.getByText(failMessage)).toBeInTheDocument();
      expect(rendered.queryByTestId("close-button")).not.toBeInTheDocument();
    });
  });
  describe("ModalOverlay is closed which close button is clicked", () => {
    const failMessage = "oh nooooo";
    test("should display fail message", () => {
      const rendered = render(<ModalOverlay
        status={ModalOverlayStatuses.FAIL}
        message={failMessage}
        handleClose={mockHandleClose}/>);
      const closeButton = rendered.getByTestId("close-button");
      fireEvent.click(closeButton);
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });
  });
});
