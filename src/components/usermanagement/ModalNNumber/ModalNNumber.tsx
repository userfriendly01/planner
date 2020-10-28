import {
  CustomInput,
  ModalHelperText
} from "components";
import { nNumMatcher } from "globals";
import React, { useState } from "react";
import {
  fetchUser,
  FetchUserResponse
} from "services";
import styled from "styled-components";

const FlexColumn = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
`;

export interface NNumberLookupResults {
  error: string,
  name: string,
  nNumber: string
}

export interface ModalNNumberProps {
  disabled: boolean,
  label: string,
  onBlur?: () => void,
  onClear: () => void,
  onComplete: (fetchedUser: FetchUserResponse, nNumber: string) => void,
  onUpdate: (newValue: string) => void,
  value: string
}

const ModalNNumber = (props: ModalNNumberProps) => {
  const {
    disabled,
    label,
    onBlur,
    onClear,
    onComplete,
    onUpdate,
    value
  } = props;

  const [ lookupResults, setLookupResults ] = useState<NNumberLookupResults>({
    error: null,
    name: null,
    nNumber: null
  });

  const validator = (nNumber: string) => nNumber.match(nNumMatcher) !== null;

  const handleBlur = () => {
    if(onBlur){
      onBlur();
    }
    if (!lookupResults) {
      setLookupResults({
        error: "Incomplete Entry",
        name: null,
        nNumber: null
      });
    }
  };

  const handleOnClear = () => {
    setLookupResults({
      error: null,
      name: null,
      nNumber: null
    });
    onClear();
  };

  const lookupNNumber = (nNumber: string) => {
    return fetchUser(nNumber)
      .then(fetchedUser => {
        setLookupResults({
          error: null,
          name: `${fetchedUser.firstName} ${fetchedUser.lastName}`,
          nNumber
        });
        onComplete(fetchedUser, nNumber);
      })
      .catch(err => {
        console.error("Failed to fetch user from employee lookup service", {
          error: err,
          nNumber
        });
        setLookupResults({
          error: `Error calling lookup service: ${err.message}`,
          name: null,
          nNumber
        });
      });
  };

  return (
    <FlexColumn>
      <CustomInput
        disabled={disabled}
        error={lookupResults.error ? true : false}
        label= {label}
        name="N Number"
        onBlur={handleBlur}
        maxLength="8"
        updateValue={onUpdate}
        value={value}
        validator={validator}
        validatedServiceCall={lookupNNumber}
      />
      {
        lookupResults
          ? <ModalHelperText
            clearFunction={handleOnClear}
            error={lookupResults.error ? true: false }
            message={lookupResults.error || lookupResults.name}
          />
          : null
      }
    </FlexColumn>
  );
};

export default ModalNNumber;
