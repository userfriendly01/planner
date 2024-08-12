import { apiPaths } from "globals";
import React from "react";
import { myAxios } from "utils/myAxios";
import { apolloClient } from "../components/core/Auth/SharedGraphAPIProvider";
import { logger } from "utils/logger";
import { formatErrorMessage } from "utils/_formatUtils";
import { getTaskQueues } from "services/taskQueues";
import {
  Application, Skill, TwilioSkill, CallflowSkill,
  TimeOfDay, TwilioQueue, SkillFormState,
  UMSkill,
  SkillGroup,
  SkillGroupSkillShip,
  SkillState
} from "callflowmanagement/SkillManagement/Skills.Interfaces";
import {
  Action, OperatingUnit
} from "globals/interfaces";
import { getOperatingUnits } from "services/operatingUnits";
import { getTargetExpression } from "utils/skillsUtils";
import {
  CREATE_SKILL, DELETE_SKILL, getUMSkills,
  UPDATE_SKILL,
  UPDATE_SKILL_RELATIONSHIPS
} from "globals/skill";

export const createSkill = async (skillState: SkillState, updatedBy: string): Promise<any> => {
  const skillForm = skillState.skillForm;
  const messages: string[] = [];
  let taskQueueSid = skillForm.taskQueue.sid;
  const taskQueueName = skillForm.taskQueue.friendly_name;
  if(skillForm.taskQueue.isNew){
    const newTaskQueuebody = {
      targetWorkers: getTargetExpression(skillForm.name),
      operatingUnitSid: skillForm.taskQueue.operating_unit_sid,
      friendlyName: skillForm.taskQueue.friendly_name
    };

    try {
      const res = await myAxios.post(apiPaths.TASK_QUEUES, newTaskQueuebody);
      taskQueueSid = res.data.data.sid;
    } catch(error){
      const message = `Task Queue failed to create: ${formatErrorMessage(error)}`;
      logger.error(message, error);
      messages.push(message);
    }
  }

  try {
    const newGraphSkillBody: any = {
      skill_id: skillForm.name,
      task_queue_sid: taskQueueSid,
      task_queue_name: taskQueueName
    };
    if(skillForm.levels?.min?.value && skillForm.levels?.max?.value){
      const levels = [];
      for (let i = skillForm.levels.min.value; i <= skillForm.levels.max.value; i++) {
        levels.push(i);
      }
      newGraphSkillBody.levels = levels;
    } else {
      newGraphSkillBody.levels = null;
    }

    const { errors }  = await apolloClient.mutate<{ skill: UMSkill }>({
      mutation: CREATE_SKILL,
      variables: {
        input: newGraphSkillBody
      }
    });

    if (errors?.length) {
      throw errors;
    }

    const profileResponse = await Promise.allSettled(skillForm.profileIds.map(((id: number) => {
      const skillsOnProfile: string[] = skillState.skills.filter((s: Skill) => s.profileIds?.includes(id)).map((s: Skill) => s.name);
      return apolloClient.mutate<{ updateUMSoftphoneConfigSkills: any }>({
        mutation: UPDATE_SKILL_RELATIONSHIPS,
        variables: {
          profile_id: id,
          input: { skill_ids: [...skillsOnProfile, skillForm.name]}
        }
      });
    })));

    if(!profileResponse.every((r: any) => r.status === "fulfilled")){
      const failedResponses = profileResponse.filter((r: any) => r.status === "rejected").map((r: any) => r.reason);
      const message = `Graph threw an error creating skill/profile relationships: ${formatErrorMessage(failedResponses)}`;
      console.error(message, profileResponse);
      messages.push(message);
    }

  } catch(error){
    const message = `Graph failed to create skill: ${formatErrorMessage(error)}`;
    console.error(message, error);
    messages.push(message);
  }

  try {
    const newFlexSkillBody: any = { name: skillForm.name };
    if(skillForm.levels.min && skillForm.levels.max){
      newFlexSkillBody.multivalue = true;
      newFlexSkillBody.minimum = skillForm.levels.min.value;
      newFlexSkillBody.maximum = skillForm.levels.max.value;
    }
    await myAxios.post(apiPaths.SKILLS_TASKROUTER, newFlexSkillBody);
  } catch(error){
    const message = `Flex skill failed to create: ${formatErrorMessage(error)}`;
    logger.error(message, error);
    messages.push(message);
  }

  try {
    const newCallflowSkillBody: any = {
      skillNme: skillForm.name,
      application_id: skillForm.applicationId,
      vh_threshold_tme: skillForm.vhThreshold || null,
      vh_call_target: skillForm.vhCallTarget || null,
      updatedBy,
      timeOfDays: skillForm.timeOfDays
    };

    await myAxios.post(apiPaths.SKILLS_CALLFLOW, newCallflowSkillBody);
  } catch(error){
    const message = `Callflow database failed to create skill: ${formatErrorMessage(error)}`;
    console.error(message, error);
    messages.push(message);
  }

  if(messages.length === 0){
    return {
      status: 200
    };
  } else if(messages.length < 4){
    return {
      status: 206,
      messages
    };
  } else {
    return {
      status: 500,
      messages
    };
  }
};

export const editSkill = async (changes: Partial<SkillFormState>, skillState: SkillState, updatedBy: string): Promise<any> => {
  const messages: string[] = [];
  const changesInclude = (change: any[]) => change.some((c: any) => c !== undefined);
  let updateCount = 0;
  const skillName = skillState.skillForm.name;

  let taskQueueSid = changes.taskQueue?.sid;
  const taskQueueName = changes.taskQueue?.friendly_name;

  if(changesInclude([changes.taskQueue ]) && changes.taskQueue?.isNew){
    const newTaskQueuebody = {
      targetWorkers: getTargetExpression(skillState.skillForm.name),
      operatingUnitSid: changes.taskQueue.operating_unit_sid,
      friendlyName: changes.taskQueue.friendly_name
    };

    try {
      updateCount ++;
      const res = await myAxios.post(apiPaths.TASK_QUEUES, newTaskQueuebody);
      taskQueueSid = res.data.data.sid;
    } catch(error){
      const message = `Task Queue failed to create: ${formatErrorMessage(error)}`;
      logger.error(message, error);
      messages.push(message);
    }
  }

  if(changesInclude([changes.taskQueue, changes.levels])){
    try {
      updateCount ++;
      const updateGraphSkillBody: any = {};
      console.log("whats dis", taskQueueSid);
      updateGraphSkillBody.task_queue_sid = taskQueueSid,
      updateGraphSkillBody.task_queue_name = taskQueueName;
      if(changes.levels?.min.value && changes.levels?.max.value){
        const levels = [];
        for (let i = changes.levels.min.value; i <= changes.levels.max.value; i++) {
          levels.push(i);
        }
        updateGraphSkillBody.levels = levels;
      } else {
        updateGraphSkillBody.levels = null;
      }

      const { errors }  = await apolloClient.mutate<{ skill: any }>({
        mutation: UPDATE_SKILL,
        variables: {
          skill_id: skillName,
          input: updateGraphSkillBody
        }
      });

      if (errors?.length) {
        const combinedErrors = errors.slice();
        const nullSkill = errors.some((e: any) => e.message.includes("Record does not exist"));
        if(nullSkill){
          const { errors: createErrors }  = await apolloClient.mutate<{ skill: UMSkill }>({
            mutation: CREATE_SKILL,
            variables: {
              input: {
                ...updateGraphSkillBody,
                skill_id: skillName
              }
            }
          });
          if (createErrors?.length) {
            createErrors.forEach((e:any) => combinedErrors.push(e));
            throw combinedErrors;
          }
        } else {
          throw combinedErrors;
        }
      }


    } catch(error){
      const message = `Graph failed to update skill: ${formatErrorMessage(error)}`;
      console.error(message, error);
      messages.push(message);
    }
  }

  if(changesInclude([changes.profileIds])){
    updateCount ++;
    const existingSkill = skillState.skills.find((s: Skill) => s.name === skillName);
    const newProfiles: number[] = changes.profileIds?.filter((id: number) => !existingSkill.profileIds?.includes(id)) || [];
    const removedProfiles: number[] = existingSkill.profileIds?.filter((id: number) => !changes.profileIds?.includes(id)) || [];

    const newProfileResponse = await Promise.allSettled(newProfiles.map(((id: number) => {
      const skillsOnProfile: string[] = skillState.skills.filter((s: Skill) => s.profileIds?.includes(id)).map((s: Skill) => s.name);
      return apolloClient.mutate<{ updateUMSoftphoneConfigSkills: any }>({
        mutation: UPDATE_SKILL_RELATIONSHIPS,
        variables: {
          profile_id: id,
          input: { skill_ids: [...skillsOnProfile, skillName]}
        }
      });
    })));

    const removedProfileResponse = await Promise.allSettled(removedProfiles.map(((id: number) => {
      const skillsOnProfile: string[] = skillState.skills.filter((s: Skill) => s.profileIds?.includes(id)).map((s: Skill) => s.name);
      return apolloClient.mutate<{ updateUMSoftphoneConfigSkills: any }>({
        mutation: UPDATE_SKILL_RELATIONSHIPS,
        variables: {
          profile_id: id,
          input: { skill_ids: skillsOnProfile.filter((s: string) => s !== skillName ) }
        }
      });
    })));

    const profileResponse = [...newProfileResponse, ...removedProfileResponse];
    if(!profileResponse.every((r: any) => r.status === "fulfilled")){
      const failedResponses = profileResponse.filter((r: any) => r.status === "rejected").map((r: any) => r.reason);
      const message = `Graph threw an error updating skill/profile relationships: ${formatErrorMessage(failedResponses)}`;
      console.error(message, profileResponse);
      messages.push(message);
    }
  }

  if(changesInclude([changes.levels])){
    try {
      updateCount ++;
      const updateFlexSkillBody: any = {};
      if(changes.levels.min && changes.levels.max){
        updateFlexSkillBody.multivalue = true;
        updateFlexSkillBody.minimum = changes.levels.min.value;
        updateFlexSkillBody.maximum = changes.levels.max.value;
      } else {
        updateFlexSkillBody.multivalue = false;
        updateFlexSkillBody.minimum = null;
        updateFlexSkillBody.maximum = null;
      }
      await myAxios.put(`${apiPaths.SKILLS_TASKROUTER}/${skillName}`, updateFlexSkillBody);
    } catch(error){
      const message = `Flex skill failed to update: ${formatErrorMessage(error)}`;
      logger.error(message, error);
      messages.push(message);
    }
  }

  if(changesInclude([changes.applicationId, changes.timeOfDays, changes.vhCallTarget, changes.vhThreshold]) ){
    try {
      updateCount ++;
      const updateCallflowSkillBody: any = { updatedBy };
      if(changesInclude([changes.applicationId])){ updateCallflowSkillBody.application_id = changes.applicationId; }
      if(changesInclude([changes.vhThreshold])){ updateCallflowSkillBody.vh_threshold_tme = changes.vhThreshold; }
      if(changesInclude([changes.vhCallTarget])){ updateCallflowSkillBody.vh_call_target = changes.vhCallTarget; }
      if(changesInclude([changes.timeOfDays])){ updateCallflowSkillBody.timeOfDays = changes.timeOfDays; }

      await myAxios.put(`${apiPaths.SKILLS_CALLFLOW}/${skillName}`, updateCallflowSkillBody);
    } catch(error){
      const message = `Callflow database failed to update skill: ${formatErrorMessage(error)}`;
      console.error(message, error);
      messages.push(message);
    }
  }

  if(messages.length === 0){
    return {
      status: 200
    };
  } else if(messages.length < updateCount){
    return {
      status: 206,
      messages
    };
  } else {
    return {
      status: 500,
      messages
    };
  }
};

export const deleteSkill = async (skill: any, deleteQueues: boolean): Promise<any> => {
  const skillName = skill.name;
  let taskQueuePromise;

  if(!deleteQueues){
    taskQueuePromise = Promise.resolve("Task Queue Deletion Bypassed");
  } else if(!skill.matchingQueue.sid){
    taskQueuePromise = Promise.resolve("No Associated Task Queue");
  } else {
    taskQueuePromise = myAxios.delete(`${apiPaths.TASK_QUEUES}/${skill.matchingQueue.sid}`);
  }

  const taskRouterSkillPromise = myAxios.delete(`${apiPaths.SKILLS_TASKROUTER}/${skillName}`);
  const callflowSkillPromise = myAxios.delete(`${apiPaths.SKILLS_CALLFLOW}/${skillName}`);
  const graphSkillPromise = apolloClient.mutate<{ skill: any }>({
    mutation: DELETE_SKILL,
    variables: {
      skill_id: skillName
    }
  });

  const results = await Promise.allSettled([taskQueuePromise, taskRouterSkillPromise, callflowSkillPromise, graphSkillPromise]);

  logger.info("Delete Results", { results }, false);

  if(!results.every((r: any) => r.status === "fulfilled")){
    const is404 = (reason: any) => reason?.response?.data?.error?.error === "Not Found" ||
    reason?.response?.data?.error?.toString().includes("not found");

    const messages: any[] = [];

    results.forEach((r: any, index: number) => {
      const errorSource: string = (index === 0 && "Task Queue Deletion Error") ||
                          (index === 1 && "Flex Console Skill Deletion Error") ||
                          (index === 2 && "Callflow Database Skill Deletion Error") ||
                          (index === 3 && "Graph Skill Deletion Error");

      if(r.status === "rejected" && !is404(r.reason)){
        const taskQueueError = r.reason.response.data?.details?.toString().includes("400");
        if(index === 0 && taskQueueError){
          const message = `Twilio was unable to delete the task queue. Please try to delete ${skill.matchingQueue?.friendly_name} from the Twilio console manually`;
          messages.push(<div><h2 style={{ fontWeight: "bold" }}>{errorSource}: {skillName}</h2> - {message}</div>);
        } else {
          const message = formatErrorMessage(r.reason?.response?.data?.error) || formatErrorMessage(r.reason);
          messages.push(<div><h2 style={{ fontWeight: "bold" }}>{errorSource}: {skillName}</h2> - {message}</div>);
        }
      }
    });
    if(messages.length){
      return Promise.reject(messages);
    }
  }
  return;
};

export const loadSkillOptions = async (skills: Skill[], dispatch: (action: Action) => void, callback: () => void): Promise<void>=> {
  try {
    const timeOfDaysPromise: Promise<{data: TimeOfDay[]}> = myAxios.get(apiPaths.GET_TIME_OF_DAYS);
    const applicationsPromise: Promise<{data: Application[]}> = myAxios.get(apiPaths.GET_APPLICATIONS);
    const taskQueuesPromise: Promise<{data: TwilioQueue[]}> = getTaskQueues();
    const operatingUnitPromise: Promise<OperatingUnit[]> = getOperatingUnits();

    const [
      timeOfDaysResponse,
      applicationsResponse,
      taskQueuesResponse,
      operatingUnitResponse
    ] = await Promise.all([ timeOfDaysPromise, applicationsPromise, taskQueuesPromise, operatingUnitPromise]);

    const taskQueues = taskQueuesResponse.data;
    const timeOfDays = timeOfDaysResponse.data;
    const applications = applicationsResponse.data;
    const operatingUnits = operatingUnitResponse;

    const verifiedSkills = skills.map(skill => {
      const skillTargetExpression = `routing.skills HAS "${skill.name}"`;
      const expressionMatch = taskQueues.find(tq => tq.target_workers.includes(skillTargetExpression));
      if(!expressionMatch){
        skill.discrepancies.push(`Task Queue was not found with the expression ${skillTargetExpression}. (Case Sensitive)`);
      }else if(expressionMatch.sid !== skill.taskQueueSid){
        skill.discrepancies.push(`Task Queue in the graph ${skill.taskQueueName}: ${skill.taskQueueSid} does not match the task queue with the matching target expression ${skillTargetExpression}. (Case Sensitive)`);
      }
      return skill;
    });

    dispatch({
      type: "LOAD_SKILLS",
      payload: verifiedSkills
    });

    dispatch({
      type: "LOAD_SKILL_OPTIONS",
      payload: {
        applications,
        timeOfDays,
        taskQueues,
        operatingUnits
      }
    });

    callback();
  } catch(err){
    logger.error("Skill Options Failed to Load", err);
    throw("Skill Options Failed to Load - please refresh Triton and try again");
  }
};

const getTaskRouterSkills = (): Promise<{ data: TwilioSkill[] }> => {
  return myAxios.get(apiPaths.SKILLS_TASKROUTER);
};

const getCallflowSkills = (): Promise<{ data: CallflowSkill[] }> => {
  return myAxios.get(apiPaths.SKILLS_CALLFLOW);
};

const getGraphSkills = async (dispatch: (action: Action) => void): Promise<UMSkill[]> => {
  let skills: UMSkill[] = [];
  let skillProfiles: UMSkill[] = [];
  let skillGroups: SkillGroup[] = [];
  let skillGroupProfiles: SkillGroupSkillShip[] = [];

  const getPageResults = async (
    isFirstQuery: boolean,
    skillsNextToken?: string,
    skillProfilesNextToken?: string,
    skillGroupsNextToken? : string,
    skillGroupsProfilesNextToken? : string
  ): Promise<void> => {
    try {
      const {
        errors, data
      }: any = await apolloClient.query<{ results: any }>({
        query: getUMSkills(skillsNextToken, skillProfilesNextToken, skillGroupsNextToken, skillGroupsProfilesNextToken, isFirstQuery),
        variables: {}
      });

      if(errors?.length){
        throw errors;
      }

      const newSkills: UMSkill[] = data?.skills?.items.map((s: any) => ({
        ...s,
        profile_ids: [],
        skill_group_ids: []
      }));

      if(data?.skills?.items?.length) { skills = [...skills, ...newSkills]; }
      if(data?.skillProfiles?.items?.length) { skillProfiles = [...skillProfiles, ...data.skillProfiles.items]; }
      if(data?.skillGroups?.items?.length) { skillGroups = [...skillGroups, ...data.skillGroups.items]; }
      if(data?.skillGroupProfiles?.items?.length) { skillGroupProfiles = [...skillGroupProfiles, ...data.skillGroupProfiles.items]; }

      if(data?.skills?.nextToken || data?.skillProfiles?.nextToken){
        return getPageResults(false, data.skills.nextToken, data.skillProfiles.nextToken);
      } else {
        return;
      }
    } catch(error) {
      logger.error("Error thrown getting skills from the graph", error);
      throw error;
    }
  };

  await getPageResults(true, null, null, null, null);

  dispatch({
    type: "LOAD_SKILL_GROUPS",
    payload: skillGroups
  });

  skillProfiles.forEach((sp: UMSkill) => {
    try {
      const profileId = parseInt(sp.pk.split("#")[1]);
      const matchingSkill = skills.find((s: UMSkill) => s.skill_id === sp.skill_id);
      if(matchingSkill) {
        matchingSkill.profile_ids.push(profileId);
      } else {
        logger.warn("Graph returned a profile/skill relationship but the skill was not found", { record: sp }, true);
      }
    } catch(error){
      logger.error("Failed to format skill profile to skill", error);
    }
  });

  skillGroupProfiles.forEach((sgp: SkillGroupSkillShip) => {
    try {
      const skillGroupId = sgp.pk.split("#")[1];
      const matchingSkill = skills.find((s: UMSkill) => s.skill_id === sgp.skill_id);
      if(matchingSkill) {
        matchingSkill.skill_group_ids.push(skillGroupId);
      } else {
        logger.warn("Graph returned a profile/skill relationship but the skill was not found", { record: sgp }, true);
      }
    } catch(error){
      logger.error("Failed to format skill profile to skill", error);
    }
  });

  return skills;
};

export const loadConsolidatedSkills = async (dispatch: (action: Action) => void): Promise<void> => {
  try  {
    const taskRouterSkillsPromise = getTaskRouterSkills();
    const callflowSkillsPromise = getCallflowSkills();
    const graphSkillsPromise = getGraphSkills(dispatch);

    console.log("Faith do we get here?", graphSkillsPromise);
    const [
      taskRouterSkillsResponse,
      callflowSkillsResponse,
      graphSkillsResponse
    ] = await Promise.all([ taskRouterSkillsPromise, callflowSkillsPromise, graphSkillsPromise]);

    const consolidatedSkills: Partial<Skill>[] = [];

    const graphSkills = graphSkillsResponse.slice();
    let taskRouterSkills = taskRouterSkillsResponse.data.slice();
    let callflowSkills = callflowSkillsResponse.data.slice();

    graphSkills.map((graphSkill: UMSkill) => {

      let skill: Partial<Skill> = {
        discrepancies: graphSkill.profile_ids?.length ? [] : ["Skill exists in the graph but has no relationship to a profile"],
        name: graphSkill.skill_id,
        profileIds: graphSkill.profile_ids || [],
        skillGroupIds: graphSkill.skill_group_ids || [],
        taskQueueName: graphSkill.task_queue_name,
        taskQueueSid: graphSkill.task_queue_sid,
        levels: graphSkill.levels
      };

      const matchingCallFlowSkill = callflowSkills.find((cfSkill: CallflowSkill) => cfSkill.skillName === graphSkill.skill_id);
      const matchingTrSkill = taskRouterSkills.find((trSkill: TwilioSkill) => trSkill.name === graphSkill.skill_id);

      if(matchingCallFlowSkill){
        skill = {
          ...skill,
          ...matchingCallFlowSkill
        };
        callflowSkills = callflowSkills.filter(cfSkill => cfSkill.skillName !== skill.name);
      } else {
        skill.discrepancies.push(`${skill.name} is not in the Legacy Callflow Database`);
      }

      if(matchingTrSkill){
        taskRouterSkills = taskRouterSkills.filter(trSkill => trSkill.name !== skill.name);
      } else {
        skill.discrepancies.push(`${skill.name} is not in the Flex Console`);
      }

      consolidatedSkills.push(skill);
    });

    taskRouterSkills.map((trSkill: TwilioSkill) => {
      let skill: Partial<Skill> = {
        discrepancies: [
          `${trSkill.name} is not in the User Management Database`
        ],
        name: trSkill.name
      };

      const matchingCallFlowSkill = callflowSkills.find((cfSkill: CallflowSkill) => cfSkill.skillName === trSkill.name);
      if(matchingCallFlowSkill){
        skill = {
          ...skill,
          ...matchingCallFlowSkill
        };
        callflowSkills = callflowSkills.filter(cfSkill => cfSkill.skillName !== skill.name);
      } else {
        skill.discrepancies.push(`${skill.name} is not in the Legacy Callflow Database`);
      }
      consolidatedSkills.push(skill);
    });

    callflowSkills.map((cfSkill: CallflowSkill) => {
      const skill: Partial<Skill> = {
        discrepancies: [
          `${cfSkill.skillName} is not in the User Management Database`,
          `${cfSkill.skillName} is not in the Flex Console`
        ],
        name: cfSkill.skillName,
        ...cfSkill
      };
      delete skill.skillName;
      consolidatedSkills.push(skill);
    });

    dispatch({
      type: "LOAD_SKILLS",
      payload: consolidatedSkills
    });

  } catch(error) {
    logger.error("Failed to populate skill state", { error });
    throw {
      message: "Failed to populate skill state",
      error
    };
  }
};