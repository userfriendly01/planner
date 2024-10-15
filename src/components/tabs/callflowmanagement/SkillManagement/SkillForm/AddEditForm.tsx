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
  createSkill, updateSkill
} from "services/skill";
import { logger } from "utils/logger";
import {
  areVhFieldsValid, getSkillFormChanges, isSkillFormValid
} from "utils/skillsUtils";
import {
  ActionTypes, Skill, TwilioQueue
} from "../Skills.Interfaces";
import { formatErrorMessage } from "utils/_formatUtils";


export const AddEditForm = (props: any) => {
  const {
    action,
    tableState,
    closeModal,
    setAction
  } = props;

  const skillState = useSkillState();
  const skillDispatch = useSkillDispatch();

  const state = useAdminState();
  const {
    nNumber, tokens
  } = state.userContext;
  const skills = skillState.skills;
  const taskQueues = skillState.taskQueues;

  const [ changes, setChanges ] = React.useState({});
  const [ selectedTab, setSelectedTab ] = React.useState(0);
  const [ missingFields, setMissingFields ] = React.useState<string[]>([]);

  const [ saveResult, setSaveResult ] = React.useState<any>({
    status: null,
    message: null
  });

  React.useEffect(() => {
    if(action === ActionTypes.EDIT && tableState.selected.length === 1){
      const skill = skills.find((s: Skill) => s.name === tableState.selected[0]);
      skillDispatch({
        type: skillActions.SET_UPDATE_SKILL_FORM,
        payload: {
          skill,
          taskQueue: taskQueues.find((t: TwilioQueue) => t.sid === skill?.taskQueueSid)
        }
      });
    }
  }, []);

  React.useEffect(() => {
    if(skillState.skillForm.formMode === formModes.UPDATE){
      const originalSkill = skills.find((s: Skill) => s.name === tableState.selected[0]);
      setChanges(getSkillFormChanges(originalSkill, skillState.skillForm));
    }
  }, [skillState.skillForm]);


  const handleOnSave = async () => {
    const isAdd = skillState.skillForm.formMode === formModes.INSERT;

    if(!areVhFieldsValid(skillState.skillForm, setMissingFields)) {
      return;
    }

    setSaveResult({
      message: "Processing...",
      status: ModalOverlayStatuses.SAVING
    });

    try {
      let response;
      if(isAdd){
        response = await createSkill(tokens, {
          skills: skillState.skills,
          skillForm: skillState.skillForm,
          updatedBy: nNumber
        }, skillDispatch);
      } else {
        response = await updateSkill(tokens, {
          skillName: skillState.skillForm.name,
          skills: skillState.skills,
          changes: changes,
          updatedBy: nNumber
        }, skillDispatch);
      }

      if (response.status === 200) {
        logger.info(`Successfully ${isAdd ? "created" : "updated"} new skill ${skillState.skillForm.name}`, {
          nNumber,
          skillFriendlyName: skillState.skillForm.taskQueue.friendly_name,
          name: skillState.skillForm.name
        });

        setSaveResult({
          message: `Skill Successfully ${isAdd ? "Created" : "Updated"}`,
          status: ModalOverlayStatuses.SUCCESS
        });

        skillDispatch({
          type: skillActions.RESET_FORM
        });
        setTimeout(() => {
          closeModal();
          setAction(null);
          setSaveResult({
            message: "",
            status: null
          });
        }, timeouts.MODAL_OVERLAY);
      } else {
        logger.warn(`Partially ${isAdd ? "created" : "updated"} new skill ${skillState.skillForm.name}`, {
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
      }
    } catch (error) {
      logger.error(`Error when ${isAdd ? "creating" : "updating"} Skill`, {
        error,
        nNumber,
        skill: skillState.skillForm.name
      });
      setSaveResult({
        message: `Failed to ${isAdd ? "Create" : "Update"} Skill: ${formatErrorMessage(error)}`,
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
            <h2>The following errors were thrown</h2>
            <table style={{ textAlign: "center" }}>
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
                <p>Refresh Triton to see your partial skill</p>
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
            { action === ActionTypes.EDIT && tableState.selected.length !== 1 ?
              <SkillsDetailWrapper>
                A single skill must be selected from the table to edit
                <ButtonWrapper>
                  <StyledButton
                    style={{ width: "200px" }}
                    onClick={() => {
                      closeModal();
                      skillDispatch({
                        type: skillActions.RESET_FORM
                      });
                    }} >Close</StyledButton>
                </ButtonWrapper>
              </SkillsDetailWrapper>
              :
              <>
                <CenteredDiv style={{ fontSize: "25px" }}>{skillState.skillForm.formMode === formModes.INSERT ? "Add Skill" : "Edit Skill"}</CenteredDiv>
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
                    onClick={handleOnSave}
                    style={{ width: "200px" }}
                    disabled={!isSkillFormValid(skills, skillState.skillForm, changes)}
                  >{skillState.skillForm.formMode === formModes.INSERT ? "Add " : "Update "}Skill</StyledButton>
                </ButtonWrapper>
              </>
            }

          </>
        }
      </ScrollingPaper>
    </ModalContainer>
  );
};