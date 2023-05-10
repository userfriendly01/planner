
import { StyledExportButton } from "../Skills.Styles";
import { Modal } from "@mui/material";
import React from "react";
import SkillEntryFormModal from "./SkillEntryFormModal";
import { formModes } from "globals";
import { useAdminState } from "context";
import { getAuthenticationProfileTemplates } from "authentication";


const defaultSaveResult: any = {
  status: null,
  message: null
};

const SkillEntryButton = (props: any) => {

  const {
    formMode, taskQueues, applications, timeOfDays
  } = props;

  const state = useAdminState();

  const tritonProfile = state.userContext.authenticationProfiles.find((p: any) => p.name === getAuthenticationProfileTemplates().TRITON.name);
  const isAdmin = tritonProfile.isAdmin;

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
      {isAdmin && (
        <>
          <StyledExportButton onClick={openModal} styles={{}}>{formMode === formModes.INSERT ? "Add" : "Edit"} Skill </StyledExportButton>
          <Modal open={showSkillModal}>
            <>
              <SkillEntryFormModal
                closeModal={() => setShowSkillModal(false)}
                taskQueues={taskQueues}
                applications={applications}
                timeOfDays={timeOfDays}
                setSaveResult={setSaveResult}
                saveResult={saveResult}
                isAdmin={isAdmin}
              />
            </>
          </Modal>
        </>
      )}
    </>
  );
};

export default SkillEntryButton;