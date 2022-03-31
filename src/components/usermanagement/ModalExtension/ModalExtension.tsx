import {
  CustomInput,
  ModalHelperText
} from "components";
import { extensionMatcher } from "globals";
import React from "react";
import styled from "styled-components";

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;
export interface ModalExtensionProps {
  disabled?: boolean,
  extension: string,
  isEditExisting?: boolean,
  message?: string,
  isError?: boolean,
  onBlur?: () => void,
  onClear: () => void,
  onUpdate: (value: string, isValid: boolean) => void,
}

const ModalExtension = (props: ModalExtensionProps) => {
  const {
    disabled,
    extension,
    message,
    isError,
    onBlur,
    onClear,
    onUpdate
  } = props;

  const validator = (extension: string) => extensionMatcher.test(extension);

  return (
    <FlexColumn>
      <CustomInput
        disabled={disabled}
        error={isError}
        label="Extension"
        maxLength="5"
        name="Extension"
        onBlur={onBlur}
        updateValue={value => onUpdate(value, false)}
        value={extension}
        validator={validator}
        // validatedServiceCall={inputServiceCall}
      />
      {
        message
          ? <ModalHelperText
            clearFunction={onClear}
            error={isError}
            message={message}
          />
          : null
      }
    </FlexColumn>
  );
};

export default ModalExtension;
