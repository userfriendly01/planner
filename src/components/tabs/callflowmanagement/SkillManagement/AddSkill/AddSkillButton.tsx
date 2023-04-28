
import { StyledExportButton } from "../Skills.Styles";
import { Modal } from "@mui/material";
import {
  useAdminState,
  SkillFormStateProvider
} from "context";
import { getAuthenticationProfileTemplates } from "authentication";
import React from "react";
import AddSkillModal from "./AddSkillModal";
import {
  getTaskQueues
} from "services";

// interface SkillForm {
//     skillName: string
//     skillNum: string,
//     taskQueueSid: string,
//     selectedTaskQueue: any,
//     profiles: string[],
//     vh_call_target: string,
//     vh_threshold: number | string,
//     // startTime: any | null,
//     // endTime: any | null,
//     selectedDays: number[] | any[]
//     sunday: any,
//     monday: any,
//     tuesday: any,
//     wednesday: any,
//     thursday: any,
//     friday: any,
//     saturday: any
// }

const AddSkillButton = (props: any) => {

  const [ taskQueues, setTaskQueues ] = React.useState([]);

  React.useEffect(() => {
    getTaskQueueOptions();
  }, []);


  const getTaskQueueOptions = async () => {
    const results = await getTaskQueues();
    console.log("RESULTS TASK QUEUES", results);
    setTaskQueues(results);
  };

  const defaultSaveResult: any = {
    status: null,
    message: null
  };

  //   const defaultSkillForm: SkillForm = {
  //     skillName: "",  // friendly name
  //     skillNum: "",
  //     taskQueueSid: "",
  //     selectedTaskQueue: null,
  //     profiles: [],
  //     vh_call_target: "",
  //     vh_threshold: 0,
  //     // startTime: null,
  //     // endTime: null,
  //     selectedDays: [],
  //     sunday: {
  //       startTime: "",
  //       endTime: ""
  //     },
  //     monday: {
  //       startTime: "",
  //       endTime: ""
  //     },
  //     tuesday: {
  //       startTime: "",
  //       endTime: ""
  //     },
  //     wednesday: {
  //       startTime: "",
  //       endTime: ""
  //     },
  //     thursday: {
  //       startTime: "",
  //       endTime: ""
  //     },
  //     friday: {
  //       startTime: "",
  //       endTime: ""
  //     },
  //     saturday: {
  //       startTime: "",
  //       endTime: ""
  //     }
  //   };

  const [ showSkillModal, setShowSkillModal ] = React.useState(false);
  const [saveResult, setSaveResult ] = React.useState(defaultSaveResult);
  //   const [ skillForm, setSkillForm ] = React.useState(defaultSkillForm);

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
            <AddSkillModal
              closeModal={() => setShowSkillModal(false)}
            //   skillForm={skillForm}
            //   setSkillForm={setSkillForm}
              saveResult={saveResult}
              taskQueues={taskQueues}
            />
          </>
        </Modal>
      </>
    </SkillFormStateProvider>

  );
};

export default AddSkillButton;