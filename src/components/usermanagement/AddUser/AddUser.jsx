import { Modal } from "@material-ui/core";
import {
  AddUserModal,
  StyledButton
} from "components";
import React, {
  useState
} from "react";
import styled from "styled-components";

const AddUserButtonWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-self: flex-end;
  margin-left: auto;
`;

const Wrapper = styled.div`
  display: flex;
`;

const AddUser = () => {

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const handleOpenAddUser = () => {
    setIsAddUserModalOpen(true);
  };

  const handleCloseAddUser = () => {
    setIsAddUserModalOpen(false);
  };

  return (
    <Wrapper>
      <AddUserButtonWrapper>
        <StyledButton onClick={handleOpenAddUser} data-testid={"add-user-button"}>
          Add User
        </StyledButton>
      </AddUserButtonWrapper>
      <Modal disableBackdropClick={true} open={isAddUserModalOpen}>
        <AddUserModal handleClose={handleCloseAddUser} />
      </Modal>
    </Wrapper>
  );
};

export default AddUser;
