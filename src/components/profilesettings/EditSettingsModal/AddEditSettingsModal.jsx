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

const TextInput = styled(TextField)`
  flex-grow: 1;
  && {
    margin: 2%;
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

const AddEditSettingsModal = props => {
  const {
    externalNumber,
    friendlyName,
    handleClose,
    transferNumber
  } = props;

  const [form, setForm] = useState({
    transferNumber: transferNumber ? transferNumber : null,
    friendlyName: friendlyName ? friendlyName : null,
    externalNumber: externalNumber ? externalNumber : null
  });

  const saveDialListEntry = () => {
    //Add functionality to save the dial list entry
  };

  return (
    <ModalContainer>
      <PaperContainer>
        <Header>Profile Settings</Header>
        <ModalPhoneNumber
          number={form.transferNumber}
          label="Transfer Number"
          updateValue={newValue => setForm({
            ...form,
            transferNumber: newValue
          })}
        />
        <TextInput
          id="friendly-name-input"
          // InputProps={{ inputComponent: TextMaskCustom }}
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
        <ModalPhoneNumber
          number={form.externalNumber}
          label="External Number"
          updateValue={newValue => setForm({
            ...form,
            externalNumber: newValue
          })}
        />
        <ButtonWrapper>
          <StyledButton onClick={saveDialListEntry}>Save</StyledButton>
          <StyledButton onClick={handleClose}>Close</StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

AddEditSettingsModal.propTypes = {
  externalNumber: PropTypes.number,
  friendlyName: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  transferNumber: PropTypes.string.isRequired
};

export default AddEditSettingsModal;