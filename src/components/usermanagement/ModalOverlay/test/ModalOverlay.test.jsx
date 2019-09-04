import ModalOverlay from "../ModalOverlay";
import React from "react";
import { render } from "testUtils";

describe("<ModalOverlay />", () => {
  describe("status = 'saving'", () => {
    test("should display 'Loading'", () => {
      const rendered = render(<ModalOverlay status="saving" message="whatever" />);
      expect(rendered).toBeTruthy();
      expect(rendered.getByText("Loading")).toBeInTheDocument();
    });
  });
  describe("status = 'success'", () => {
    const successMessage = "something good";
    test("should display success message", () => {
      const rendered = render(<ModalOverlay status="success" message={successMessage} />);
      expect(rendered).toBeTruthy();
      expect(rendered.getByText(successMessage)).toBeInTheDocument();
    });
  });
  describe("status = 'fail'", () => {
    const failMessage = "oh nooooo";
    test("should display fail message", () => {
      const rendered = render(<ModalOverlay status="fail" message={failMessage} />);
      expect(rendered).toBeTruthy();
      expect(rendered.getByText(failMessage)).toBeInTheDocument();
    });
  });
  describe("status other than 'saving', 'success', or 'fail' is sent", () => {
    test("should log error message", () => {
      console.error = jest.fn();
      render(<ModalOverlay status="test" message="whatever" />);
      expect(console.error.mock.calls.length).toBe(1);
      expect(console.error.mock.calls[0][0]).
        toContain("Warning: Failed prop type: Invalid prop `status` of value `test` supplied to `ModalOverlay`, expected one of [\"saving\",\"success\",\"fail\"].");
    });
  });
});
