import { ModalNNumberProps } from "./NNumberInput.Interfaces";
import { CustomInput } from "components/CustomInput";
import { ModalHelperText } from "components/ModalHelperText";
import { nNumMatcher } from "globals/index";
import React, { useState } from "react";
import { fetchUser } from "services/fetchUser";
import { logger } from "utils/logger";

const NNumberEntryField = (props: ModalNNumberProps) => {
  const {
    disabled,
    fetchedUser,
    label,
    onBlur,
    onClear,
    onComplete,
    onUpdate,
    value
  } = props;

  const [lookupError, setLookupError] = useState<string>("");

  const validator = (nNumber: string) => nNumber.match(nNumMatcher) !== null;

  const lookupNNumber = (nNumber: string) => {
    return fetchUser(nNumber)
      .then(newlyFetchedUser => {
        onComplete(newlyFetchedUser, nNumber);
      })
      .catch(error => {
        logger.error("Failed to fetch user from employee lookup service", {
          error,
          nNumber
        });
        setLookupError("Error calling employee lookup service");
      });
  };

  return (
    <>
      <CustomInput
        disabled={disabled}
        error={lookupError ? true : false}
        label={label}
        name="N Number"
        onBlur={onBlur}
        maxLength="8"
        updateValue={onUpdate}
        value={value}
        validator={validator}
        validatedServiceCall={lookupNNumber}
      />
      {
        (fetchedUser || lookupError)
          ? <ModalHelperText
            clearFunction={() => {
              setLookupError("");
              onClear();
            }}
            error={lookupError ? true : false}
            message={fetchedUser ? `${fetchedUser.firstName} ${fetchedUser.lastName}` : lookupError}
          />
          : null
      }
    </>
  );
};

export default NNumberEntryField;
