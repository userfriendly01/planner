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

export interface CustomInputProps {
  disabled?: boolean,
  error?: boolean,
  label: string,
  maxLength: string,
  name: string,
  onBlur?: () => void,
  updateValue: (value: string) => void,
  validator?: (value: string) => boolean,
  validatedServiceCall?: (value: string) => Promise<any>,
  value: string
};

export const CustomInput = (props: CustomInputProps) => {
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

  const changeValidator = (newValue: string) => {
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