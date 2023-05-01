
import { StyledExportButton } from "../Skills.Styles";
import { Modal } from "@mui/material";
import {
  useAdminState,
  SkillFormStateProvider
} from "context";
import { getAuthenticationProfileTemplates } from "authentication";
import React from "react";
import SkillEntryFormModal from "./SkillEntryFormModal";
import {
  getTaskQueues,
  getApplications,
  getTimeOfDays
} from "services";


const SkillEntryButton = (props: any) => {

  const [ taskQueues, setTaskQueues ] = React.useState([]);
  const [ applications, setApplications ] = React.useState([]);
  const [ timeOfDays, setTimeOfDays ] = React.useState([]);

  React.useEffect(() => {
    getTaskQueueOptions();
    getApplicationOptions();
    getTimeOfDaysOptions();
  }, []);


  const getTaskQueueOptions = async () => {
    const results = await getTaskQueues();
    console.log("RESULTS TASK QUEUES", results);
    setTaskQueues(results);
  };

  const getApplicationOptions = async () => {
    const results = await getApplications();
    console.log("RESULTS FOR GET APPLICATIONS", results);
    setApplications(results);
  };

  const getTimeOfDaysOptions = async () => {
    const results = await getTimeOfDays();
    console.log("RESULTS FOR GET APPLICATIONS", results);
    setTimeOfDays(results);
  };

  const defaultSaveResult: any = {
    status: null,
    message: null
  };

  const [ showSkillModal, setShowSkillModal ] = React.useState(false);
  const [saveResult, setSaveResult ] = React.useState(defaultSaveResult);

  const state = useAdminState();
  const tritonProfile = state.userContext.authenticationProfiles.find((p: any) => p.name === getAuthenticationProfileTemplates().TRITON.name);
  const isAdmin = tritonProfile.isAdmin;


  const addSkill = () => {
    //   check that user is admin
    //   validate the skill info
    //   ADD THE SKILL
    // set save result
  };

  return (
    <SkillFormStateProvider>
      <>
        <StyledExportButton onClick={() => setShowSkillModal(true)} styles={{}}>Add Skill </StyledExportButton>
        <Modal open={showSkillModal}>
          <>
            <SkillEntryFormModal
              closeModal={() => setShowSkillModal(false)}
              saveResult={saveResult}
              taskQueues={taskQueues}
              applications={applications}
              timeOfDays={timeOfDays}
            />
          </>
        </Modal>
      </>
    </SkillFormStateProvider>

  );
};

export default SkillEntryButton;