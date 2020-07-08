import {
  CustomInput,
  ModalHelperText
} from "components";
import { extensionMatcher } from "globals";
import { checkExtension } from "services";
import PropTypes from "prop-types";
import React, {
  useState
} from "react";
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
    isEditExisting,
    originalValue,
    setForm,
    updateValue
  } = props;

  const [loading, setLoading] = useState(false);
  const validator = extension => extension.match(extensionMatcher);

  const inputServiceCall = extension => {
    setLoading(true);
    const isOriginal = isEditExisting ? extension === originalValue : false;
    return checkExtension(extension)
      .then(isValid => {
        if (isValid || isOriginal) {
          setForm({
            ...form,
            extensionValid: true,
            extensionUpdated: !isOriginal
          });
        } else {
          setForm({
            ...form,
            extensionValid: false,
            extensionUpdated: false
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setForm({
          ...form,
          extensionValid: false,
          extensionUpdated: false
        });
        setLoading(false);
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
            error={!(form.extensionValid || loading)}
            message={loading? "Validating..." : (form.extensionValid ? "Extension is valid" : "Extension already in use")}
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
  isEditExisting: PropTypes.bool,
  originalValue: PropTypes.string,
  setForm: PropTypes.func.isRequired,
  updateValue: PropTypes.func.isRequired
};

export default ModalExtension;
