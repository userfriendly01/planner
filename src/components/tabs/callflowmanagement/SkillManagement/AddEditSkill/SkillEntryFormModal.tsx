import React from "react";
import styled from "styled-components";
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
  AddEditSkill,
  SkillEntryFormModalProps
} from "../Skills.Interfaces";
import {
  FormRow,
  SkillTabs
} from "../Skills.Styles";
import {
  formModes,
  timeouts
} from "globals";
import {
  FlexRow
} from "globals/interfaces";
import { ModalOverlayStatuses } from "globals/interfaces";
import {
  Paper,
  Tab,
  Divider
} from "@mui/material";
import {
  createSkill, loadConsolidatedSkills
} from "services/skill";
import { logger } from "utils/logger";
import {
  areVhFieldsValid, isSkillFormValid
} from "utils/skillsUtils";

const ModalContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 75%;
`;

const ScrollingPaper = styled(Paper)`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 400px;
  padding: 2%;
  position: relative;
  overflow-y: auto;
  max-height: 800px;
`;

const CenteredDiv = styled.div`
  align-self: center;
  margin: 10px;
`;

const ButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 8px;
  align-items: flex-end;
`;

const SkillEntryFormModal = (props: SkillEntryFormModalProps) => {
  const {
    closeModal, saveResult, setSaveResult, isAdmin
  } = props;

  const skillState = useSkillState();
  const skillDispatch = useSkillDispatch();

  const state = useAdminState();
  const { nNumber } = state.userContext;
  const skills = skillState.skills;

  const [ selectedTab, setSelectedTab ] = React.useState(0);
  const [ missingFields, setMissingFields ] = React.useState<string[]>([]);

  const addSkill = async () => {
    if(!isAdmin || !areVhFieldsValid(skillState.skillForm, setMissingFields)) {
      console.log("Fields arent valid... bish");
      return;
    } else {
      console.log("were validated!... dingleberry");
      return;
    }

    const body: AddEditSkill = {
      name: skillState.skillForm.name,
      profileIds: skillState.skillForm.profileIds,
      applicationId: skillState.skillForm.applicationId,
      taskQueueSid: skillState.skillForm.taskQueue.sid,
      vhCallTarget: skillState.skillForm.vhCallerId ? skillState.skillForm.vhCallerId.e164 : null,
      vhThreshold: skillState.skillForm.vhThreshold ? parseInt(skillState.skillForm.vhThreshold) : null,
      updatedBy: nNumber.toLowerCase(),
      timeOfDayIds: []//FAITH redo this
    };

    try {

      const response = await createSkill(body);

      if (response.status === 200) {
        logger.info(`Successfully created new skill ${skillState.skillForm.name}`, {
          nNumber,
          skillFriendlyName: skillState.skillForm.name,
          name: skillState.skillForm.name
        });

        setSaveResult({
          message: "Request Successfully Processed",
          status: ModalOverlayStatuses.SUCCESS
        });
        skillDispatch({
          type: skillActions.RESET_FORM
        });
        await loadConsolidatedSkills(skillDispatch);
        setTimeout(() => {
          closeModal();
          setSaveResult({
            message: "",
            status: null
          });
        }, timeouts.MODAL_OVERLAY);
      } else {
        logger.warn(`Partially created new skill ${skillState.skillForm.name}`, {
          nNumber,
          skillFriendlyName: skillState.skillForm.name,
          name: skillState.skillForm.name,
          error: response.data.result.message
        });

        // a partial success will return 206
        // meaning either the creation in contactmanager OR the callflow db was sucessful
        setSaveResult({
          message: response.data.result.message,
          status: ModalOverlayStatuses.PARTIAL_FAIL
        });
        skillDispatch({
          type: skillActions.RESET_FORM
        });
        await loadConsolidatedSkills(skillDispatch);

      }
    } catch (error) {
      logger.error("Error when adding Skill", {
        error,
        nNumber,
        skill: body
      });
      setSaveResult({
        message: `Request Failed: ${error.message}`,
        status: ModalOverlayStatuses.FAIL
      });
    }
  };

  return (
    <ModalContainer>
      <ScrollingPaper>
        { saveResult.status !== null &&
          <ModalOverlay
            message={saveResult.message}
            status={saveResult.status}
            handleClose={closeModal}
          />
        }
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
      </ScrollingPaper>
    </ModalContainer>
  );
};

export default SkillEntryFormModal;