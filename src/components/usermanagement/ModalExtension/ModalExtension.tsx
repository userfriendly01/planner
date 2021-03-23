import {
  CustomInput,
  ModalHelperText
} from "components";
import { extensionMatcher } from "globals";
import { checkExtension } from "services";
import PropTypes from "prop-types";
import React, {
  useState
} from "react";
import styled from "styled-components";

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export interface ModalExtensionProps {
  disabled?: boolean,
  error: boolean,
  extension: string,
  isEditExisting?: boolean,
  originalValue?: string,
  onBlur: () => void,
  onClear: () => void,
  onUpdate: (value: string, isValid: boolean) => void
}

interface ExtensionLookupStatus {
  extensionValid: boolean,
  loading: boolean,
  message: string
}

const ModalExtension = (props: ModalExtensionProps) => {
  const {
    disabled,
    error,
    extension,
    originalValue,
    onBlur,
    onClear,
    onUpdate
  } = props;

  const [lookupStatus, setLookupStatus] = useState<ExtensionLookupStatus>({
    extensionValid: true,
    loading: false,
    message: "Extension is valid"
  });

  const validator = (extension: string) => extensionMatcher.test(extension);

  const inputServiceCall = (extension: string) => {
    setLookupStatus({
      ...lookupStatus,
      loading: true,
      message: "Validating..."
    });
    const isOriginal = originalValue ? extension === originalValue : false;
    return checkExtension(extension)
      .then(isExtensionAvailable => {
        const extensionValid = isExtensionAvailable || isOriginal;
        setLookupStatus({
          extensionValid,
          loading: false,
          message: extensionValid ? "Extension is valid" : "Extension already in use"
        });
        onUpdate(extension, extensionValid);
      })
      .catch(err => {
        console.error("Failed to look up extension", {
          err,
          extension
        });
        const extensionValid = false;
        setLookupStatus({
          extensionValid,
          loading: false,
          message: "Error occurred when checking extension"
        });
        onUpdate(extension, extensionValid);
      });
  };

  const showModalHelperText = validator(extension);

  return (
    <FlexColumn>
      <CustomInput
        disabled={disabled}
        error={error}
        label="Extension"
        maxLength="4"
        name="Extension"
        onBlur={onBlur}
        updateValue={value => onUpdate(value, false)}
        value={extension}
        validator={validator}
        validatedServiceCall={inputServiceCall}
      />
      {
        showModalHelperText
          ? <ModalHelperText
            clearFunction={onClear}
            error={!(lookupStatus.extensionValid || lookupStatus.loading)}
            message={lookupStatus.message}
          />
          : null
      }
    </FlexColumn>
  );
};

ModalExtension.propTypes = {
  clearExtension: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  error: PropTypes.bool,
  extension: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
  isEditExisting: PropTypes.bool,
  originalValue: PropTypes.string,
  setForm: PropTypes.func.isRequired,
  updateValue: PropTypes.func.isRequired
};

export default ModalExtension;
