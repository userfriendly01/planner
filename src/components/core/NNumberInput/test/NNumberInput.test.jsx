import { NNumberInput } from "../NNumberInput";
import { CustomInput } from "components/CustomInput";
import { ModalHelperText } from "components/ModalHelperText";
import { useAdminState } from "context/appContext";
import React from "react";
import { fetchUser } from "services/fetchUser";
import {
  act,
  expectMockedComponent,
  expectOnlyPassedProps,
  getMockedComponentProps,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";

jest.mock("components/CustomInput", () => ({
  CustomInput: jest.fn()
}));

jest.mock("components/ModalHelperText", () => ({
  ModalHelperText: jest.fn()
}));

jest.mock("services/fetchUser", () => ({
  fetchUser: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn()
}));

const mockOnClear = jest.fn();
const mockOnComplete = jest.fn();
const mockOnBlur = jest.fn();
const mockOnUpdate = jest.fn();

const label = "N Number Thing";

const renderComponent = (value, disabled, fetchedUser) => {
  return render(<NNumberInput
    disabled={disabled}
    fetchedUser={fetchedUser}
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

    useAdminState.mockReturnValue({
      userContext: {
        tokens: {
          msGraph: "Access Token"
        }
      }
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

  test("fetchedUser prop should cause helper text to display their name", () => {
    const rendered = renderComponent("n", false, {
      firstName: "Bobby",
      lastName: "Orr"
    });
    expectMockedComponent(rendered, { ModalHelperText });
    expectOnlyPassedProps(ModalHelperText, {
      error: false,
      message: "Bobby Orr"
    });
  });

  describe("CustomInput validatedServiceCall", () => {

    describe("fetchUser succeeds", () => {

      const newNNumber = "n0266666";
      const fetchedUser = {
        firstName: "Bobby",
        lastName: "Orr"
      };
      beforeEach(() => fetchUser.mockResolvedValue(fetchedUser));

      test("should fire onComplete", async () => {
        const rendered = renderComponent();
        act(() => getMockedComponentProps(CustomInput).validatedServiceCall(newNNumber));
        await waitFor(() => {
          expect(mockOnComplete).toHaveBeenCalledWith(fetchedUser, newNNumber);
          expectMockedComponent(rendered, { ModalHelperText }, 0);
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
