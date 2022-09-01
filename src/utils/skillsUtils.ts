import {
  Skill,
  Worker,
  WorkerSkills
} from "globals";
import _ from "lodash";

export const areSkillsDifferent = (workerAttributes: Worker["attributes"]): boolean => {
  const currentSkills = getValidSkillsObject(workerAttributes.routing);
  const defaultSkills = getValidSkillsObject(workerAttributes.default_skills);
  if (defaultSkills.skills.length > 0) {
    return !(_.isEqual(currentSkills.skills.sort(), defaultSkills.skills.sort()) && _.isEqual(currentSkills.levels, defaultSkills.levels));
  } else {
    return false;
  }
};

export const findTaskRouterSkill = (skill: string, skills: Skill[]): Skill => skills.find(skillObj => skillObj.name === skill) || {
  skill,
  levels: []
};

export interface RawTaskRotuterSkill {
  multivalue: boolean,
  minimum: number,
  maximum: number,
  name: string
}

// export const formatTaskRouterSkills = (rawTaskRouterSkills: RawTaskRotuterSkill[]): TaskRouterSkill[] => rawTaskRouterSkills.map(skillObj => {
//   const levels = [];
//   if (skillObj.multivalue) {
//     for (let i = skillObj.minimum; i <= skillObj.maximum; i++) {
//       levels.push(i);
//     }
//   }
//   return {
//     skill: skillObj.name,
//     levels
//   };
// }).sort(sortTaskRouterSkillByName);

export const getValidSkillsObject = (skillsObject?: WorkerSkills): WorkerSkills => {
  const validObject: WorkerSkills = {
    skills: [],
    levels: {}
  };
  if (_.isPlainObject(skillsObject)) {
    if (_.isArray(skillsObject.skills)) {
      skillsObject.skills.forEach((skill: string) => validObject.skills.push(skill));
    }
    if (_.isPlainObject(skillsObject.levels)) {
      Object.entries(skillsObject.levels).forEach(([key, value]) => validObject.levels[key] = value);
    }
  }
  return validObject;
};