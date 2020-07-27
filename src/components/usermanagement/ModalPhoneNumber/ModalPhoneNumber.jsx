import {
  isNumberValid,
  unMaskPhoneNumber
} from "@lmig/phone-number-utils";
import {
  Switch,
  TextField
} from "@material-ui/core";
import PropTypes from "prop-types";
import React, { useState } from "react";
import MaskedInput from "react-text-mask";
import styled from "styled-components";

const tenDigitMask = ["(", /[1-9]/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];
const sevenDigitMask = [/[1-9]/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/];

const InputAndToggleContainer = styled.div`
  align-items: center;
  display: flex;
`;

const StyledTextField = styled(TextField)`
  flex-grow: 1;
`;

const SwitchContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  margin-left: 8px;
`;

const SevenDigitInputMask = inputProps => {
  const {
    inputRef,
    ...other
  }  = inputProps;
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

const TenDigitInputMask = inputProps => {
  const {
    inputRef,
    ...other
  }  = inputProps;
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

const ModalPhoneNumber = props => {
  const {
    allowSevenDigitVdn, // if true, show toggle button to switch between input masks
    id,
    label,
    number,
    sevenDigitToggleDefault,
    updateValue
  } = props;

  const [useSevenDigitMask, setUseSevenDigitMask] = useState(sevenDigitToggleDefault ? true : false);

  const error = !isNumberValid(unMaskPhoneNumber(number), useSevenDigitMask);
  const helperText = error ? (useSevenDigitMask ? "Enter a seven digit VDN" : "Enter a valid ten digit phone number") : undefined;

  const textField = <StyledTextField
    error={error}
    helperText={helperText}
    id={id}
    InputProps={{
      inputComponent: useSevenDigitMask ? SevenDigitInputMask : TenDigitInputMask,
      style: {
        flexGrow: 1
      }
    }}
    label={label}
    name={label}
    onChange={({
      target: {
        value: maskedValue
      }
    }) => {
      const unmaskedValue = unMaskPhoneNumber(maskedValue);
      updateValue(maskedValue, unmaskedValue, isNumberValid(unmaskedValue, useSevenDigitMask));
    }}
    margin="normal"
    variant="outlined"
    value={number}
  />;

  if (allowSevenDigitVdn) {
    const toggleSwitch = () => {
      updateValue("");
      setUseSevenDigitMask(!useSevenDigitMask);
    };
    return (
      <InputAndToggleContainer>
        {textField}
        <SwitchContainer>
          <div>7 Digit VDN</div>
          <Switch checked={useSevenDigitMask} onChange={toggleSwitch} inputProps={{ "aria-label": "toggle skills modified" }} />
        </SwitchContainer>
      </InputAndToggleContainer>
    );
  } else {
    return textField;
  }
};

ModalPhoneNumber.propTypes = {
  allowSevenDigitVdn: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  number: PropTypes.string.isRequired,
  sevenDigitToggleDefault: PropTypes.bool,
  updateValue: PropTypes.func.isRequired
};

export default ModalPhoneNumber;