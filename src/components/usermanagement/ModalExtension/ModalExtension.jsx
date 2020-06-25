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

const ModalExtension = props => {
  const {
    disabled,
    label,
    loading,
    name,
    extension,
    updateValue
  } = props;

  return (
    <FlexRow>
      <TextInput
        disabled={disabled}
        id="outlined-extension-input"
        inputProps={{ maxLength: "4" }}
        label={label}
        margin="normal"
        name={name}
        onChange={event => updateValue(event.target.value)}
        variant="outlined"
        value={extension}
      />
      {loading ? <ModalFetchingRing data-testid="loading" /> : null}
    </FlexRow>
  );
};

ModalExtension.propTypes = {
  disabled: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  extension: PropTypes.string.isRequired,
  updateValue: PropTypes.func.isRequired
};

export default ModalExtension;
