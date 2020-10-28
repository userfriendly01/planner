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
    label,
    onBlur,
    onComplete,
    onClear
  } = props;

  const defaultNNumber = "n";
  const [ lookupResults, setLookupResults ] = useState(null);
  const [ nNumber, setNNumber ] = useState(defaultNNumber);

  const validator = nNumber => nNumber.match(nNumMatcher) !== null;

  const handleBlur = () => {
    if(onBlur){
      onBlur();
    }
    if (!lookupResults) {
      setLookupResults({
        lookupError: "Incomplete Entry"
      });
    }
  };

  const handleOnClear = () => {
    setLookupResults(null);
    setNNumber(defaultNNumber);
    onClear();
  };

  const lookupNNumber = nNumber => {
    return fetchUser(nNumber)
      .then(res => {
        console.log("RESPONSE: ", res);
        if (res) {
          setLookupResults({
            lookupError: null,
            lookupInfo: `${res.firstName} ${res.lastName}`,
            nNumber
          });
          onComplete({
            lookupInfo: res,
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
        error={lookupResults ? lookupResults.lookupError : false}
        label= {label ? label : "N Number"}
        name="N Number"
        onBlur={handleBlur}
        maxLength="8"
        updateValue={setNNumber}
        value={nNumber}
        validator={validator}
        validatedServiceCall={lookupNNumber}
      />
      {
        lookupResults
          ? <ModalHelperText
            clearFunction={handleOnClear}
            error={lookupResults.lookupError ? true: false }
            message={lookupResults.lookupError || lookupResults.lookupInfo}
          />
          : null
      }
    </FlexColumn>
  );
};

ModalNNumber.propTypes = {
  label: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  onBlur: PropTypes.func,
  onComplete: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired
};

export default ModalNNumber;
