import ModalNNumber from "../ModalNNumber";
import {
  CustomInput,
  ModalHelperText
} from "components";
import React from "react";
import { fetchUser } from "services";
import {
  act,
  expectMockedComponent,
  expectOnlyPassedProps,
  getMockedComponentProps,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  CustomInput: jest.fn(),
  ModalHelperText: jest.fn()
}));

jest.mock("services", () => ({
  __esModule: true,
  fetchUser: jest.fn()
}));

const mockOnClear = jest.fn();
const mockOnComplete = jest.fn();
const mockOnBlur = jest.fn();
const mockOnUpdate = jest.fn();

const label = "N Number Thing";

const renderComponent = (value, disabled) => {
  return render(<ModalNNumber
    disabled={disabled}
    label={label}
    onBlur={mockOnBlur}
    onClear={mockOnClear}
    onComplete={mockOnComplete}
    onUpdate={mockOnUpdate}
    value={value}
  />);
};

describe("<ModalNNumber />", () => {
  beforeEach(() => {
    setupMockedComponents({
      CustomInput,
      ModalHelperText
    });
    jest.clearAllMocks();
  });

  test("initial state does not show modalHelperText", () => {
    const value = "n0";
    const rendered = renderComponent(value);
    expectMockedComponent(rendered, { ModalHelperText }, 0);
  });

  test("CustomInput onBlur calls onBlur prop", () => {
    const value = "n0";
    renderComponent(value);
    act(() => getMockedComponentProps(CustomInput).onBlur());
    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });

  test("CustomInput updateValue calls onUpdate prop", () => {
    const value = "n0";
    renderComponent(value);
    const newValue = "n02";
    act(() => getMockedComponentProps(CustomInput).updateValue(newValue));
    expect(mockOnUpdate).toHaveBeenCalledWith(newValue);
  });

  describe("CustomInput validatedServiceCall", () => {

    describe("fetchUser succeeds", () => {

      const newNNumber = "n0266666";
      const fetchedUser = {
        firstName: "Bobby",
        lastName: "Orr"
      };
      beforeEach(() => fetchUser.mockResolvedValue(fetchedUser));

      test("should fire onComplete and render helper text", async () => {
        const rendered = renderComponent();
        act(() => getMockedComponentProps(CustomInput).validatedServiceCall(newNNumber));
        await waitFor(() => {
          expect(mockOnComplete).toHaveBeenCalledWith(fetchedUser, newNNumber);
          expectMockedComponent(rendered, { ModalHelperText });
          expectOnlyPassedProps(ModalHelperText, {
            error: false,
            message: "Bobby Orr"
          });
        });
      });
    });

    describe("fetchUser fails", () => {

      const newNNumber = "n0266666";
      beforeEach(() => fetchUser.mockRejectedValue("wahhhhh"));

      test("should fire onComplete and render helper text", async () => {
        const rendered = renderComponent();
        act(() => getMockedComponentProps(CustomInput).validatedServiceCall(newNNumber));
        await waitFor(() => {
          expect(mockOnComplete).toHaveBeenCalledTimes(0);
          expectMockedComponent(rendered, { ModalHelperText });
          expectOnlyPassedProps(ModalHelperText, {
            error: true,
            message: "Error calling employee lookup service"
          });
        });
        act(() => getMockedComponentProps(ModalHelperText).clearFunction());
        expect(mockOnClear).toHaveBeenCalledTimes(1);
      });
    });
  });
});
