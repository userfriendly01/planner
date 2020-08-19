import ModalPhoneNumber from "../ModalPhoneNumber";
import React from "react";
import {
  act,
  fireEvent,
  render
} from "testUtils";

const updateValue = jest.fn();

const id = "outgoing-id";
const label = "Outgoing Number";

const renderComponent = ({
  allowSevenDigitVdn,
  error,
  helperText,
  onBlur,
  showError
}) => {
  return render(
    <ModalPhoneNumber
      allowSevenDigitVdn={allowSevenDigitVdn}
      error={error}
      helperText={helperText}
      id={id}
      number={""}
      onBlur={onBlur}
      label={label}
      showError={showError}
      updateValue={updateValue}
    />
  );
};

describe("<ModalPhoneNumber />", () => {

  beforeEach(() => {
    updateValue.mockClear();
  });

  const changeNumberInput = (rendered, value) => {
    act(() => {
      fireEvent.change(rendered.getByLabelText(label), { target: { value }});
    });
  };

  test("the initial state should be just an empty text field, with the correct label", () => {
    const rendered = renderComponent({
      label: ""
    });
    expect(rendered.getByLabelText("Outgoing Number")).toBeTruthy();
  });

  describe("allowSevenDigitVdn is true", () => {
    const allowSevenDigitVdn = true;

    describe("component is set to 7 digit mode by clicking the toggle", () => {

      const clickToggle = rendered => {
        const toggleElement = rendered.getByTestId("toggle-seven-digit");
        // there is an inner span and then input element within that
        const toggleInputElement = toggleElement.children[0].children[0];
        // expect(toggleInputElement).toEqual({})
        act(() => {
          fireEvent.click(toggleInputElement);
        });
      };

      describe("updating input box values", () => {

        test("should fire updateValue with correct args for various values", () => {
          const rendered = renderComponent({
            allowSevenDigitVdn
          });
          // toggle to use 7 digit mask and validation logic
          clickToggle(rendered);
          // initially updateValue and reset the value to empty string (happens when toggle is switched)
          expect(updateValue.mock.calls[0]).toEqual(["", "", false]);
          // invalid partial number
          changeNumberInput(rendered, "603");
          expect(updateValue.mock.calls[1]).toEqual(["603 ", "603", false]);
          // invalid partial number
          changeNumberInput(rendered, "603456");
          expect(updateValue.mock.calls[2]).toEqual(["603 456", "603456", false]);
          // valid number (VDN)
          changeNumberInput(rendered, "6034567");
          expect(updateValue.mock.calls[3]).toEqual(["603 4567", "6034567", true]);
          // extra numbers omitted
          changeNumberInput(rendered, "6034567890123123123");
          expect(updateValue.mock.calls[4]).toEqual(["603 4567", "6034567", true]);
        });
      });
    });

    describe("component is set to 10 digit mode (by default)", () => {

      describe("updating input box values", () => {

        test("should fire updateValue with correct args for various values", () => {
          const rendered = renderComponent({});
          // invalid partial number
          changeNumberInput(rendered, "603");
          expect(updateValue.mock.calls[0]).toEqual(["(603) ", "603", false]);
          // invalid partial number
          changeNumberInput(rendered, "603456");
          expect(updateValue.mock.calls[1]).toEqual(["(603) 456", "603456", false]);
          // valid number
          changeNumberInput(rendered, "6034567890");
          expect(updateValue.mock.calls[2]).toEqual(["(603) 456-7890", "6034567890", true]);
          // extra numbers omitted
          changeNumberInput(rendered, "6034567890123123123");
          expect(updateValue.mock.calls[3]).toEqual(["(603) 456-7890", "6034567890", true]);
        });
      });
    });
  });
});