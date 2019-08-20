import ModalOverlay from "../ModalOverlay";
import React from "react";
import { render } from "testUtils";

describe("<ModalOverlay />", () => {
  test("with the wrong status being sent, we should fail to render.", () => {
    console.error = jest.fn();
    render(<ModalOverlay status="test" />);
    expect(console.error.mock.calls.length).toBe(1);
    expect(console.error.mock.calls[0][0]).
      toContain("Warning: Failed prop type: Invalid prop `status` of value `test` supplied to `ModalOverlay`, expected one of [\"saving\",\"success\",\"fail\"].");
  });
  test("with with a status of fail, we should notify the user correctly.", () => {
    const rendered = render(<ModalOverlay status="saving" />);
    expect(rendered).toBeTruthy();
    expect(rendered.getByText("Saving")).toBeInTheDocument();
  });
  test("with with a status of fail, we should notify the user correctly.", () => {
    const rendered = render(<ModalOverlay status="success" />);
    expect(rendered).toBeTruthy();
    expect(rendered.getByText("User Added Successfully")).toBeInTheDocument();
  });
  test("with with a status of fail, we should notify the user correctly.", () => {
    const rendered = render(<ModalOverlay status="fail" />);
    expect(rendered).toBeTruthy();
    expect(rendered.getByText("Failed To Add User")).toBeInTheDocument();
  });
});