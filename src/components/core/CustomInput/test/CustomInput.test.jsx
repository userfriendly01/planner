import { CustomInput } from "../CustomInput";
import { TextField } from "@mui/material";
import { ModalFetchingRing } from "components/ModalFetchingRing";
import React from "react";
import {
  getMockedComponentProps,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("@mui/material", () => ({
  TextField: jest.fn()
}));

jest.mock("components/ModalFetchingRing", () => ({
  ModalFetchingRing: jest.fn()
}));

const mockServiceFunction = jest.fn();
const mockValidator = jest.fn();
const updateValueFunc = jest.fn();

describe("CustomInput", () => {
  beforeEach(() => {
    setupMockedComponents({
      TextField,
      ModalFetchingRing
    });
    jest.clearAllMocks();
    mockValidator.mockImplementation(val => val === "validated");
  });

  const renderWithProps = ({
    disabled, error, label, maxLength, name, onBlur, value, validator, validatedService
  }) => {
    return render(<CustomInput
      error={error}
      disabled={disabled}
      label={label}
      maxLength={maxLength}
      name={name}
      onBlur={onBlur}
      updateValue={updateValueFunc}
      validator={validator}
      validatedServiceCall={validatedService}
      value={value} />);
  };

  test("we should pass the correct props to the TextField", () => {
    const disabled = false;
    const error = true;
    const label = "test";
    const maxLength = "5";
    const name = test;
    const onBlur = jest.fn();
    const value = "";
    renderWithProps({
      disabled,
      error,
      label,
      maxLength,
      name,
      onBlur,
      value
    });
    const props = getMockedComponentProps(TextField);
    expect(props.disabled).toBe(disabled);
    expect(props.error).toBe(error);
    expect(props.label).toBe(label);
    expect(props.id).toBe(`outlined-${name}-input`);
    expect(props.inputProps).toEqual({ maxLength });
    expect(props.name).toBe(name);
    props.onBlur();
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(props.value).toBe(value);
  });

  test("non required fields should be fine if not sent", () => {
    const label = "test";
    const value = "";
    renderWithProps({
      label,
      value
    });
    const props = getMockedComponentProps(TextField);
    expect(props.disabled).toBe(false);
    expect(props.label).toBe(label);
    expect(props.id).toBe(null);
    expect(props.inputProps).toEqual({});
    expect(props.name).toBe(undefined);
    expect(props.onBlur).toBe(undefined);
    expect(props.value).toBe(value);
  });

  describe("there is no validator", () => {
    beforeEach(() => {
      renderWithProps({
        disabled: false,
        label: "test",
        maxLength: "5",
        name: test,
        value: "",
        validator: undefined,
        validatedService: undefined
      });
    });
    test("we should still successfully update the value", () => {
      const props = getMockedComponentProps(TextField);
      const change = props.onChange;
      change({
        target: {
          value: "validated"
        }
      });
      expect(updateValueFunc).toHaveBeenCalledWith("validated");
    });
  });

  describe("there is a validator", () => {
    describe("there is no service call", () => {
      beforeEach(() => {
        renderWithProps({
          disabled: false,
          label: "test",
          maxLength: "5",
          name: test,
          value: "",
          validator: mockValidator,
          validatedService: undefined
        });
      });
      test("if the validator passes we should not throw an error by having no service", () => {
        const props = getMockedComponentProps(TextField);
        const change = props.onChange;
        change({
          target: {
            value: "validated"
          }
        });
        expect(updateValueFunc).toHaveBeenCalledWith("validated");
        expect(mockValidator).toHaveBeenCalledWith("validated");
      });
    });
    describe("there is a service call", () => {
      beforeEach(() => {
        renderWithProps({
          disabled: false,
          label: "test",
          maxLength: "5",
          name: test,
          value: "",
          validator: mockValidator,
          validatedService: mockServiceFunction
        });
      });
      test("if the validator fails we should not call the service", () => {
        const props = getMockedComponentProps(TextField);
        const change = props.onChange;
        change({
          target: {
            value: "valid"
          }
        });
        expect(updateValueFunc).toHaveBeenCalledWith("valid");
        expect(mockValidator).toHaveBeenCalledWith("valid");
        expect(mockServiceFunction).toHaveBeenCalledTimes(0);
      });
      test("if the validator passes we should call the service", () => {
        mockServiceFunction.mockResolvedValue("all set");
        const props = getMockedComponentProps(TextField);
        const change = props.onChange;
        change({
          target: {
            value: "validated"
          }
        });
        expect(updateValueFunc).toHaveBeenCalledWith("validated");
        expect(mockValidator).toHaveBeenCalledWith("validated");
        expect(mockServiceFunction).toHaveBeenCalledWith("validated");
      });
    });
  });
});