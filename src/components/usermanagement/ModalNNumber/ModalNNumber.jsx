import {
  CustomInput,
  ModalHelperText
} from "components";
import { nNumMatcher } from "globals";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { fetchUser } from "services";
import styled from "styled-components";

const FlexColumn = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
`;

const ModalNNumber = props => {
  const {
    disabled,
    nNumber,
    updateNNumber,
    resetParentState,
    setIsValid
  } = props;

  const validator = nNumber => nNumber.match(nNumMatcher) !== null;
  const [ lookupResults, setLookupResults ] = useState(null);
  const [ error, setError ] = useState(false);

  const lookupNNumber = nNumber => {
    return fetchUser(nNumber)
      .then(res => {
        if (res) {
          console.log("Response: ", res);
          setError(false);
          setIsValid(true);
          setLookupResults({
            lookupError: null,
            lookupInfo: `${res.firstName} ${res.lastName}`,
            nNumber
          });
        } else {
          setLookupResults({
            lookupInfo: null,
            lookupError: "User not found",
            nNumber
          });
        }
      })
      .catch(err => {
        setLookupResults({
          lookupInfo: null,
          lookupError: `Error calling lookup service: ${err.message}`,
          nNumber
        });
      });
  };

  return (
    <FlexColumn>
      <CustomInput
        disabled={disabled}
        error={error}
        label="N Number"
        name="N Number"
        onBlur= {lookupResults === null ? () => {
          setError(true);
        }: null}
        maxLength="8"
        updateValue={updateNNumber}
        value={nNumber}
        validator={validator}
        validatedServiceCall={lookupNNumber}
      />
      {
        lookupResults
          ? <ModalHelperText
            clearFunction={() => {
              resetParentState();
              setLookupResults(null);
              setError(false);
              setIsValid(false);
            }}
            error={lookupResults.lookupError ? true: false }
            message={lookupResults.lookupError || lookupResults.lookupInfo}
          />
          : null
      }
    </FlexColumn>
  );
};

ModalNNumber.propTypes = {
  disabled: PropTypes.bool.isRequired,
  nNumber: PropTypes.string.isRequired,
  updateNNumber: PropTypes.func.isRequired,
  resetParentState: PropTypes.func.isRequired,
  setIsValid: PropTypes.func.isRequired
};

export default ModalNNumber;
