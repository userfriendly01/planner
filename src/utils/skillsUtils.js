export const disablePriorityDropDown = (taskRouterSkills, skill) => {
  const skillObj = findSkillInTaskrouterSkills(taskRouterSkills, skill);
  return skillObj ? !skillObj.multivalue : false;
};

const findSkillInTaskrouterSkills = (taskRouterSkills, skill) => taskRouterSkills.find(skillObj => skillObj.name === skill);

export const getDefaultPriorityValueForSkill = (taskRouterSkills, skill) => {
  const priorityOptions = getPriorityOptionsList(taskRouterSkills, skill);
  priorityOptions.length === 0 ? null : priorityOptions[0];
};

export const getPriorityOptionsList = (taskRouterSkills, skill) => {
  const options = [];
  const skillObj = findSkillInTaskrouterSkills(taskRouterSkills, skill);
  if (skillObj && skillObj.multivalue) {
    for (let i = skillObj.minimum; i <= skillObj.maximum; i++) {
      options.push(i);
    }
  }
  return options;
};