import {
  CustomInput,
  ModalHelperText
} from "components";
import { extensionMatcher } from "globals";
import { checkExtension } from "services";
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
  extension: string,
  isEditExisting?: boolean,
  message?: string,
  isError?: boolean,
  onBlur?: () => void,
  onClear: () => void,
  onUpdate: (value: string, isValid: boolean) => void,
}

// interface ExtensionLookupStatus {
//   extensionValid: boolean,
//   loading: boolean,
//   message: string
// }

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

  // const [lookupStatus, setLookupStatus] = useState<ExtensionLookupStatus>({
  //   extensionValid: true,
  //   loading: false,
  //   message: "Extension is valid"
  // });

  const validator = (extension: string) => extensionMatcher.test(extension);

  // const inputServiceCall = (extension: string) => {
  //   setLookupStatus({
  //     ...lookupStatus,
  //     loading: true,
  //     message: "Validating..."
  //   });
  //   const isOriginal = originalValue ? extension === originalValue : false;
  //   return checkExtension(extension)
  //     .then(isExtensionAvailable => {
  //       const extensionValid = isExtensionAvailable || isOriginal;
  //       setLookupStatus({
  //         extensionValid,
  //         loading: false,
  //         message: extensionValid ? "Extension is valid" : "Extension already in use"
  //       });
  //       onUpdate(extension, extensionValid);
  //     })
  //     .catch(err => {
  //       console.error("Failed to look up extension", {
  //         err,
  //         extension
  //       });
  //       const extensionValid = false;
  //       setLookupStatus({
  //         extensionValid,
  //         loading: false,
  //         message: "Error occurred when checking extension"
  //       });
  //       onUpdate(extension, extensionValid);
  //     });
  // };

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
