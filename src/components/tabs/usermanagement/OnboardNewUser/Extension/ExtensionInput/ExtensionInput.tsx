import {
  ExtensionSearchStatuses,
  ModalExtensionProps
} from "./ExtensionInput.Interfaces";
import {
  ExtensionButtonWrapper,
  ExtensionWrapper,
  FlexColumn,
  UserFormButton
} from "./ExtensionInput.Styles";
import {
  CustomInput,
  ModalHelperText
} from "components";
import {
  useFormDispatch,
  useFormState,
  userFormActions
} from "context";
import { extensionMatcher } from "globals";
import React from "react";
import { checkExtension } from "services";
import { SearchParams } from "../ExtensionSearchParams";

const ModalExtension = (props: ModalExtensionProps) => {
  const {
    disabled,
    extension,
    message,
    isError,
    onBlur
  } = props;

  const form = useFormState();
  const setForm = useFormDispatch();
  const searchParams = SearchParams.getValues();
  const validator = (extension: string) => extensionMatcher.test(extension);

  const handleExtensionUpdated = (extension:string) => {
    setForm({
      type: userFormActions.UPDATE_EXTENSION,
      payload: {
        extension,
        isValid: (extension === form.extensionStatus.originalExtension && form.extensionStatus.originalExtension)
      }
    });
  };

  const handleExtensionCleared = () => {
    setForm({
      type: userFormActions.CLEAR_EXTENSION
    });
  };

  const assignExtension = () => {
    setForm({
      type: userFormActions.ASSIGN_EXTENSION
    });
  };

  const pickANumber = () => {
    let extNum = null;
    while (!extNum) {
      const oneNum = searchParams.MinExtensionNum + Math.floor((Math.random() * searchParams.ExtensionNumRange));
      if (searchParams.ReservedExtensions.indexOf(oneNum) === -1) {
        extNum = oneNum.toString();
      }
    }
    validateTwilioExtension(extNum);
  };

  const validateTwilioExtension = (extNum:string) => {
    if (searchParams.ReservedExtensions.indexOf(parseInt(extNum)) !== -1) {
      setForm({
        type: userFormActions.SET_EXTENSION_MESSAGE,
        payload: {
          message: "Extension is reserved",
          isError: true
        }
      });
      return;
    }

    checkExtension(extNum)
      .then(isExtensionAvailable => {
        if (isExtensionAvailable) {
          setForm({
            type: userFormActions.UPDATE_EXTENSION,
            payload: {
              extension: extNum,
              isValid: true
            }
          });
        } else {
          if (form.extensionStatus.searchStatus === ExtensionSearchStatuses.PickANumber) {
            setForm({
              type: userFormActions.SET_EXTENSION_RETRIES
            });
          } else {
            setForm({
              type: userFormActions.SET_EXTENSION_MESSAGE,
              payload: {
                message: "Extension number already used in Twilio",
                isError: true
              }
            });
          }
        }
      })
      .catch (err => {
        console.error("Failed to contact Twilio", err);
      });

    setForm({
      type: userFormActions.SET_EXTENSION_MESSAGE,
      payload: {
        message: "Checking Extension Number with Twilio",
        isError: false
      }
    });
  };

  let extensionButtonLabel = "Auto-Assign";
  let extensionButtonHandler = assignExtension;
  let extensionButtonEnabled = true;

  if (form.extension.value.length > 0) {
    extensionButtonLabel = "Verify";
    extensionButtonHandler = () => validateTwilioExtension(form.extension.value);
    extensionButtonEnabled = extensionMatcher.test(form.extension.value);
  }

  if (form.extensionStatus.searchStatus === ExtensionSearchStatuses.PickANumber) {
    if (form.extensionStatus.retriesRemaining) {
      pickANumber();
    } else {
      setForm({
        type: userFormActions.SET_EXTENSION_MESSAGE,
        payload: {
          message: "Extension retries exhausted.  Please try again.",
          isError: true
        }
      });
    }
  }

  return (
    <ExtensionWrapper>
      <FlexColumn>
        <CustomInput
          disabled={disabled}
          error={isError}
          label="Extension"
          maxLength="5"
          styles={{ width: "200px" }}
          name="Extension"
          onBlur={onBlur}
          updateValue={value => handleExtensionUpdated(value)}
          value={extension}
          validator={validator}
        />
        {(
          message
            ? <ModalHelperText
              clearFunction={handleExtensionCleared}
              error={isError}
              message={message}
            />
            : null
        )}
      </FlexColumn>
      <ExtensionButtonWrapper>
        <UserFormButton
          disabled={!extensionButtonEnabled || form.extension.valid}
          onClick={extensionButtonHandler}
          data-testid={"verify-auto-button"}
        >
          {extensionButtonLabel}
        </UserFormButton>
      </ExtensionButtonWrapper>
    </ExtensionWrapper>
  );
};

export default ModalExtension;
