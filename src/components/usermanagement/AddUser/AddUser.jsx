import { Modal } from "@material-ui/core";
import {
  AddUserModal,
  StyledButton
} from "components";
import React, {
  useState
} from "react";

const AddUser = () => {

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const handleOpenAddUser = () => {
    setIsAddUserModalOpen(true);
  };

  const handleCloseAddUser = () => {
    setIsAddUserModalOpen(false);
  };

  return (
    <div>
      <StyledButton onClick={handleOpenAddUser} data-testid={"add-user-button"}>
        Add User
      </StyledButton>
      <Modal disableBackdropClick={true} open={isAddUserModalOpen}>
        <AddUserModal handleClose={handleCloseAddUser} />
      </Modal>
    </div>
  );
};

export default AddUser;
