import {
  getE164Number,
  isNumberValid,
  unMaskPhoneNumber
} from "utils";
import {
  Switch,
  TextField
} from "@mui/material";
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

const StyledTextField = styled(TextField)`
  ${props => props.value ? ".MuiFormLabel-root { transform: translate(14px, -9px) scale(.75); background-color: white; padding: 0 5; }" : null}
`;

const SevenDigitInputMask = React.forwardRef((inputProps: any, ref: React.ForwardedRef<HTMLDivElement> ) => {
  const {
    ...other
  } = inputProps;
  return (
    <div ref={ref}>
      <MaskedInput
        {...other}
        guide={false}
        mask={sevenDigitMask}
        placeholderChar={"\u2000"}
        showMask />
    </div>
  );
});


const TenDigitInputMask = React.forwardRef((inputProps: any, ref: React.ForwardedRef<HTMLDivElement>) => {
  const {
    ...other
  } = inputProps;
  return (
    <div ref={ref}>
      <MaskedInput
        {...other}
        guide={false}
        mask={tenDigitMask}
        placeholderChar={"\u2000"}
        showMask />
    </div>
  );
});

export interface PhoneNumberInputProps {
  allowSevenDigitVdn?: boolean,
  disabled?: boolean,
  error?: boolean,
  helperText?: string,
  id: string,
  label: string,
  number: string,
  onBlur?: () => void,
  showError?: boolean,
  updateValue: (maskedValue: string, unmaskedValue: string, isNumberValid: boolean, e164Number: string) => void,
  icon?: JSX.Element
}

const PhoneNumberInput = (props: PhoneNumberInputProps) => {
  const {
    allowSevenDigitVdn,
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
    <StyledTextField
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
        if(maskedValue){
          const unmaskedValue = unMaskPhoneNumber(maskedValue);
          let e164Number = "";
          try {
            e164Number = getE164Number(unmaskedValue);
          // eslint-disable-next-line no-empty
          } catch (e) {}
          updateValue(maskedValue, unmaskedValue, isNumberValid(unmaskedValue, useSevenDigitMask), e164Number);
        } else {
          updateValue(maskedValue, undefined, false, undefined);
        }
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

export default PhoneNumberInput;