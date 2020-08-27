import { TextField } from "@material-ui/core";
import { ModalFetchingRing } from "components";
import PropTypes from "prop-types";
import React, {
  useState
} from "react";
import styled from "styled-components";

const FlexRow = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 auto;
`;

const StyledTextField = styled(TextField)`
  flex-grow: 1;
  && {
    margin: 8px 0;
  }
`;

export const CustomInput = props => {
  const {
    disabled,
    error,
    label,
    maxLength,
    name,
    onBlur,
    updateValue,
    validator,
    validatedServiceCall,
    value
  } = props;

  const [loading, setLoading] = useState(false);

  const changeValidator = newValue => {
    updateValue(newValue);
    if (validator) {
      if (validator(newValue)) {
        if (validatedServiceCall) {
          setLoading(true);
          validatedServiceCall(newValue).finally(() => setLoading(false));
        }
      }
    }
  };

  return (
    <FlexRow>
      <StyledTextField
        disabled={disabled || loading}
        error={error}
        id={name ? `outlined-${name}-input` : null}
        inputProps={maxLength ? { maxLength } : {}}
        label={label}
        margin="normal"
        name={name}
        onBlur={onBlur}
        onChange={event => changeValidator(event.target.value)}
        variant="outlined"
        value={value}
      />
      {loading ? <ModalFetchingRing data-testid="loading" /> : null}
    </FlexRow>
  );
};

CustomInput.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  label: PropTypes.string.isRequired,
  maxLength: PropTypes.string,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  updateValue: PropTypes.func.isRequired,
  validator: PropTypes.func,
  validatedServiceCall: PropTypes.func,
  value: PropTypes.string.isRequired
};