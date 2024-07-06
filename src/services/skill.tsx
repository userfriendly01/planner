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
  SkillGroupSkillShip
} from "callflowmanagement/SkillManagement/Skills.Interfaces";
import {
  Action, OperatingUnit
} from "globals/interfaces";
import { getOperatingUnits } from "services/operatingUnits";
import { getTargetExpression } from "utils/skillsUtils";
import { getUMSkills } from "globals/graphql";

export const createSkill = async (skillForm: SkillFormState, updatedBy: string): Promise<any> => {
  const messages: string[] = [];
  let taskQueueSid = skillForm.taskQueue.sid;
  if(skillForm.taskQueue.isNew){
    const newTaskQueuebody = {
      targetWorkers: getTargetExpression(skillForm.name),
      operatingUnitSid: skillForm.taskQueue.operating_unit_sid,
      friendlyName: skillForm.taskQueue.friendly_name
    };

    try {
      const res = await myAxios.post(apiPaths.TASK_QUEUES, newTaskQueuebody);
      taskQueueSid = res.data.sid;
    } catch(error){
      const message = `Task Queue failed to create: ${formatErrorMessage(error)}`;
      logger.error(message, error);
      messages.push(message);
    }
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
      applicationId: skillForm.applicationId,
      vhThreshold: skillForm.vhThreshold || null,
      vhCallTarget: skillForm.vhCallTarget || null,
      updatedBy,
      timeOfDays: Object.values(skillForm.timeOfDays)
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
  } else if(messages.length < 3){
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

  const results = await Promise.allSettled([taskQueuePromise, taskRouterSkillPromise, callflowSkillPromise]);

  logger.info("Delete Results", { results }, false);

  if(!results.every((r: any) => r.status === "fulfilled")){
    const is404 = (reason: any) => reason?.response?.data?.error?.error === "Not Found" ||
    reason?.response?.data?.error?.toString().includes("not found");

    const messages: any[] = [];

    results.forEach((r: any, index: number) => {
      const errorSource: string = (index === 0 && "Task Queue Deletion Error") ||
                          (index === 1 && "Flex Console Skill Deletion Error") ||
                          (index === 2 && "Callflow Database Skill Deletion Error");

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
      const expressionFound = taskQueues.some(tq => tq.target_workers.includes(skillTargetExpression));
      if(!expressionFound){
        skill.discrepancies.push(`Task Queue was not found with the expression ${skillTargetExpression}. (Case Sensitive)`);
      }
      return skill;
    //Enhance this after we swap to the graph to compare the task queue saved on the skill to the target expression
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

      //Test Next Token functionality specifically in unit test

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
        taskQueueSid: graphSkill.task_queue_sid
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
        if(matchingTrSkill.minimum && matchingTrSkill.maximum){
          const levels = [];
          for (let i = matchingTrSkill.minimum; i <= matchingTrSkill.maximum; i++) {
            levels.push(i);
          }
          skill.levels = levels;
        } else {
          skill.levels = null;
        }
        taskRouterSkills = taskRouterSkills.filter(trSkill => trSkill.name !== skill.name);
      } else {
        skill.discrepancies.push(`${skill.name} is not in the Flex Console`);
      }

      consolidatedSkills.push(skill);
    });

    taskRouterSkills.map((trSkill: TwilioSkill) => {
      const levels = [];
      for (let i = trSkill.minimum; i <= trSkill.maximum; i++) {
        levels.push(i);
      }
      let skill: Partial<Skill> = {
        discrepancies: [
          `${trSkill.name} is not in the User Management Database`
        ],
        name: trSkill.name,
        levels
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