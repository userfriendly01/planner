
import { StyledExportButton } from "../Skills.Styles";
import { Modal } from "@mui/material";
import {
  useAdminState,
  // skillFormState
} from "context";
import { getAuthenticationProfileTemplates } from "authentication";
import React from "react";
import SkillEntryFormModal from "./SkillEntryFormModal";
// import { SkillFormState } from "./SkillEntryForm.Interfaces";


const SkillEntryButton = (props: any) => {  // TODO: make a props type?

  const {
    formMode, taskQueues, applications, timeOfDays
  } = props;

  // const [ taskQueues, setTaskQueues ] = React.useState([]);
  // const [ applications, setApplications ] = React.useState([]);
  // const [ timeOfDays, setTimeOfDays ] = React.useState([]);

  // const skFormState: SkillFormState = skillFormState();

  React.useEffect(() => {

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

  }, []);

  const [ showSkillModal, setShowSkillModal ] = React.useState(false);

  const state = useAdminState();
  const tritonProfile = state.userContext.authenticationProfiles.find((p: any) => p.name === getAuthenticationProfileTemplates().TRITON.name);
  const isAdmin = tritonProfile.isAdmin;

  return (
    <>
      <StyledExportButton onClick={() => setShowSkillModal(true)} styles={{}}>Add Skill </StyledExportButton>
      <Modal open={showSkillModal}>
        <>
          <SkillEntryFormModal
            closeModal={() => setShowSkillModal(false)}
            taskQueues={taskQueues}
            applications={applications}
            timeOfDays={timeOfDays}
          />
        </>
      </Modal>
    </>
  );
};

export default SkillEntryButton;