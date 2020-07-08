import { Modal } from "@material-ui/core";
import {
  AddEditSettingsModal,
  StyledButton
} from "components";
import React, {
  useState
} from "react";
import styled from "styled-components";

const AddContactButtonContainer = styled.div`
  margin-bottom: 1em;
`;

const AddContact = () => {

  const [isAddEditSettingsModalOpen, setIsAddEditSettingsModalOpen] = useState(false);

  const handleOpenAddEditSettings = () => {
    setIsAddEditSettingsModalOpen(true);
  };

  const handleCloseAddEditSettings = () => {
    setIsAddEditSettingsModalOpen(false);
  };

  return (
    <AddContactButtonContainer>
      <StyledButton onClick={handleOpenAddEditSettings} data-testid={"add-contact-button"}>
        Add Contact
      </StyledButton>
      <Modal disableBackdropClick={true} open={isAddEditSettingsModalOpen}>
        <AddEditSettingsModal handleClose={handleCloseAddEditSettings} />
      </Modal>
    </AddContactButtonContainer>
  );
};

export default AddContact;
