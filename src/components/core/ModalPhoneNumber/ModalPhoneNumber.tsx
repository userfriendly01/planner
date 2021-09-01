import {
  getE164Number,
  isNumberValid,
  unMaskPhoneNumber
} from "@lmig/phone-number-utils";
import {
  Switch,
  TextField
} from "@material-ui/core";
import React, { useState } from "react";
import MaskedInput from "react-text-mask";
import styled from "styled-components";

const tenDigitMask = ["(", /[1-9]/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];
const sevenDigitMask = [/[1-9]/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/];

const InputAndToggleContainer = styled.div`
  align-items: center;
  display: flex;
`;

const SwitchContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  margin-left: 8px;
`;

const SevenDigitInputMask = (inputProps: any) => {
  const {
    inputRef,
    ...other
  } = inputProps;
  return (
    <MaskedInput
      {...other}
      guide={false}
      mask={sevenDigitMask}
      placeholderChar={"\u2000"}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      showMask />
  );
};

const TenDigitInputMask = (inputProps: any) => {
  const {
    inputRef,
    ...other
  } = inputProps;
  return (
    <MaskedInput
      {...other}
      guide={false}
      mask={tenDigitMask}
      placeholderChar={"\u2000"}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      showMask />
  );
};

export interface ModalPhoneNumberProps {
  allowSevenDigitVdn?: boolean,
  disabled?: boolean,
  error?: boolean,
  helperText?: string,
  id: string,
  label: string,
  number: string,
  onBlur: () => void,
  showError?: boolean,
  updateValue: (maskedValue: string, unmaskedValue: string, isNumberValid: boolean, e164Number: string) => void,
  icon?: JSX.Element
}
const ModalPhoneNumber = (props: ModalPhoneNumberProps, ref: null) => {
  const {
    allowSevenDigitVdn, // if true, show toggle button to switch between input masks,
    disabled = false,
    error,
    helperText,
    id,
    label,
    number,
    onBlur,
    showError,
    updateValue,
    icon = null
  } = props;

  const [useSevenDigitMask, setUseSevenDigitMask] = useState(false);

  const validationError = !isNumberValid(unMaskPhoneNumber(number), useSevenDigitMask);
  const validationHelperText = useSevenDigitMask ? "Enter a seven digit VDN" : "Enter a valid ten digit phone number";

  const textField = (
    <TextField
      disabled={disabled}
      error={error || (showError && validationError)}
      helperText={helperText || (showError && validationError ? validationHelperText : null)}
      id={id}
      InputProps={{
        inputComponent: useSevenDigitMask ? SevenDigitInputMask : TenDigitInputMask,
        style: {
          flexGrow: 1
        },
        endAdornment: (icon)
      }}
      label={label}
      name={label}
      onBlur={onBlur}
      onChange={({
        target: {
          value: maskedValue
        }
      }) => {
        const unmaskedValue = unMaskPhoneNumber(maskedValue);
        let e164Number = "";
        try {
          e164Number = getE164Number(unmaskedValue);
        } catch (e) {}
        updateValue(maskedValue, unmaskedValue, isNumberValid(unmaskedValue, useSevenDigitMask), e164Number);
      }}
      margin="normal"
      variant="outlined"
      value={number}
    />
  );

  if (allowSevenDigitVdn) {
    const toggleSwitch = () => {
      updateValue("", "", false, "");
      setUseSevenDigitMask(!useSevenDigitMask);
    };
    return (
      <InputAndToggleContainer>
        {textField}
        <SwitchContainer>
          <div>7 Digit VDN</div>
          <Switch
            checked={useSevenDigitMask}
            data-testid={"toggle-seven-digit"}
            onChange={toggleSwitch}
            inputProps={{ "aria-label": "toggle skills modified" }}
          />
        </SwitchContainer>
      </InputAndToggleContainer>
    );
  } else {
    return textField;
  }
};

export default React.forwardRef(ModalPhoneNumber);