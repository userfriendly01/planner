import { TextField } from "@material-ui/core";
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

const Header = styled.h1`
  align-self: center;
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

const DialListEntryForm = props => {
  const {
    contactInfo,
    handleClose,
    headerText,
    onSubmit,
    submitButtonText
  } = props;
  const {
    contact_num,
    contact_nme,
    external_num
  } = contactInfo;

  const [form, setForm] = useState({
    transferNumber: contact_num ? contact_num : "",
    friendlyName: contact_nme ? contact_nme : "",
    externalNumber: external_num ? external_num : ""
  });

  console.log("FORM UPDATED", form);

  return (
    <ModalContainer>
      <PaperContainer>
        <Header>{headerText}</Header>
        <ModalPhoneNumber
          id="transfer-number"
          number={form.transferNumber}
          label="Transfer Number"
          updateValue={newValue => setForm({
            ...form,
            transferNumber: newValue
          })}
        />
        <TextField
          id="friendly-name-input"
          inputProps={{ maxLength: 80 }}
          label="Friendly Name"
          name="Friendly Name"
          onChange={event => setForm({
            ...form,
            friendlyName: event.target.value
          })}
          margin="normal"
          variant="outlined"
          value={form.friendlyName}
        />
        <TextField
          id="external-number-input"
          inputProps={{ maxLength: 80 }}
          label="External Number"
          name="External Number"
          onChange={event => setForm({
            ...form,
            externalNumber: event.target.value
          })}
          margin="normal"
          variant="outlined"
          value={form.externalNumber}
        />
        <ButtonWrapper>
          {/* <StyledButton onClick={saveDialListEntry}>Save</StyledButton> */}
          <StyledButton onClick={onSubmit}>{submitButtonText}</StyledButton>
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
