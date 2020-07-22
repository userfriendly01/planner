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
          id="transfer-number-input"
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
                externalNumber: event.target.value
              })}
              margin="normal"
              variant="outlined"
              value={form.externalNumber}
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
