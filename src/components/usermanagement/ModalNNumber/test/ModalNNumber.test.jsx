import ModalNNumber from "../ModalNNumber";
import React from "react";
import {
  fireEvent,
  render
} from "testUtils";

const mockFunction = jest.fn();

const renderComponent = (disabled, loading, nNumber) => {
  return render(<ModalNNumber
    disabled={disabled}
    label="N Number"
    loading={loading}
    name="N Number"
    nNumber={nNumber}
    updateValue={mockFunction} />);
};

describe("<ModalNNumber />", () => {
  beforeEach(() => {
    mockFunction.mockClear();
  });
  test("the initial state should be just an empty text field, with the correct label", () => {
    const rendered = renderComponent(false, false, "");
    expect(rendered.getByDisplayValue("")).toBeTruthy();
    expect(rendered.getByLabelText("N Number")).toBeTruthy();
    expect(rendered.queryAllByTestId("loading")).toHaveLength(0);
    expect(rendered.getByLabelText("N Number")).not.toHaveClass("Mui-disabled");
    expect(mockFunction.mock.calls.length).toBe(0);
  });
  test("when we update the value, we should fire the event being sent to the component", () => {
    const rendered = renderComponent(false, false, "N");
    expect(rendered.getByDisplayValue("N")).toBeTruthy();
    expect(rendered.getByLabelText("N Number")).toBeTruthy();
    fireEvent.change(rendered.getByLabelText("N Number"), { target: { value: "N1" }});
    expect(mockFunction.mock.calls.length).toBe(1);
    expect(mockFunction.mock.calls[0][0]).toBe("N1");
  });

  test("when we are doing a lookup on the field, we should validate that the spinner is showing", () => {
    const rendered = renderComponent(false, true, "N1234567");
    expect(rendered.queryAllByTestId("loading")).toHaveLength(1);
  });

  test("when disabled is true, the input should be disabled", () => {
    const rendered = renderComponent(true, false, "N1234567");
    expect(rendered.getByLabelText("N Number")).toHaveClass("Mui-disabled");
  });
});
