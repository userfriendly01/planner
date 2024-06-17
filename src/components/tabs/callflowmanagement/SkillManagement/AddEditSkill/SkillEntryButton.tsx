
import { StyledExportButton } from "../Skills.Styles";
import { Modal } from "@mui/material";
import React from "react";
import SkillEntryFormModal from "./SkillEntryFormModal";
import { formModes } from "globals";

const defaultSaveResult: any = {
  status: null,
  message: null
};

export const SkillEntryButton = (props: any) => {

  const {
    formMode, taskQueues, applications, timeOfDays, isAdmin
  } = props;

  const [ showSkillModal, setShowSkillModal ] = React.useState(false);
  const [ saveResult, setSaveResult ] = React.useState(defaultSaveResult);

  const openModal = () => {
    if (formMode === "UPDATE") {
      // Placeholder to fill in form the existing data
      // skillDispatch({
      //   type: skillActions.SET_UPDATE_SKILL,
      //   payload: {
      //     formMode: formMode,
      //     // and all the other stuff...
      //   }
      // })
    }
    setShowSkillModal(true);
  };

  return (
    <>
      <StyledExportButton onClick={openModal} styles={{}}>{formMode === formModes.INSERT ? "Add" : "Edit"} Skill </StyledExportButton>
      <Modal open={showSkillModal}>
        <>
          <SkillEntryFormModal
            closeModal={() => {
              setShowSkillModal(false);
              setSaveResult({
                message: "",
                status: null
              });
            }}
            setSaveResult={setSaveResult}
            saveResult={saveResult}
            isAdmin={isAdmin}
          />
        </>
      </Modal>
    </>
  );
};