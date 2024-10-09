import React, { useState } from "react";
import { StyledButton } from "components/StyledButton";
import {
  useAdminState,
  useSkillState,
  useSkillDispatch
} from "context/appContext";
import {
  FormRow,
  ModalContainer,
  ScrollingPaper,
  ButtonWrapper,
  CenteredDiv,
  SkillsDetailWrapper,
  DeleteMessageWrapper
} from "../Skills.Styles";
import { timeouts } from "globals";
import { Divider } from "@mui/material";
import { formatErrorMessage } from "utils/_formatUtils";
import { logger } from "utils/logger";
import {
  getTargetExpression,
  identifyImpactedWorkers
} from "utils/skillsUtils";
import {
  ModalOverlayStatuses, UMUser
} from "globals/interfaces";
import { ModalOverlay } from "components/core/ModalOverlay/ModalOverlay";
import { deleteSkills } from "services/skill";
import {
  updateUser
} from "services/user";

export const DeleteForm = (props: any) => {
  const {
    closeModal, tableState, setAction, setTableState
  } = props;

  const skillState = useSkillState();
  const skillDispatch = useSkillDispatch();

  const state = useAdminState();
  const {
    nNumber, tokens
  } = state.userContext;
  const taskQueues = skillState.taskQueues;
  const formattedSkills = tableState.selected.map((sk: any) => ({
    name: sk,
    targetWorkers: getTargetExpression(sk),
    matchingQueue: taskQueues.find(tq => tq.target_workers.includes(getTargetExpression(sk))) || {} //Filter?
  }));
  const [ shouldDeleteQueue, setShouldDeleteQueue ] = useState(false);
  const [ impactedWorkers, setImpactedWorkers ] = useState(identifyImpactedWorkers(state.workerContext.workers, formattedSkills));
  const [ saveResult, setSaveResult ] = useState<any>({
    status: null,
    message: null
  });

  React.useEffect(() => {
    setImpactedWorkers(identifyImpactedWorkers(state.workerContext.workers, formattedSkills));
  },[state.workerContext.workers]);

  const handleDeleteSkills = async () => {
    setSaveResult({
      message: "Processing...",
      status: ModalOverlayStatuses.SAVING
    });

    try {
      const userResults = await Promise.allSettled(impactedWorkers.map((user: Partial<UMUser>) => updateUser(user.sid, { attributes: user.attributes })));
      logger.info("Worker Deletion Results", { userResults });

      const skillsRequestPayload = formattedSkills.map((s: any) => ({
        skill: s.name,
        taskQueueSid: s.matchingQueue.sid,
        taskQueueName: s.matchingQueue.friendly_name,
        deleteQueues: shouldDeleteQueue,
        updatedBy: nNumber
      }));
      const results = await deleteSkills(tokens, skillsRequestPayload, skillDispatch);
      logger.info("Skill Deletion Results", { results });

      const totalResults = [...results, ...userResults.map((r: any, i: number) => (
        r.status === "rejected" ? {
          ...r,
          reason: [<div key={`${i} - userError`}><h2 style={{ fontWeight: "bold" }}>Error Removing Skill from Twilio Worker</h2> - {formatErrorMessage(r.reason)}</div>]
        } : r))];

      if(totalResults.every((r: any) => r.status === "fulfilled" && r.value.status === 200)){
        logger.info("Successfully deleted all skills", {
          skills: formattedSkills.map((sk: any) => sk.name),
          taskQueuesDeleted: shouldDeleteQueue ? formattedSkills.map((sk: any) => sk.taskQueue?.friendly_name) : "TaskQueue deletion bypassed",
          nNumber
        });

        setSaveResult({
          message: "Skills Successfully Deleted",
          status: ModalOverlayStatuses.SUCCESS
        });

        setTimeout(() => {
          closeModal();
          setAction(null);
          setTableState((prevState: any) => ({
            ...prevState,
            selected: []
          }));
        }, timeouts.MODAL_OVERLAY);
      } else {
        const successfullyDeletedSkills = totalResults.filter((r: any) => r.status === "fulfilled" && r.value.status === 200);
        const errorMessages: any[] = [];
        totalResults.filter((r: any) => !(r.status === "fulfilled" && r.value.status === 200)).forEach((r: any) => {
          if(r.value?.messages && r.value.messages[0]){
            r.value.messages.forEach((v: string) => {
              const splitMessage = formatErrorMessage(v).split("-");
              errorMessages.push({ reason: [<DeleteMessageWrapper key={splitMessage[0]}><h3 style={{ fontWeight: "bold" }}></h3><h4>{splitMessage[0]}</h4> - {splitMessage[1]}</DeleteMessageWrapper> ]});
            });
          } else if(r.reason?.messages && r.reason.messages[0]){
            r.reason.messages.forEach((v: string) => {
              const splitMessage = formatErrorMessage(v).split("-");
              errorMessages.push({ reason: [<DeleteMessageWrapper key={splitMessage[0]}><h3 style={{ fontWeight: "bold" }}></h3><h4>{splitMessage[0]}</h4> - {splitMessage[1]}</DeleteMessageWrapper> ]});
            });
          } else if(r.reason) {
            errorMessages.push({ reason: [JSON.stringify(r.reason)]});
          } else if(r.value) {
            errorMessages.push({ reason: [JSON.stringify(r.value)]});
          }
        });
        const final = {
          successfullyDeletedSkills,
          failedSkills: errorMessages
        };
        logger.error("Skills partially deleted", {
          ...final,
          nNumber
        });
        setTableState({
          ...tableState,
          selected: []
        });
        setSaveResult({
          message: errorMessages,
          status: ModalOverlayStatuses.PARTIAL_FAIL
        });
        logger.log("FAITH FAILED SKILLS", errorMessages);

      }
    } catch (error) {
      logger.error("Failed to delete skills", {
        nNumber,
        error
      });

      setSaveResult({
        message: `Failed to Delete Skills: ${formatErrorMessage(error)}`,
        status: ModalOverlayStatuses.FAIL
      });
    }
  };

  return (
    <ModalContainer>
      { (saveResult.status !== null && saveResult.status !== ModalOverlayStatuses.PARTIAL_FAIL) &&
          <ModalOverlay
            message={saveResult.message.toString()}
            status={saveResult.status}
            handleClose={closeModal}
          />
      }
      <ScrollingPaper>
        {saveResult.status === ModalOverlayStatuses.PARTIAL_FAIL ?
          <SkillsDetailWrapper>
            <FormRow>
              <h2>The following errors were thrown</h2>
            </FormRow>
            <table>
              {saveResult.message.map((result: any, index: number) => ((
                <>
                  {typeof result.reason === "object" ?
                    <div key={`${index}-row`}>
                      {result.reason.map((reason: string) => ((
                        <tr key={`${index}-row`}>
                          <td key={`${index}-reason`}><CenteredDiv>{reason}</CenteredDiv></td>
                        </tr>
                      )))
                      }
                    </div>
                    :
                    <tr key={`${index}-row`}>
                      <td><CenteredDiv>{result.reason}</CenteredDiv></td>
                    </tr>
                  }
                </>
              )))
              }
            </table>
            <ButtonWrapper>
              <StyledButton
                style={{ width: "300px" }}
                onClick={() => {
                  closeModal();
                  setAction(null);
                }} >Close</StyledButton>
            </ButtonWrapper>
          </SkillsDetailWrapper>
          :
          <>
            <CenteredDiv style={{ fontSize: "25px" }}>Delete Skills</CenteredDiv>
            <Divider/>
            {tableState.selected.length === 0 ?
              <SkillsDetailWrapper>
                <FormRow>
                  <h2>You must select skills from the skill table to perform skill deletions</h2>
                </FormRow>
              </SkillsDetailWrapper>
              :
              <SkillsDetailWrapper>
                <FormRow>
                  <h2>Please carefully review the below skills before confirming the deletion</h2>
                </FormRow>
                <FormRow>
                  <h4>These skills will also be removed from {impactedWorkers.length} workers that have this skill in either their default skills, routing skills & disabled skills</h4>
                </FormRow>
                {/* <FormRow>
                    //This will be implemented in a separate story when we take workflows into consideration
                  <Checkbox
                    onChange={(e: any) => setShouldDeleteQueue(e.target.checked)}
                    checked={shouldDeleteQueue}
                  />
                  <FlexColumn>
                    <h4 style={{ margin: 0 }}>By checking this box, all task queues with the matching targetWorkerExpression will be deleted along with the skill</h4>
                    <h4 style={{ margin: 0 }}>If you leave it unchecked, only the skill will be removed from Twilio & all applicable databases</h4>
                  </FlexColumn>
                </FormRow> */}
              </SkillsDetailWrapper>
            }
            <SkillsDetailWrapper>
              <table>
                <thead>
                  <tr>
                    <th>Skill</th>
                    <th>Target Expression</th>
                    <th>Matching Task Queue</th>
                  </tr>
                </thead>
                <tbody>
                  {formattedSkills.map((skill: any) => ((
                    <tr key={`${skill.name}-row`}>
                      <td key={`${skill.name}-name`}><CenteredDiv>{skill.name}</CenteredDiv></td>
                      <td key={`${skill.name}-exp`}><CenteredDiv>{skill.targetWorkers}</CenteredDiv></td>
                      <td key={`${skill.name}-exp`}><CenteredDiv>{skill.matchingQueue.friendly_name}</CenteredDiv></td>
                    </tr>
                  )))
                  }
                </tbody>
              </table>
            </SkillsDetailWrapper>
            <Divider/>
            <ButtonWrapper>
              <StyledButton
                style={{ width: "300px" }}
                onClick={() => {
                  closeModal();
                  setAction(null);
                }} >Cancel</StyledButton>
              {tableState.selected.length !== 0 &&
                  <StyledButton
                    onClick={handleDeleteSkills}
                    style={{ width: "300px" }}
                  >Delete Skills
                  </StyledButton>
              }
            </ButtonWrapper>
          </>
        }
      </ScrollingPaper>
    </ModalContainer>
  );
};