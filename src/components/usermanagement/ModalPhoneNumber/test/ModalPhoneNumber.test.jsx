import ModalPhoneNumber from "../ModalPhoneNumber";
import React from "react";
import {
  fireEvent,
  render
} from "testUtils";

const mockFunction = jest.fn();

const renderComponent = outgoing => {
  return render(<ModalPhoneNumber outgoingNumber={outgoing} updateValue={mockFunction} />);
};

describe("<ModalPhoneNumber />", () => {

  beforeEach(() => {
    mockFunction.mockClear();
  });

  test("the initial state should be just an empty text field, with the correct label", () => {
    const rendered = renderComponent("");
    expect(rendered.getByLabelText("Outgoing Number*")).toBeTruthy();
  });

  test("when we update the value, we should fire the event being sent to the component", () => {
    const rendered = renderComponent("");
    expect(rendered.getByLabelText("Outgoing Number*")).toBeTruthy();
    fireEvent.change(rendered.getByLabelText("Outgoing Number*"), { target: { value: "123" }});
    expect(mockFunction.mock.calls.length).toBe(1);
  });

  describe("when we update the value, the value should be masked correctly", () => {
    test("the first few numbers should be wrapped in '()' with a space", () => {
      const rendered = renderComponent("");
      fireEvent.change(rendered.getByLabelText("Outgoing Number*"), { target: { value: "123" }});
      expect(mockFunction.mock.calls[0][0]).toBe("(123) ");
    });
    test("followed by the next 3 digits and a dash", () => {
      const rendered = renderComponent("");
      fireEvent.change(rendered.getByLabelText("Outgoing Number*"), { target: { value: "123456" }});
      expect(mockFunction.mock.calls[0][0]).toBe("(123) 456-");
    });
    test("and finally the last 4 digits", () => {
      const rendered = renderComponent("");
      fireEvent.change(rendered.getByLabelText("Outgoing Number*"), { target: { value: "1234567890" }});
      expect(mockFunction.mock.calls[0][0]).toBe("(123) 456-7890");
    });
    test("any additional digits should not be allowed", () => {
      const rendered = renderComponent("");
      fireEvent.change(rendered.getByLabelText("Outgoing Number*"), { target: { value: "1234567890123465" }});
      expect(mockFunction.mock.calls[0][0]).toBe("(123) 456-7890");
    });
  });
});