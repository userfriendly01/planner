import { TextField } from "@material-ui/core";
import { ModalFetchingRing } from "components";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

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
      {loading ? <ModalFetchingRing /> : null}
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
