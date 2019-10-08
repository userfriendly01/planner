export const disablePriorityDropDown = (skillsArray, skillSelected) => {
  return !getCurrentSkill(skillsArray, skillSelected).multivalue;
};

const getCurrentSkill = (skillsArray, skillSelected) => skillsArray.find(skillObj => skillObj.name === skillSelected);

export const getPriorityOptionsList = (skillsArray, skillSelected) => {
  const options = [];
  if (skillSelected) {
    const currentSkill = getCurrentSkill(skillsArray, skillSelected);
    for (let i = currentSkill.minimum; i <= currentSkill.maximum; i++) {
      options.push(i);
    }
  }
  return options;
};