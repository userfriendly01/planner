import { ThreeDRotation } from "@material-ui/icons";
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
  error: boolean,
  message: string,
  show: boolean
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
    error: false,
    message: null,
    show: false
  });

  const validator = (nNumber: string) => nNumber.match(nNumMatcher) !== null;

  const lookupNNumber = (nNumber: string) => {
    return fetchUser(nNumber)
      .then(fetchedUser => {
        setLookupResults({
          error: false,
          message: `${fetchedUser.firstName} ${fetchedUser.lastName}`,
          show: true
        });
        onComplete(fetchedUser, nNumber);
      })
      .catch(err => {
        console.error("Failed to fetch user from employee lookup service", {
          error: err,
          nNumber
        });
        setLookupResults({
          error: true,
          message: "Error calling employee lookup service",
          show: true
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
        onBlur={onBlur}
        maxLength="8"
        updateValue={onUpdate}
        value={value}
        validator={validator}
        validatedServiceCall={lookupNNumber}
      />
      {
        lookupResults.show
          ? <ModalHelperText
              clearFunction={() => {
                setLookupResults({
                  error: false,
                  message: null,
                  show: false
                });
                onClear();
              }}
              error={lookupResults.error}
              message={lookupResults.message}
            />
          : null
      }
    </FlexColumn>
  );
};

export default ModalNNumber;
