import React from "react";
import { CallflowSkillForm } from "callflowmanagement/CallflowSkillForm";
import { GeneralSkillForm } from "callflowmanagement/GeneralSkillForm";
import { ModalOverlay } from "components/ModalOverlay";
import { StyledButton } from "components/StyledButton";
import {
  useAdminState,
  useSkillState,
  useSkillDispatch
} from "context/appContext";
import {
  skillActions
} from "context/reducers/skillReducer";
import {
  FormRow,
  SkillTabs,
  SkillsDetailWrapper,
  ModalContainer,
  ScrollingPaper,
  CenteredDiv,
  ButtonWrapper
} from "../Skills.Styles";
import {
  formModes,
  timeouts
} from "globals";
import { ModalOverlayStatuses } from "globals/interfaces";
import {
  Tab,
  Divider
} from "@mui/material";
import {
  createSkill, loadConsolidatedSkills
} from "services/skill";
import { getTaskQueues } from "services/taskQueues";
import { logger } from "utils/logger";
import {
  areVhFieldsValid, isSkillFormValid
} from "utils/skillsUtils";
import { TwilioQueue } from "../Skills.Interfaces";


export const AddEditForm = (props: any) => {
  const {
    closeModal, setAction
  } = props;

  const skillState = useSkillState();
  const skillDispatch = useSkillDispatch();

  const state = useAdminState();
  const { nNumber } = state.userContext;
  const skills = skillState.skills;

  const [ selectedTab, setSelectedTab ] = React.useState(0);
  const [ missingFields, setMissingFields ] = React.useState<string[]>([]);

  const [ saveResult, setSaveResult ] = React.useState<any>({
    status: null,
    message: null
  });

  const addSkill = async () => {

    const refreshState = async () => {
      const reloadTaskQueues = skillState.skillForm.taskQueue.isNew;
      const taskQueuesPromise: Promise<{data: TwilioQueue[]}> = reloadTaskQueues ? getTaskQueues() : Promise.resolve();
      const consolidatedSkillsPromise = loadConsolidatedSkills(skillDispatch);

      const [ taskQueueResults ] = await Promise.allSettled([taskQueuesPromise, consolidatedSkillsPromise]);

      if(reloadTaskQueues && taskQueueResults.status === "fulfilled"){
        skillDispatch({
          type: "LOAD_SKILL_OPTIONS",
          payload: {
            applications: skillState.applications,
            timeOfDays: skillState.timeOfDays,
            taskQueues: taskQueueResults.value.data,
            operatingUnits: skillState.operatingUnits
          }
        });
      }
    };

    if(!areVhFieldsValid(skillState.skillForm, setMissingFields)) {
      return;
    }

    setSaveResult({
      message: "Processing...",
      status: ModalOverlayStatuses.SAVING
    });

    try {
      const response = await createSkill(skillState.skillForm, nNumber);

      if (response.status === 200) {
        logger.info(`Successfully created new skill ${skillState.skillForm.name}`, {
          nNumber,
          skillFriendlyName: skillState.skillForm.taskQueue.friendly_name,
          name: skillState.skillForm.name
        });

        setSaveResult({
          message: "Skill Successfully Created",
          status: ModalOverlayStatuses.SUCCESS
        });

        skillDispatch({
          type: skillActions.RESET_FORM
        });

        await refreshState();

        setTimeout(() => {
          closeModal();
          setAction(null);
          setSaveResult({
            message: "",
            status: null
          });
        }, timeouts.MODAL_OVERLAY);
      } else {
        logger.warn(`Partially created new skill ${skillState.skillForm.name}`, {
          nNumber,
          skillFriendlyName: skillState.skillForm.taskQueue.friendly_name,
          name: skillState.skillForm.name,
          errors: response.messages
        });

        setSaveResult({
          message: response.messages,
          status: ModalOverlayStatuses.PARTIAL_FAIL
        });
        skillDispatch({
          type: skillActions.RESET_FORM
        });

        refreshState();
      }
    } catch (error) {
      logger.error("Error when adding Skill", {
        error,
        nNumber,
        skill: skillState.skillForm.name
      });
      setSaveResult({
        message: `Failed to Create Skill: ${error.message.toString()}`,
        status: ModalOverlayStatuses.FAIL
      });
    }
  };

  return (
    <ModalContainer>
      <ScrollingPaper>
        { saveResult.status !== null && saveResult.status !== ModalOverlayStatuses.PARTIAL_FAIL &&
          <ModalOverlay
            message={saveResult.message}
            status={saveResult.status}
            handleClose={closeModal}
          />
        }
        {saveResult.status === ModalOverlayStatuses.PARTIAL_FAIL ?
          <SkillsDetailWrapper>
            <FormRow>
              <h2>The following errors were thrown</h2>
            </FormRow>
            <table>
              <thead>
                <tr>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {saveResult.message.map((result: any, index: number) => ((
                  <tr key={`${index}-row`}>
                    <td><CenteredDiv>{result}</CenteredDiv></td>
                  </tr>
                )))
                }
              </tbody>
            </table>
            <ButtonWrapper>
              <StyledButton
                style={{ width: "300px" }}
                onClick={() => {
                  closeModal();
                  setAction(null);
                  skillDispatch({
                    type: skillActions.RESET_FORM
                  });
                }} >Close</StyledButton>
            </ButtonWrapper>
          </SkillsDetailWrapper>
          :
          <>
            <CenteredDiv style={{ fontSize: "25px" }}>Add Skill</CenteredDiv>
            <SkillTabs value={selectedTab}>
              <Tab label="General Skill Settings" onClick={() => setSelectedTab(0)} />
              <Tab label="Dynamic Routing" onClick={() => setSelectedTab(1)}/>
              <Tab label="Legacy Callflow Database" onClick={() => setSelectedTab(2)} />
            </SkillTabs>
            <Divider/>
            { selectedTab === 0 && <GeneralSkillForm/>}
            { selectedTab === 1 && <FormRow>Dynamic Routing will be migrated over to use this skill in a future sprint</FormRow>}
            { selectedTab === 2 && <CallflowSkillForm missingFields={missingFields}/>}
            <Divider/>
            <div style={{
              textAlign: "center",
              margin: "10px"
            }}>Please review all tabs for required * fields</div>
            <ButtonWrapper>
              <StyledButton
                style={{ width: "200px" }}
                onClick={() => {
                  closeModal();
                  skillDispatch({
                    type: skillActions.RESET_FORM
                  });
                }} >Cancel</StyledButton>
              <StyledButton
                onClick={addSkill}
                style={{ width: "200px" }}
                disabled={!isSkillFormValid(skills, skillState.skillForm)}
              >{skillState.skillForm.formMode === formModes.INSERT ? "Add " : "Update "}Skill</StyledButton>
            </ButtonWrapper>
          </>
        }
      </ScrollingPaper>
    </ModalContainer>
  );
};