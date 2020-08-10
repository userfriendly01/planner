import {
  StatusOverlay,
  modalOverlayStatuses
} from "../StatusOverlay";
import React from "react";
import { render } from "testUtils";

describe("<StatusOverlay />", () => {
  describe("status = 'saving'", () => {
    test("should display 'whatever'", () => {
      const rendered = render(<StatusOverlay status={modalOverlayStatuses.SAVING} message="whatever" />);
      expect(rendered).toBeTruthy();
      expect(rendered.getByText("whatever")).toBeInTheDocument();
    });
  });
  describe("status = 'success'", () => {
    const successMessage = "something good";
    test("should display success message", () => {
      const rendered = render(<StatusOverlay status={modalOverlayStatuses.SUCCESS} message={successMessage} />);
      expect(rendered).toBeTruthy();
      expect(rendered.getByText(successMessage)).toBeInTheDocument();
    });
  });
  describe("status = 'fail'", () => {
    const failMessage = "oh nooooo";
    test("should display fail message", () => {
      const rendered = render(<StatusOverlay status={modalOverlayStatuses.FAIL} message={failMessage} />);
      expect(rendered).toBeTruthy();
      expect(rendered.getByText(failMessage)).toBeInTheDocument();
    });
  });
});
