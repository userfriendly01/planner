export const getPriorityOptionsList = (skillsArray, skillSelected) => {
  const options = [];
  if (skillSelected) {
    const currentSkill = skillsArray.find(skillObj => skillObj.name === skillSelected);
    for (let i = currentSkill.minimum; i <= currentSkill.maximum; i++) {
      options.push(i);
    }
  }
  return options;
};