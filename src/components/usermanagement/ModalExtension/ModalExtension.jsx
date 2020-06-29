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
    extension,
    updateValue,
    form,
    setForm
  } = props;

  const validator = extension => extension.match(extensionMatcher);

  const inputServiceCall = extension => {
    return checkExtension(extension)
      .then(res => {
        if (res.isValid) {
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

  const showModalHelperText = !form.extensionValid && form.extension !== "";

  return (
    <FlexColumn>
      <CustomInput
        maxLength="4"
        label="Extension"
        name="Extension"
        updateValue={updateValue}
        value={extension}
        validator={validator}
        validatedServiceCall={inputServiceCall}
      />
      {
        showModalHelperText
          ? <ModalHelperText
            error={form.extensionValid ? true : false}
            message={"Extension already in use"}
          />
          : null
      }
    </FlexColumn>
  );
};

ModalExtension.propTypes = {
  extension: PropTypes.string.isRequired,
  updateValue: PropTypes.func.isRequired,
  setForm: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired
};

export default ModalExtension;
