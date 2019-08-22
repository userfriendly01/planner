import ModalHelperText from "../ModalHelperText";
import React from "react";
import {
  fireEvent,
  render
} from "testUtils";

const mockFunction = jest.fn();
const mockInfo = {
  firstName: "John",
  lastName: "Wick"
};

describe("<ModalHelperText />", () => {

  beforeEach(() => {
    mockFunction.mockClear();
  });

  test("if there is no lookup object or error, we should render null", () => {
    const rendered = render(<ModalHelperText clearUser={mockFunction} lookupInfo={{}} />);
    expect(rendered.container).toBeEmpty();
  });

  test("if we have user information, we should display it, as well as a clear button.", () => {
    const rendered = render(<ModalHelperText clearUser={mockFunction} error={""} lookupInfo={mockInfo} />);
    expect(rendered.getByText("John Wick")).toBeInTheDocument();
    expect(rendered.getByText("X", { selector: "button" })).toBeInTheDocument();
  });

  test("if we have click that button, we should fire whatever function was sent in.", () => {
    const rendered = render(<ModalHelperText clearUser={mockFunction} error={""} lookupInfo={mockInfo} />);
    fireEvent.click(rendered.getByText("X", { selector: "button" }));
    expect(mockFunction.mock.calls.length).toBe(1);
  });

  test("if we have an error, we should display that.", () => {
    const rendered = render(<ModalHelperText clearUser={mockFunction} error={"Bad news bears."} lookupInfo={{}} />);
    expect(rendered.getByText("Bad news bears.")).toBeInTheDocument();
  });
});