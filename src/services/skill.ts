import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";
import { logger } from "utils/logger";
import { getTaskQueues } from "services/taskQueues";
import {
  Application, Skill, TwilioSkill, CallflowSkill, CtmSkill,
  TimeOfDay, TwilioQueue, SkillFormState
} from "callflowmanagement/SkillManagement/Skills.Interfaces";
import {
  Action, OperatingUnit
} from "globals/interfaces";
import { getOperatingUnits } from "./operatingUnits";
import { getTargetExpression } from "utils/skillsUtils";

/* FYI - In the interest of not having to bother to set up the softphone-service to interact with the graph,
   The consolidation logic for skills will be here.

   In a future story, we want to move this logic to the shared-admin-service
   https://libertymutual.atlassian.net/browse/CCTP-13060
*/

const formatError = (error: any) => typeof error === "object" ? JSON.stringify(error) : error?.string();

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
      const message = `Task Queue failed to create. ${formatError(error?.response?.data || error?.message)}`;
      console.error(message, error);
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
    const message = `Flex skill failed to create: ${formatError(error?.response?.data || error?.message)}`;
    console.error(message, error);
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
    const message = `Callflow database failed to update: ${formatError(error?.response?.data || error?.message)}`;
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

  console.log("Delete Results", results);

  if(!results.every((r: any) => r.status === "fulfilled")){
    const is404 = (reason: any) => reason?.response?.data?.error?.error === "Not Found" ||
    reason?.response?.data?.error?.toString().includes("not found");
    const messages = results.filter((r: any) => r.status === "rejected" && !is404(r.reason)).map((p: any) => {
      const message = formatError(p.reason?.response?.data?.error) || formatError(p.reason?.response?.data) || formatError(p.reason);
      return `${skillName} - ${message}`;
    });
    if(messages.length){
      return Promise.reject(messages.toString());
    }
  }
  return;
};

const getTaskRouterSkills = (): Promise<{ data: TwilioSkill[] }> => {
  return myAxios.get(apiPaths.SKILLS_TASKROUTER);
};

const getCallflowSkills = (): Promise<{ data: CallflowSkill[] }> => {
  return myAxios.get(apiPaths.SKILLS_CALLFLOW);
};

const getContactManagerSkills= (): Promise<{ data: CtmSkill[] }> => {
  return myAxios.get(apiPaths.SKILLS_CONTACT_MANAGER);
};

export const loadSkillOptions = async (skills: Skill[], dispatch: (action: Action) => void, callback: () => void): Promise<void>=> {
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
};

export const loadConsolidatedSkills = async (dispatch: (action: Action) => void): Promise<void> => {
  try  {
    const taskRouterSkillsPromise = getTaskRouterSkills();
    const callflowSkillsPromise = getCallflowSkills();
    const contactManagerSkillsPromise = getContactManagerSkills();

    const [
      taskRouterSkillsResponse,
      callflowSkillsResponse,
      contactManagerSkillsResponse //when this comes from the graph, a many to many relationship will be available
    ] = await Promise.all([ taskRouterSkillsPromise, callflowSkillsPromise, contactManagerSkillsPromise]);

    const consolidatedSkills: Partial<Skill>[] = [];

    const contactManagerSkills = contactManagerSkillsResponse.data.slice();
    let taskRouterSkills = taskRouterSkillsResponse.data.slice();
    let callflowSkills = callflowSkillsResponse.data.slice();

    contactManagerSkills.map((ctmSkill: CtmSkill) => {
      const dupSkill = consolidatedSkills.find(sk => sk.name === ctmSkill.skill_num);
      if(dupSkill){
        const needsProfile = ctmSkill.profile_id && !dupSkill.profiles.includes(ctmSkill.profile_id);
        const needsSkillGroup = ctmSkill.skill_group_id && !dupSkill.skillGroups.some(sg => sg.skillGroupId === ctmSkill.skill_group_id);

        needsProfile && dupSkill.profiles.push(ctmSkill.profile_id);
        needsSkillGroup && dupSkill.skillGroups.push({
          skillGroupId: ctmSkill.skill_group_id,
          skillGroupNme: ctmSkill.skill_group_nme,
          skills: []
        });

      } else {
        let skill: Partial<Skill> = {
          discrepancies: !ctmSkill.profile_id ? ["Skill exists in Contact Manager Database but has no relationship to a profile"] : [],
          name: ctmSkill.skill_num,
          ctmSkillId: ctmSkill.skill_id,
          profiles: ctmSkill.profile_id ? [ctmSkill.profile_id] : [],
          skillGroups: ctmSkill.skill_group_id ? [{
            skillGroupId: ctmSkill.skill_group_id,
            skillGroupNme: ctmSkill.skill_group_nme,
            skills: []
          }] : []
          //Current CTM get doesnt send the Task Queue Sid - going to plug this in when we migrate to graph
        };

        const matchingCallFlowSkill = callflowSkills.find((cfSkill: CallflowSkill) => cfSkill.skillName === ctmSkill.skill_num);
        const matchingTrSkill = taskRouterSkills.find((trSkill: TwilioSkill) => trSkill.name === ctmSkill.skill_num);

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
          const levels = [];
          for (let i = matchingTrSkill.minimum; i <= matchingTrSkill.maximum; i++) {
            levels.push(i);
          }
          skill.levels = levels;
          taskRouterSkills = taskRouterSkills.filter(trSkill => trSkill.name !== skill.name);
        } else {
          skill.discrepancies.push(`${skill.name} is not in the Flex Console`);
        }

        consolidatedSkills.push(skill);
      }
    });

    taskRouterSkills.map((trSkill: TwilioSkill) => {
      const levels = [];
      for (let i = trSkill.minimum; i <= trSkill.maximum; i++) {
        levels.push(i);
      }
      let skill: Partial<Skill> = {
        discrepancies: [
          `${trSkill.name} is not in the Contact Manager Database`
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
          `${cfSkill.skillName} is not in the Contact Manager Database`,
          `${cfSkill.skillName} is not in the Flex Console`
        ],
        name: cfSkill.skillName,
        ...cfSkill
      };
      delete skill.skillName;
      consolidatedSkills.push(skill);
    });


    console.log("Faith - contactManagerSkills", contactManagerSkills);
    console.log("Faith - callflowSkills after", callflowSkills);
    console.log("Faith - taskRouterSkills after", taskRouterSkills);
    console.log("Faith - consolidatedSkills", consolidatedSkills);


    dispatch({
      type: "LOAD_SKILLS",
      payload: consolidatedSkills
    });
    dispatch({
      type: "LOAD_SKILL_GROUPS",
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