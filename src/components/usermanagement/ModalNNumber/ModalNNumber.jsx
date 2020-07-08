import {
  CustomInput,
  ModalHelperText
} from "components";
import { nNumMatcher } from "globals";
import PropTypes from "prop-types";
import React from "react";
import { fetchUser } from "services";
import styled from "styled-components";

const FlexColumn = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
`;

const ModalNNumber = props => {
  const {
    clearUser,
    disabled,
    form,
    nNumber,
    setForm,
    updateValue
  } = props;

  const validator = nNumber => nNumber.match(nNumMatcher) !== null;

  const inputServiceCall = nNumber => {
    return fetchUser(nNumber)
      .then(res => {
        if (res) {
          setForm({
            ...form,
            lookupError: null,
            lookupInfo: res
          });
        } else {
          setForm({
            ...form,
            lookupInfo: {},
            lookupError: "User not found"
          });
        }
      })
      .catch(err => {
        setForm({
          ...form,
          lookupInfo: {},
          lookupError: `Error calling lookup service: ${err.message}`
        });
      });
  };

  const showModalHelperText = JSON.stringify(form.lookupInfo) !== JSON.stringify({}) || form.lookupError;

  return (
    <FlexColumn>
      <CustomInput
        disabled={disabled}
        label="N Number*"
        name="N Number"
        maxLength="8"
        updateValue={updateValue}
        validator={validator}
        validatedServiceCall={inputServiceCall}
        value={nNumber}
      />
      {
        showModalHelperText
          ? <ModalHelperText
            clearUser={clearUser}
            error={form.lookupError ? true : false}
            message={form.lookupError || `${form.lookupInfo.firstName} ${form.lookupInfo.lastName}`}
          />
          : null
      }
    </FlexColumn>
  );
};

ModalNNumber.propTypes = {
  clearUser: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  form: PropTypes.object.isRequired,
  nNumber: PropTypes.string.isRequired,
  setForm: PropTypes.func.isRequired,
  updateValue: PropTypes.func.isRequired
};

export default ModalNNumber;
