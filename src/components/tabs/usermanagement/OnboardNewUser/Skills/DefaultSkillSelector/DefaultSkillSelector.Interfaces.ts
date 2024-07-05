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

export interface CustomRenderProps {
  option: {
    label: string;
    isSkillGroup?: boolean;
  }
}
