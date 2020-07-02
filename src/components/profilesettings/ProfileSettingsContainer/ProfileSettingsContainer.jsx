import React, { useState } from "react";
import EditSettingsModal from "../EditSettingsModal/EditSettingsModal.jsx";
import { Modal } from "@material-ui/core";

const ProfileSettingsContainer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return(
    <>
    <h1>Please select a profile</h1>
    <button onClick={() => setIsOpen(true)}>Faiths Button</button>
    <Modal open={isOpen}>
      <EditSettingsModal/>
    </Modal>
    </>
  );
};

export default ProfileSettingsContainer;