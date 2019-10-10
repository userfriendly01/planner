import _ from "lodash";

export const formatTaskRouterSkills = rawTaskRouterSkills => rawTaskRouterSkills.map(skillObj => {
  const levels = [];
  if (skillObj.multivalue) {
    for (let i = skillObj.minimum; i <= skillObj.maximum; i++) {
      levels.push(i);
    }
  }
  return {
    skill: skillObj.name,
    levels
  };
});

export const findTaskRouterSkill = (skill, taskrouterSkills) => {
  const defaultObj = {
    skill,
    levels: []
  };
  return taskrouterSkills.find(skillObj => skillObj.skill === skill) || defaultObj;
};

export const getValidSkillsObject = skillsObject => {
  const validObject = {
    skills: [],
    levels: {}
  };
  if (_.isPlainObject(skillsObject)) {
    if (_.isArray(skillsObject.skills)) {
      skillsObject.skills.forEach(skill => validObject.skills.push(skill));
    }
    if (_.isPlainObject(skillsObject.levels)) {
      Object.entries(skillsObject.levels).forEach(([key, value]) => validObject.levels[key] = value);
    }
  }
  return validObject;
};