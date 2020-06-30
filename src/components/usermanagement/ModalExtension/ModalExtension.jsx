import {
  CustomInput,
  ModalHelperText
} from "components";
import { extensionMatcher } from "globals";
import { checkExtension } from "services";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const FlexColumn = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
`;

const ModalExtension = props => {
  const {
    clearExtension,
    disabled,
    extension,
    form,
    setForm,
    updateValue
  } = props;

  const validator = extension => extension.match(extensionMatcher);

  const inputServiceCall = extension => {
    return checkExtension(extension)
      .then(res => {
        if (res) {
          setForm({
            ...form,
            extensionValid: true
          });
        } else {
          setForm({
            ...form,
            extensionValid: false
          });
        }
      })
      .catch(err => {
        console.log(err);
        setForm({
          ...form,
          extensionValid: false
        });
      });
  };

  const showModalHelperText = /\d{4}/g.test(extension);

  return (
    <FlexColumn>
      <CustomInput
        disabled={disabled}
        label="Extension"
        maxLength="4"
        name="Extension"
        updateValue={updateValue}
        value={extension}
        validator={validator}
        validatedServiceCall={inputServiceCall}
      />
      {
        showModalHelperText
          ? <ModalHelperText
            clearUser = {clearExtension}
            error={form.extensionValid ? false : true}
            message={form.extensionValid ? "Extension is valid" : "Extension already in use"}
          />
          : null
      }
    </FlexColumn>
  );
};

ModalExtension.propTypes = {
  clearExtension: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  extension: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
  updateValue: PropTypes.func.isRequired
};

export default ModalExtension;
