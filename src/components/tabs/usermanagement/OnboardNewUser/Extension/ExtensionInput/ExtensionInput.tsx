import {
  ExtensionSearchStatuses,
  ModalExtensionProps
} from "usermanagement/ExtensionInput.Interfaces";
import {
  ExtensionButtonWrapper,
  ExtensionWrapper,
  FlexColumn,
  UserFormButton
} from "usermanagement/ExtensionInput.Styles";
import { CustomInput } from "components/CustomInput";
import { ModalHelperText } from "components/ModalHelperText";
import {
  useFormDispatch, useFormState
} from "context/appContext";
import { userFormActions } from "context/userFormReducer";
import { extensionMatcher } from "globals";
import React from "react";
import { SearchParams } from "../ExtensionSearchParams";
import { useAdminState } from "context/appContext";
import { checkExtension } from "utils/checkExtensionUtils";

export const ExtensionInput = (props: ModalExtensionProps) => {
  const {
    disabled,
    extension,
    message,
    isError,
    onBlur
  } = props;

  const state = useAdminState();
  const form = useFormState();
  const setForm = useFormDispatch();
  const searchParams = SearchParams.getValues();
  const validator = (extension: string) => extensionMatcher.test(extension);

  const handleExtensionUpdated = (extension:string) => {
    setForm({
      type: userFormActions.UPDATE_EXTENSION,
      payload: {
        extension,
        isValid: (extension === form.triton.extension.status.originalExtension && form.triton.extension.status.originalExtension)
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

    const workers = state.workerContext.workers;

    if (checkExtension(workers, extNum)) {
      setForm({
        type: userFormActions.UPDATE_EXTENSION,
        payload: {
          extension: extNum,
          isValid: true
        }
      });
    } else {
      if (form.triton.extension.status.searchStatus === ExtensionSearchStatuses.PickANumber) {
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
  };

  let extensionButtonLabel = "Auto-Assign";
  let extensionButtonHandler = assignExtension;
  let extensionButtonEnabled = true;

  if (form.triton.extension.value.length > 0) {
    extensionButtonLabel = "Verify";
    extensionButtonHandler = () => validateTwilioExtension(form.triton.extension.value);
    extensionButtonEnabled = extensionMatcher.test(form.triton.extension.value);
  }

  if (form.triton.extension.status.searchStatus === ExtensionSearchStatuses.PickANumber) {
    if (form.triton.extension.status.retriesRemaining) {
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
          disabled={!extensionButtonEnabled || form.triton.extension.valid}
          onClick={extensionButtonHandler}
          data-testid={"verify-auto-button"}
        >
          {extensionButtonLabel}
        </UserFormButton>
      </ExtensionButtonWrapper>
    </ExtensionWrapper>
  );
};