import {
  Worker,
  WorkerAttributeSkills,
  Skill
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
export interface RawTaskRotuterSkill {
  multivalue: boolean,
  minimum: number,
  maximum: number,
  name: string
}

export const getValidSkillsObject = (skillsObject?: WorkerAttributeSkills): WorkerAttributeSkills => {
  const validObject: WorkerAttributeSkills = {
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

export const formatSkillGroups = (skillsArray: Skill[]): any[] => {
  // filter through the skills that have skillGroups and group them by skillGroup
  const skillsWithGroups = skillsArray.filter(s => s.ctmSkillGroups.length > 0);

  const groups: any[] = [];
  skillsWithGroups.forEach(sk => {
    sk.ctmSkillGroups.forEach(group => {
      const groupInGroupsArray = groups.find(g => g.skillGroupId === group.skillGroupId);
      const skillCopy = JSON.parse(JSON.stringify(sk));
      delete skillCopy.ctmSkillGroups; // take off the skillGroups from this layer or we'll have neverending data
      if (groupInGroupsArray) {
        groupInGroupsArray.skills.push(skillCopy);
      } else {
        const newGroup = group;
        newGroup.skills = [skillCopy];
        groups.push(newGroup);
      }
    });
  });

  return groups;
};