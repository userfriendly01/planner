import _ from "lodash";
import { getValidSkillsObject } from "./skillsUtils";

export const areSkillsDifferent = attributes => {
  const currentSkills = getValidSkillsObject(attributes.routing);
  const defaultSkills = getValidSkillsObject(attributes.default_skills);
  if (defaultSkills.skills.length > 0) {
    return !(_.isEqual(currentSkills.skills.sort(), defaultSkills.skills.sort()) && _.isEqual(currentSkills.levels, defaultSkills.levels));
  } else {
    return false;
  }
};