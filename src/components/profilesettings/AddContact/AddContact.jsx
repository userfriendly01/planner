import { Modal } from "@material-ui/core";
import {
  DialListEntryForm,
  StyledButton
} from "components";
import React, { useState } from "react";
import styled from "styled-components";

const AddContactButtonContainer = styled.div`
  margin-bottom: 1em;
`;

const AddContact = () => {

  const [isDialListEntryFormOpen, setIsDialListEntryFormOpen] = useState(false);

  const handleOpenAddEditSettings = () => {
    setIsDialListEntryFormOpen(true);
  };

  const handleCloseAddEditSettings = () => {
    setIsDialListEntryFormOpen(false);
  };

  const handleSubmitCreate = () => {
    console.log("create new dial list entry");
  };

  return (
    <AddContactButtonContainer>
      <StyledButton onClick={handleOpenAddEditSettings} data-testid={"add-contact-button"}>
        Add Contact
      </StyledButton>
      <Modal disableBackdropClick={true} open={isDialListEntryFormOpen}>
        <DialListEntryForm
          contactInfo={{}}
          handleClose={handleCloseAddEditSettings}
          headerText={"Add Contact"}
          onSubmit={handleSubmitCreate}
          submitButtonText={"Save"} />
      </Modal>
    </AddContactButtonContainer>
  );
};

export default AddContact;
