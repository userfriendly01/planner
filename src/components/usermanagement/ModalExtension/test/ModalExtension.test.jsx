import ModalExtension from "../ModalExtension";
import React from "react";
import {
  fireEvent,
  render
} from "testUtils";

const mockFunction = jest.fn();

const renderComponent = (disabled, loading, extension) => {
  return render(<ModalExtension
    disabled={disabled}
    label="Extension"
    loading={loading}
    name="Extension"
    extension={extension}
    updateValue={mockFunction} />);
};

describe("<ModalExtension />", () => {
  beforeEach(() => {
    mockFunction.mockClear();
  });
  test("the initial state should be just an empty text field, with the correct label", () => {
    const rendered = renderComponent(false, false, "");
    expect(rendered.getByDisplayValue("")).toBeTruthy();
    expect(rendered.getByLabelText("Extension")).toBeTruthy();
    expect(rendered.queryAllByTestId("loading")).toHaveLength(0);
    expect(rendered.getByLabelText("Extension")).not.toHaveClass("Mui-disabled");
    expect(mockFunction.mock.calls.length).toBe(0);
  });
  test("when we update the value, we should fire the event being sent to the component", () => {
    const rendered = renderComponent(false, false, "N");
    expect(rendered.getByDisplayValue("N")).toBeTruthy();
    expect(rendered.getByLabelText("Extension")).toBeTruthy();
    fireEvent.change(rendered.getByLabelText("Extension"), { target: { value: "N1" }});
    expect(mockFunction.mock.calls.length).toBe(1);
    expect(mockFunction.mock.calls[0][0]).toBe("N1");
  });

  test("when we are doing a lookup on the field, we should validate that the spinner is showing", () => {
    const rendered = renderComponent(false, true, "1234");
    expect(rendered.queryAllByTestId("loading")).toHaveLength(1);
  });

  test("when disabled is true, the input should be disabled", () => {
    const rendered = renderComponent(true, false, "1234");
    expect(rendered.getByLabelText("Extension")).toHaveClass("Mui-disabled");
  });
});
