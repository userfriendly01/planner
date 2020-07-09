import { TextField } from "@material-ui/core";
import {
  PaperContainer,
  ModalPhoneNumber,
  StyledButton
} from "components";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";

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
    externalNumber,
    friendlyName,
    headerText,
    onSubmit,
    submitButtonText,
    transferNumber
  } = props;

  const [form, setForm] = useState({
    transferNumber: transferNumber ? transferNumber : null,
    friendlyName: friendlyName ? friendlyName : null,
    externalNumber: externalNumber ? externalNumber : null
  });

  console.log("FORM UPDATED", form);

  return (
    <ModalContainer>
      <PaperContainer>
        <Header>{headerText}</Header>
        <ModalPhoneNumber
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
          id="friendly-name-input"
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
        <StyledButton onClick={onSubmit}>{submitButtonText}</StyledButton>
      </PaperContainer>
    </ModalContainer>
  );
};

DialListEntryForm.propTypes = {
  externalNumber: PropTypes.number,
  friendlyName: PropTypes.string,
  headerText: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonText: PropTypes.string.isRequired,
  transferNumber: PropTypes.string
};

export default DialListEntryForm;