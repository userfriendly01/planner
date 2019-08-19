import { TextField } from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";
import styled, {
  keyframes
} from "styled-components";

const Spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const FetchingRing = styled.div`
  display: inline-block;
  width: 64px;
  height: 64px;
  &:after {
    content: " ";
    display: block;
    width: 46px;
    height: 46px;
    margin: 1px;
    border-radius: 50%;
    border: 5px solid #AAEDED;
    border-color: #AAEDED transparent #AAEDED transparent;
    animation: ${Spin} 1.2s linear infinite;
  }
`;

const FlexRow = styled.div`
  display: flex;
  flex: 1 1 auto;
`;

const TextInput = styled(TextField)`
  flex-grow: 1;
  && {
    margin: 2%;
  }
`;

const ModalNNumber = props => {
  const {
    disabled,
    loading,
    nNumber,
    updateValue
  } = props;

  return (
    <FlexRow>
      <TextInput
        disabled={disabled}
        id="outlined-nNumber-input"
        inputProps={{ maxLength: "8" }}
        label="N Number"
        name="N Number"
        onChange={event => updateValue(event.target.value)}
        margin="normal"
        variant="outlined"
        value={nNumber}
      />
      {loading ? <FetchingRing /> : null}
    </FlexRow>
  );
};

ModalNNumber.propTypes = {
  disabled: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  nNumber: PropTypes.string.isRequired,
  updateValue: PropTypes.func.isRequired
};

export default ModalNNumber;