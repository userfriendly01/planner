
import { StyledExportButton } from "../Skills.Styles";
import { Modal } from "@mui/material";
import React from "react";
import SkillEntryFormModal from "./SkillEntryFormModal";
import { formModes } from "globals";


const SkillEntryButton = (props: any) => {  // TODO: make a props type?

  const {
    formMode, taskQueues, applications, timeOfDays
  } = props;

  const [ showSkillModal, setShowSkillModal ] = React.useState(false);
  const [ saveResult, setSaveResult ] = React.useState(defaultSaveResult);

  const openModal = () => {
    if (formMode === "UPDATE") {
      // Placeholder to fill in form the existing data
      // skillFormDispatch({
      //   type: skillFormActions.SET_UPDATE_SKILL,
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
      <StyledExportButton onClick={openModal} styles={{}}>{formMode === formModes.INSERT ? 'Add' : 'Edit'} Skill </StyledExportButton>
      <Modal open={showSkillModal}>
        <>
          <SkillEntryFormModal
            closeModal={() => setShowSkillModal(false)}
            taskQueues={taskQueues}
            applications={applications}
            timeOfDays={timeOfDays}
            setSaveResult={setSaveResult}
            saveResult={saveResult}
          />
        </>
      </Modal>
    </>
  );
};

export default SkillEntryButton;