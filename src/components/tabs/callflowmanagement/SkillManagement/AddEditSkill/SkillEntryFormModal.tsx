import React from "react";
import styled from "styled-components";
import { CallflowSkillForm } from "callflowmanagement/CallflowSkillForm";
import { Dropdown } from "components/Dropdown";
import { CustomInput } from "components/CustomInput";
import { ModalOverlay } from "components/ModalOverlay";
import { PhoneNumberInput } from "components/PhoneNumberInput";
import { StyledButton } from "components/StyledButton";
import {
  useAdminState,
  useAdminDispatch,
  useSkillState,
  useSkillDispatch
} from "context/appContext";
import {
  skillActions
} from "context/reducers/skillReducer";
import {
  AddEditSkill,
  SkillFormState,
  SkillEntryFormModalProps
} from "../Skills.Interfaces";
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
  Box,
  Tab,
  Tabs
} from "@mui/material";
import {
  createSkill
} from "services/skill";
import { getConsolidatedSkills } from "services/skill";
import { logger } from "utils/logger";

const ModalContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 900px;
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
  const skFormDispatch = useSkillDispatch();
  const adminDispatch = useAdminDispatch();

  const state = useAdminState();
  const { nNumber } = state.userContext;
  const skills = skillState.skills;

  const [ selectedTab, setSelectedTab ] = React.useState(0);
  const invalidSkillFriendlyName = skills.find((skill: any) => skill.ctmSkillDisplayName === skillState.skillForm.skillFriendlyName) ? true : false;
  const invalidSkillNum = skills.find((skill: any) => skill.name === skillState.skillForm.skillNum) ? true : false;
  const invalidVhCallTarget = skillState.skillForm.vhCallTarget.e164.trim() !== "" && !skillState.skillForm.vhCallTarget.valid;
  const invalidVhThreshold = skillState.skillForm.vhThreshold.trim() !== "" && isNaN(parseInt(skillState.skillForm.vhThreshold));

  const areRequiredFieldsEmpty = () => {
    let hasEmptyValues = true;
    const emptyTimeOfDay = true;
    let emptyVhTimeOfDay;
    const {
      skillFriendlyName,
      skillNum,
      applicationId,
      taskQueueSid,
      profileIds,
      enableVirtualHold,
      vhCallTarget,
      vhThreshold,
      timeOfDays
    } = skillState.skillForm;

    hasEmptyValues = skillFriendlyName === "" || skillNum === "" || applicationId === null ||
      taskQueueSid === "" || !taskQueueSid || profileIds.length < 1;

    // emptyTimeOfDay = Object.values(timeOfDay.skill).filter((value: any) => !value || (value && value.toString().trim() === "")).length > 0;

    if (enableVirtualHold) {
      hasEmptyValues = hasEmptyValues || vhThreshold === "" || vhCallTarget.e164 === "";
      // emptyVhTimeOfDay = Object.values(timeOfDay.vh).filter((value: any) => !value || (value && value.toString().trim() === "")).length > 0;
    }

    if (hasEmptyValues || emptyTimeOfDay || emptyVhTimeOfDay) {
      return true;
    } else {
      return false;
    }
  };

  const addSkill = async () => {

    //   validate the skill info - replace with util function
    if (!isAdmin || areRequiredFieldsEmpty() || invalidSkillFriendlyName || invalidSkillNum || invalidVhCallTarget || invalidVhThreshold) {
      return;
    }

    const body: AddEditSkill = {
      skillFriendlyName: skillState.skillForm.skillFriendlyName,
      skillNum: skillState.skillForm.skillNum,
      profileIds: skillState.skillForm.profileIds,
      applicationId: skillState.skillForm.applicationId,
      taskQueueSid: skillState.skillForm.taskQueueSid,
      vhCallTarget: skillState.skillForm.enableVirtualHold ? skillState.skillForm.vhCallTarget.e164 : null,
      vhThreshold: skillState.skillForm.enableVirtualHold ? parseInt(skillState.skillForm.vhThreshold) : null,
      updatedBy: nNumber.toLowerCase(),
      timeOfDayIds: []//FAITH redo this
    };

    try {

      const response = await createSkill(body);

      if (response.status === 200) {
        logger.info(`Successfully created new skill ${skillState.skillForm.skillFriendlyName}`, {
          nNumber,
          skillFriendlyName: skillState.skillForm.skillFriendlyName,
          skillNum: skillState.skillForm.skillNum
        });

        setSaveResult({
          message: "Request Successfully Processed",
          status: ModalOverlayStatuses.SUCCESS
        });
        skFormDispatch({
          type: skillActions.RESET_FORM
        });
        await getConsolidatedSkills(adminDispatch);
        setTimeout(() => {
          closeModal();
          setSaveResult({
            message: "",
            status: null
          });
        }, timeouts.MODAL_OVERLAY);
      } else {
        logger.warn(`Partially created new skill ${skillState.skillForm.skillFriendlyName}`, {
          nNumber,
          skillFriendlyName: skillState.skillForm.skillFriendlyName,
          skillNum: skillState.skillForm.skillNum,
          error: response.data.result.message
        });

        // a partial success will return 206
        // meaning either the creation in contactmanager OR the callflow db was sucessful
        setSaveResult({
          message: response.data.result.message,
          status: ModalOverlayStatuses.PARTIAL_FAIL
        });
        skFormDispatch({
          type: skillActions.RESET_FORM
        });
        await getConsolidatedSkills(adminDispatch);

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
        <Box sx={{
          borderBottom: 1,
          borderColor: "divider"
        }}>
          <Tabs value={selectedTab}>
            <Tab label="General Skill Settings" onClick={() => setSelectedTab(0)} />
            <Tab label="Item Two" onClick={() => setSelectedTab(0)}/>
            <Tab label="Item Three" onClick={() => setSelectedTab(0)} />
          </Tabs>
        </Box>
        { selectedTab === 0 && <div>Basic Info</div>}
        { selectedTab === 0 && <div>Basic Info</div>}
        { selectedTab === 0 && <CallflowSkillForm/>}
        <ButtonWrapper>
          <StyledButton
            style={{ width: "200px" }}
            onClick={() => {
              closeModal();
              skFormDispatch({
                type: skillActions.RESET_FORM
              });
            }} >Cancel</StyledButton>
          <StyledButton
            onClick={addSkill}
            style={{ width: "200px" }}
            disabled={
              areRequiredFieldsEmpty() ||
              invalidSkillFriendlyName ||
              invalidSkillNum  ||
              invalidVhCallTarget ||
              invalidVhThreshold
            }
          >{skillState.skillForm.formMode === formModes.INSERT ? "Add " : "Update "}Skill</StyledButton>
        </ButtonWrapper>
      </ScrollingPaper>
    </ModalContainer>
  );
};

export default SkillEntryFormModal;