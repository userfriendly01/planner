import {
  getE164Number,
  isNumberValid,
  unMaskPhoneNumber
} from "@lmig/phone-number-utils";
import {
  Switch,
  TextField
} from "@mui/material";
import React, { useState } from "react";
import MaskedInput from "react-text-mask";
import PropTypes from "prop-types";
import styled from "styled-components";

//Warning - if you want to try and convert this to a tsx file, there seems to be version weirdness with @types/react-text-mask and its... not worth it

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

const SevenDigitInputMask = inputProps => {
  const {
    // inputRef,
    ...other
  } = inputProps;
  return (
    <MaskedInput
      {...other}
      guide={false}
      mask={sevenDigitMask}
      placeholderChar={"\u2000"}
      // ref={ref => {
      //   inputRef(ref ? ref.inputElement : null);
      // }}
      showMask />
  );
};

const TenDigitInputMask = inputProps => {
  const {
    // inputRef,
    ...other
  } = inputProps;
  return (
    <MaskedInput
      {...other}
      guide={false}
      mask={tenDigitMask}
      placeholderChar={"\u2000"}
      // ref={ref => {
      //   inputRef(ref ? ref.inputElement : null);
      // }}
      showMask />
  );
};

// export interface ModalPhoneNumberProps {
//   allowSevenDigitVdn?: boolean,
//   disabled?: boolean,
//   error?: boolean,
//   helperText?: string,
//   id: string,
//   label: string,
//   number: string,
//   onBlur: () => void,
//   showError?: boolean,
//   updateValue: (maskedValue: string, unmaskedValue: string, isNumberValid: boolean, e164Number: string) => void,
//   icon?: JSX.Element
// }
const ModalPhoneNumber = props => {
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

ModalPhoneNumber.propTypes = {
  // message: PropTypes.string.isRequired,
  allowSevenDigitVdn: PropTypes.bool, // if true, show toggle button to switch between input masks,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  number: PropTypes.number,
  onBlur: PropTypes.func,
  showError: PropTypes.bool,
  updateValue: PropTypes.func,
  icon: PropTypes.any
};

export default ModalPhoneNumber;