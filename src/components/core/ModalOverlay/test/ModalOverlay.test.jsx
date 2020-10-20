import ModalOverlay from "../ModalOverlay";
import { modalOverlayStatuses } from "globals";
import React from "react";
import { act } from "react-dom/test-utils";
import { fireEvent, render } from "testUtils";

const mockSetManagementTableState = jest.fn();

describe("<ModalOverlay />", () => {
  describe("status = 'saving'", () => {
    test("should display 'whatever'", () => {
      const rendered = render(<ModalOverlay status={modalOverlayStatuses.SAVING} message="whatever" />);
      expect(rendered).toBeTruthy();
      expect(rendered.getByText("whatever")).toBeInTheDocument();
    });
  });
  describe("status = 'success'", () => {
    const successMessage = "something good";
    test("should display success message", () => {
      const rendered = render(<ModalOverlay status={modalOverlayStatuses.SUCCESS} message={successMessage} />);
      expect(rendered).toBeTruthy();
      expect(rendered.getByText(successMessage)).toBeInTheDocument();
    });
  });
  describe("status = 'fail'", () => {
    const failMessage = "oh nooooo";
    test("should display fail message", () => {
      const rendered = render(<ModalOverlay status={modalOverlayStatuses.FAIL} message={failMessage} />);
      expect(rendered).toBeTruthy();
      expect(rendered.getByText(failMessage)).toBeInTheDocument();
    });
  });
  describe("ModalOverlay is closed which close button is clicked", () => {
    const failMessage = "oh nooooo";
    test("should display fail message", () => {
      const rendered = render(<ModalOverlay
        status={modalOverlayStatuses.FAIL}
        message={failMessage}
        setManagementTableState={mockSetManagementTableState}
        modal={true}/>);
      const closeButton = rendered.getByTestId("close-button");
      fireEvent.click(closeButton);
      expect(mockSetManagementTableState).toHaveBeenCalledTimes(1);
    });
  });
});
