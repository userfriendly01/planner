import { ModalNNumberProps } from "./NNumberInput.Interfaces";
import {
  CustomInput,
  ModalHelperText
} from "components";
import { nNumMatcher } from "globals";
import React, { useState } from "react";
import { fetchUser } from "services";

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

  const [ lookupError, setLookupError ] = useState<string>("");

  const validator = (nNumber: string) => nNumber.match(nNumMatcher) !== null;

  const lookupNNumber = (nNumber: string) => {
    return fetchUser(nNumber)
      .then(newlyFetchedUser => {
        onComplete(newlyFetchedUser, nNumber);
      })
      .catch(err => {
        console.error("Failed to fetch user from employee lookup service", {
          error: err,
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
        label= {label}
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
