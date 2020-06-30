import { TextField } from "@material-ui/core";
import {
  PaperContainer,
  ModalPhoneNumber,
  StyledButton
} from "components";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";


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

const EditSettingsModal = props => {
  const {
    transferNumber,
    friendlyName,
    externalNumber
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
          label="Transfer Number"
          updateValue={newValue => setForm({
            ...form,
            externalNumber: newValue
          })}
        />
        <StyledButton onClick={saveDialListEntry}>Save</StyledButton>
      </PaperContainer>
    </ModalContainer>
  );
};

EditSettingsModal.propTypes = {
  transferNumber: PropTypes.string,
  friendlyName: PropTypes.string,
  externalNumber: PropTypes.number
};

export default EditSettingsModal;