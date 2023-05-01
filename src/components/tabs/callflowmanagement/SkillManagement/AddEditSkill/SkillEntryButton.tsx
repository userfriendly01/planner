
import { StyledExportButton } from "../Skills.Styles";
import { Modal } from "@mui/material";
import {
  useAdminState,
  SkillFormStateProvider,
  skillFormDispatch,
  skillFormActions,
  skillFormState
} from "context";
import { getAuthenticationProfileTemplates } from "authentication";
import React from "react";
import SkillEntryFormModal from "./SkillEntryFormModal";
import {
  getTaskQueues,
  getApplications,
  getTimeOfDays
} from "services";
import { SkillFormState } from "./SkillEntryForm.Interfaces";


const SkillEntryButton = (props: any) => {

  const { formMode } = props;

  const [ taskQueues, setTaskQueues ] = React.useState([]);
  const [ applications, setApplications ] = React.useState([]);
  const [ timeOfDays, setTimeOfDays ] = React.useState([]);

  const skFormState: SkillFormState = skillFormState();

  React.useEffect(() => {
    getTaskQueueOptions();
    getApplicationOptions();
    getTimeOfDaysOptions();

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
    //   check that user is admin?
    //   validate the skill info
    //   ADD THE SKILL
    // set save result

    const body = {
      skillFriendlyName: skFormState.skillFriendlyName,
      skillNum: skFormState.skillNum,
      applicationId: skFormState.applicationId,
      taskQueueSid: skFormState.taskQueue,
      vhCallTarget: skFormState.vhCallTarget.e164,
      vhThreshold: skFormState.vhThreshold,
      timeOfDayIds: {
        1: skFormState.timeOfDay.sunday,
        2: skFormState.timeOfDay.monday,
        3: skFormState.timeOfDay.tuesday,
        4: skFormState.timeOfDay.wednesday,
        5: skFormState.timeOfDay.thursday,
        6: skFormState.timeOfDay.friday,
        7: skFormState.timeOfDay.saturday
      }
    };
  };

  return (
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
  );
};

export default SkillEntryButton;