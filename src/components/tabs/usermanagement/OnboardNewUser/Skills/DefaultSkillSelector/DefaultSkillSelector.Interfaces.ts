import { UMTwilioAttributeSkills } from "globals/interfaces";

export interface DefaultSkillSelectorProps {
  defaultSkills: UMTwilioAttributeSkills,
  setDefaultSkills: (defaultSkills: UMTwilioAttributeSkills) => void;
}
export interface NewTwilioWorkerSkill {
  levels: number[],
  levelSelected: number,
  skill: string,
  skills?: any[]
}