// import { Modal } from "@material-ui/core";
import {
  StyledButton
} from "components";
import React/*, {
  useState
}*/ from "react";
import styled from "styled-components";

const AddContactButtonContainer = styled.div`
  margin-bottom: 1em;
`;

const AddContact = () => {

  // const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);

  const handleOpenAddContact = () => {
    // setIsAddContactModalOpen(true);
    console.log("you clicked the 'add contact' button");
  };

  // const handleCloseAddContact = () => {
  //   setIsAddContactModalOpen(false);
  // };

  return (
    <AddContactButtonContainer>
      <StyledButton /*margin={8}*/ onClick={handleOpenAddContact} data-testid={"add-contact-button"}>
        Add Contact
      </StyledButton>
      {/* <Modal disableBackdropClick={true} open={isAddContactModalOpen}>
        <AddContactModal handleClose={handleCloseAddContact} />
      </Modal> */}
    </AddContactButtonContainer>
  );
};

export default AddContact;
