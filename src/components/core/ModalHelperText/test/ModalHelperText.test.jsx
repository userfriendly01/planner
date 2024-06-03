import { ModalHelperText } from "../ModalHelperText";
import React from "react";
import {
  fireEvent,
  render
} from "testUtils";

const mockFunction = jest.fn();

describe("<ModalHelperText />", () => {
  beforeEach(() => {
    mockFunction.mockClear();
  });
  test("if there is no error, should display message in green and clear button", () => {
    const message = "found a user or whatever";
    const rendered = render(<ModalHelperText clearFunction={mockFunction} message={message} error={null}
    />);
    expect(rendered.container).toHaveTextContent(message);
    expect(rendered.getByTestId("helper-text-section")).toHaveStyle({ color: "green" });
  });
  test("when the clear button is clicked, should fire whatever function was sent in.", () => {
    const rendered = render(<ModalHelperText clearFunction={mockFunction} message={"whatever"} error={null} />);
    fireEvent.click(rendered.getByText("X", { selector: "button" }));
    expect(mockFunction.mock.calls.length).toBe(1);
  });
  test("if there is an error, should display message in red", () => {
    const rendered = render(<ModalHelperText clearFunction={mockFunction} message={"user not found or whatever"} error={"Bad News Bears"} />);
    expect(rendered.getByTestId("helper-text-section")).toHaveStyle({ color: "red" });
  });
});
