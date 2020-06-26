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
    maxLength,
    name,
    updateValue,
    validator,
    validatedServiceCall,
    value
  } = props;

  const [loading, setLoading] = useState(false);

  const changeValidator = newValue => {
    console.log("I'm rerendered?");
    updateValue(newValue);
    if (validator) {
      if (validator(newValue)) {
        if (validatedServiceCall) {
          setLoading(true);
          validatedServiceCall(newValue).finally(setLoading(false));
        }
      }
    }
  };

  return (
    <FlexRow>
      <TextInput
        disabled={disabled || loading}
        id={name ? `outlined-${name}-input` : null}
        inputProps={maxLength ? { maxLength } : {}}
        label={label}
        margin="normal"
        name={name}
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
  label: PropTypes.string.isRequired,
  maxLength: PropTypes.string,
  name: PropTypes.string,
  updateValue: PropTypes.func.isRequired,
  validator: PropTypes.func,
  validatedServiceCall: PropTypes.func,
  value: PropTypes.string.isRequired
};