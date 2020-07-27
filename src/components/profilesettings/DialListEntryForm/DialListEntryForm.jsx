import {
  isNumberValid,
  unMaskPhoneNumber
} from "@lmig/phone-number-utils";
import {
  TextField,
  Tooltip
} from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import {
  PaperContainer,
  ModalPhoneNumber,
  StyledButton
} from "components";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";

const FlexRow = styled.div`
  display: flex;
  flex: 1 1 auto;
`;

const ButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 1%;
`;

const ExternalNumberContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Header = styled.h1`
  align-self: center;
`;

const InfoOutlinedStyled = styled(InfoOutlined)`
  && {
    font-size: 30px;
  }
`;

const ModalContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const TextFieldContainer = styled.div`
  width: 90%;
`;

const DialListEntryForm = props => {
  const {
    contactInfo,
    handleClose,
    headerText,
    onSubmit,
    submitButtonText
  } = props;

  const [form, setForm] = useState({
    contact_nme: contactInfo.contact_nme ? contactInfo.contact_nme : "",
    contact_num: contactInfo.contact_num ? contactInfo.contact_num : "",
    contact_num_valid: false, // unmasked phone number value ex: `8005554444`
    external_num: contactInfo.external_num ? contactInfo.external_num : "",
    maskedPhoneNumber: contactInfo.contact_num ? contactInfo.contact_num : "" // raw masked phone number value to properly update ModalPhoneNumber with ex: `(800) 555-4444`
  });

  console.log("FORM UPDATED", form);

  return (
    <ModalContainer>
      <PaperContainer>
        <Header>{headerText}</Header>
        <ModalPhoneNumber
          allowSevenDigitVdn={true}
          id="transfer-number-input"
          number={form.maskedPhoneNumber}
          label="Transfer Number"
          updateValue={(newValue, isValid) => setForm({
            ...form,
            maskedPhoneNumber: newValue,
            contact_num: unMaskPhoneNumber(newValue),
            contact_num_valid: isValid
          })}
        />
        <TextField
          id="friendly-name-input"
          inputProps={{ maxLength: 80 }}
          label="Friendly Name"
          name="Friendly Name"
          onChange={event => setForm({
            ...form,
            contact_nme: event.target.value
          })}
          margin="normal"
          variant="outlined"
          value={form.contact_nme}
        />
        <ExternalNumberContainer>
          <TextFieldContainer>
            <TextField
              fullWidth={true}
              id="external-number-input"
              inputProps={{ maxLength: 80 }}
              label="External Number"
              name="External Number"
              onChange={event => setForm({
                ...form,
                external_num: event.target.value
              })}
              margin="normal"
              variant="outlined"
              value={form.external_num}
            />
          </TextFieldContainer>
          <Tooltip title={"Number to share with customer"}>
            <InfoOutlinedStyled />
          </Tooltip>
        </ExternalNumberContainer>
        <ButtonWrapper>
          <StyledButton onClick={onSubmit(form)}>{submitButtonText}</StyledButton>
          <StyledButton onClick={handleClose}>Close</StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

DialListEntryForm.propTypes = {
  contactInfo: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  headerText: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonText: PropTypes.string.isRequired
};

export default DialListEntryForm;
