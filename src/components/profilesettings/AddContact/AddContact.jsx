import { Modal } from "@material-ui/core";
import {
  DialListEntryForm,
  StyledButton
} from "components";
import { apiPaths } from "globals";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
import {
  myAxios,
  removeNonNumericCharacters
} from "utils";

const AddContactButtonContainer = styled.div`
  margin-bottom: 1em;
`;

const AddContact = props => {
  const { profile } = props;
  const { profileId } = profile;

  const [isDialListEntryFormOpen, setIsDialListEntryFormOpen] = useState(false);

  const handleOpenDialListEntryForm = () => {
    setIsDialListEntryFormOpen(true);
  };

  const handleCloseDialListEntryForm = () => {
    setIsDialListEntryFormOpen(false);
  };

  const handleSubmitAddContact = form => () => {
    const req = {
      profile_id: profileId,
      contact_nme: form.friendlyName,
      contact_num: removeNonNumericCharacters(form.transferNumber),
      external_num: removeNonNumericCharacters(form.externalNumber)
    };
    myAxios.put(apiPaths.DIAL_LIST, req)
      .then(res => {
        // TODO: implement success overlay
        console.log("put res:", res);
      })
      .catch(err => {
        console.error("AddContact - Failed to add dial list entry", {
          err
        });
        // TODO: implement failure overlay
      });
  };

  return (
    <AddContactButtonContainer>
      <StyledButton onClick={handleOpenDialListEntryForm} data-testid={"add-contact-button"}>
        Add Contact
      </StyledButton>
      <Modal disableBackdropClick={true} open={isDialListEntryFormOpen}>
        <DialListEntryForm
          contactInfo={{}}
          handleClose={handleCloseDialListEntryForm}
          headerText={"Add Contact"}
          onSubmit={handleSubmitAddContact}
          submitButtonText={"Save"} />
      </Modal>
    </AddContactButtonContainer>
  );
};

AddContact.propTypes = {
  profile: PropTypes.object.isRequired
};

export default AddContact;
