import { TextField } from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";
import MaskedInput from "react-text-mask";
import styled from "styled-components";

const TextInput = styled(TextField)`
  flex-grow: 1;
  && {
    margin: 2%;
  }
`;

function TextMaskCustom(inputProps) {
  const {
    inputRef,
    ...other
  }  = inputProps;
  return (
    <MaskedInput
      {...other}
      guide={false}
      mask={["(", /[1-9]/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/]}
      placeholderChar={"\u2000"}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      showMask />
  );
}

const ModalPhoneNumber = props => {
  const {
    outgoingNumber,
    updateValue
  } = props;

  return (
    <TextInput
      id="outlined-outgoing-input"
      InputProps={{ inputComponent: TextMaskCustom }}
      label="Outgoing Number *"
      name="Outgoing Number"
      onChange={event => updateValue(event.target.value)}
      margin="normal"
      variant="outlined"
      value={outgoingNumber}
    />
  );
};

ModalPhoneNumber.propTypes = {
  outgoingNumber: PropTypes.string.isRequired,
  updateValue: PropTypes.func.isRequired
};

export default ModalPhoneNumber;