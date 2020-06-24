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

export const CustomInput = props => {
  const {
    disabled,
    label,
    loading,
    // maxLength,
    name,
    updateValue,
    value
  } = props;

  return (
    <FlexRow>
      <TextInput
        disabled={disabled || loading}
        id={name ? `outlined-${name}-input` : null}
        // inputProps={maxLength ? { maxLength } : null}
        label={label}
        margin="normal"
        name={name}
        onChange={event => updateValue(event.target.value)}
        variant="outlined"
        value={value}
      />
      {loading ? <ModalFetchingRing data-testid="loading" /> : null}
    </FlexRow>
  );
};

CustomInput.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  maxLength: PropTypes.string,
  name: PropTypes.string,
  updateValue: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};