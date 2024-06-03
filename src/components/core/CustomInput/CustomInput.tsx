import { TextField } from "@mui/material";
import { ModalFetchingRing } from "components/ModalFetchingRing";
import React, {
  useState
} from "react";
import styled from "styled-components";

const StyledTextField = styled(TextField)<{styles?: any}>`
  width: ${props => props.styles?.width || "385px"};
  && {
    margin: ${props => props.styles?.margin || "8px 0"};
  }
`;

export interface CustomInputProps {
  disabled?: boolean,
  error?: boolean,
  label: string,
  maxLength?: string,
  name: string,
  styles?: any,
  onBlur?: () => void,
  updateValue: (value: string) => void,
  validator?: (value: string) => boolean,
  validatedServiceCall?: (value: string) => Promise<any>,
  value: string
}

export const CustomInput = (props: CustomInputProps) => {
  const {
    disabled,
    error,
    label,
    maxLength,
    name,
    styles,
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
    <>
      <StyledTextField
        disabled={disabled || loading}
        error={error}
        id={name ? `outlined-${name}-input` : null}
        inputProps={maxLength ? { maxLength } : {}}
        label={label}
        margin="normal"
        styles={styles}
        name={name}
        onBlur={onBlur}
        onChange={event => changeValidator(event.target.value)}
        variant="outlined"
        value={value}
      />
      {loading ? <ModalFetchingRing data-testid="loading" /> : null}
    </>
  );
};