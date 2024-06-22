import React, { useState } from "react";
import { StyledButton } from "components/StyledButton";
import {
  useAdminState,
  useSkillState,
  useSkillDispatch,
  useAdminDispatch
} from "context/appContext";
import {
  skillActions
} from "context/reducers/skillReducer";
import {
  FormRow,
  ModalContainer,
  ScrollingPaper,
  ButtonWrapper,
  CenteredDiv,
  SkillsDetailWrapper
} from "../Skills.Styles";
import { timeouts } from "globals";
import {
  Checkbox,
  Divider
} from "@mui/material";
import {
  deleteSkill, loadConsolidatedSkills
} from "services/skill";
import { formatError } from "utils";
import { logger } from "utils/logger";
import {
  getTargetExpression,
  identifyImpactedWorkers
} from "utils/skillsUtils";
import {
  FlexColumn, ModalOverlayStatuses,
  UMUser
} from "globals/interfaces";
import { ModalOverlay } from "components/core/ModalOverlay/ModalOverlay";
import { TwilioQueue } from "../Skills.Interfaces";
import { getTaskQueues } from "services/taskQueues";
import {
  listUMUsers, updateUser
} from "services/user";
import { handleConcurrentCalls } from "usermanagement/processingUtils";

export const DeleteForm = (props: any) => {
  const {
    closeModal, tableState, setAction, setTableState
  } = props;

  const skillState = useSkillState();
  const skillDispatch = useSkillDispatch();

  const state = useAdminState();
  const adminDispatch = useAdminDispatch();
  const { nNumber } = state.userContext;
  const taskQueues = skillState.taskQueues;
  const formattedSkills = tableState.selected.map((sk: any) => ({
    name: sk.name,
    targetWorkers: getTargetExpression(sk.name),
    matchingQueue: taskQueues.find(tq => tq.target_workers === getTargetExpression(sk.name))|| {} //Filter?
  }));
  const [ shouldDeleteQueue, setShouldDeleteQueue ] = useState();
  const [ impactedWorkers, setImpactedWorkers ] = useState(identifyImpactedWorkers(state.workerContext.workers, formattedSkills));
  const [ saveResult, setSaveResult ] = useState<any>({
    status: null,
    message: null
  });

  React.useEffect(() => {
    setImpactedWorkers(identifyImpactedWorkers(state.workerContext.workers, formattedSkills));
  },[state.workerContext.workers]);

  const deleteSkills = async () => {

    const refreshState = async () => {
      const taskQueuesPromise: Promise<{data: TwilioQueue[]}> = shouldDeleteQueue ? getTaskQueues() : Promise.resolve();
      const usersPromise = impactedWorkers.length ? listUMUsers(adminDispatch) : Promise.resolve();

      const consolidatedSkillsPromise = loadConsolidatedSkills(skillDispatch);

      const [ taskQueueResults ] = await Promise.allSettled([taskQueuesPromise, consolidatedSkillsPromise, usersPromise]);

      if(shouldDeleteQueue && taskQueueResults.status === "fulfilled"){
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
      return;
    };

    setSaveResult({
      message: "Processing...",
      status: ModalOverlayStatuses.SAVING
    });

    try {
      const userResults = await Promise.allSettled(impactedWorkers.map((user: Partial<UMUser>) => updateUser(user.sid, { attributes: user.attributes })));
      console.log("Worker Deletion Results", userResults);

      const results = await handleConcurrentCalls(3, deleteSkill, formattedSkills, shouldDeleteQueue);
      console.log("Skill Deletion Results", results);

      const totalResults = [...results, ...userResults.map((r: any, i: number) => ({
        ...r,
        reason: [<div key={`${i} - userError`}><h2 style={{ fontWeight: "bold" }}>Error Removing Skill from Twilio Worker</h2> - {formatError(r.reason)}</div>]
      }))];

      console.log("Total Results", totalResults);

      if(totalResults.every((r: any) => r.status === "fulfilled")){
        logger.info("Successfully deleted all skills", {
          skills: formattedSkills.map((sk: any) => sk.name),
          taskQueuesDeleted: shouldDeleteQueue ? formattedSkills.map((sk: any) => sk.taskQueue?.friendly_name) : "TaskQueue deletion bypassed",
          nNumber
        });

        await refreshState();

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
        const successfullyDeletedSkills = totalResults.filter((r: any) => r.status === "fulfilled");
        const failedSkills = totalResults.filter((r: any) => r.status === "rejected");
        const final = {
          successfullyDeletedSkills,
          failedSkills
        };
        logger.error("Errors thrown deleted skills", {
          ...final,
          nNumber
        });
        await refreshState();
        setTableState({
          ...tableState,
          selected: []
        });
        setSaveResult({
          message: failedSkills,
          status: ModalOverlayStatuses.PARTIAL_FAIL
        });
      }
    } catch (error) {
      logger.error("Failed to delete skills", {
        nNumber,
        error
      });

      setSaveResult({
        message: "Request Failed",
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
              <thead>
                <tr>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {saveResult.message.map((result: any, index: number) => ((
                  <>
                    {typeof result.reason === "object" ?
                      <tr key={`${index}-row`}>
                        {result.reason.map((reason: string) => ((
                          <td key={`${index}-reason`}><CenteredDiv>{reason}</CenteredDiv></td>
                        )))
                        }
                      </tr>
                      :
                      <tr key={`${index}-row`}>
                        <td><CenteredDiv>{result.reason}</CenteredDiv></td>
                      </tr>
                    }
                  </>
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
                
                // Deleting Task Queues is more involved than it seemed. 
                Will discuss next steps with Kim before peeling code out. 
                Task Queues need to be taken out of a workflow

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
                  skillDispatch({
                    type: skillActions.RESET_FORM
                  });
                }} >Cancel</StyledButton>
              {tableState.selected.length !== 0 &&
                  <StyledButton
                    onClick={deleteSkills}
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