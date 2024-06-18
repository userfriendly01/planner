import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";
import { logger } from "utils/logger";
import { getTaskQueues } from "services/taskQueues";
import {
  AddEditSkill, Application, Skill, TwilioSkill, CallflowSkill, CtmSkill,
  TimeOfDay,
  TwilioQueue
} from "callflowmanagement/SkillManagement/Skills.Interfaces";
import { Action } from "globals/interfaces";

/* FYI - In the interest of not having to bother to set up the softphone-service to interact with the graph,
   The consolidation logic for skills will be here.

   In a future story, we want to move this logic to the shared-admin-service
   https://libertymutual.atlassian.net/browse/CCTP-13060
*/

export const createSkill = (payload: AddEditSkill): Promise<any> =>
  myAxios.post(apiPaths.CREATE_SKILL, payload).then(response => response);

const getTaskRouterSkills = (): Promise<{ data: TwilioSkill[] }> => {
  return myAxios.get(apiPaths.GET_SKILLS_TASKROUTER);
};

const getCallflowSkills = (): Promise<{ data: CallflowSkill[] }> => {
  return myAxios.get(apiPaths.GET_SKILLS_CALLFLOW);
};

const getContactManagerSkills= (): Promise<{ data: CtmSkill[] }> => {
  return myAxios.get(apiPaths.GET_SKILLS_CONTACT_MANAGER);
};

export const addTaskRouterSkills = () => {
  console.log();
};

export const removeTaskRouterSkills = () => {
  console.log();
};

export const editTaskRouterSkill = () => {
  console.log();
};

export const loadSkillOptions = async (dispatch: (action: Action) => void, callback: () => void): Promise<void>=> {
  const timeOfDaysPromise: Promise<{data: TimeOfDay[]}> = myAxios.get(apiPaths.GET_TIME_OF_DAYS);
  const applicationsPromise: Promise<{data: Application[]}> = myAxios.get(apiPaths.GET_APPLICATIONS);
  const taskQueuesPromise: Promise<{data: TwilioQueue[]}> = getTaskQueues();

  const [
    timeOfDaysResponse,
    applicationsResponse,
    taskQueuesResponse
  ] = await Promise.all([ timeOfDaysPromise, applicationsPromise, taskQueuesPromise]);

  dispatch({
    type: "loadSkillGroups",
    payload: {
      applications: applicationsResponse.data,
      timeOfDays: timeOfDaysResponse.data,
      taskQueues: taskQueuesResponse.data
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
      let skill: Partial<Skill> = {
        discrepancies: [],
        name: ctmSkill.skill_num,
        profiles: [ctmSkill.profile_id]
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
        ...cfSkill
      };
      consolidatedSkills.push(skill);
    });



    console.log("Faith - callflowSkills after", callflowSkills);
    console.log("Faith - taskRouterSkills after", taskRouterSkills);
    console.log("Faith - consolidatedSkills", consolidatedSkills);


    dispatch({
      type: "loadSkills",
      payload: consolidatedSkills
    });
    dispatch({
      type: "loadSkillGroups",
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