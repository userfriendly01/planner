import { WorkerAttributeSkills } from "globals";

export interface DefaultSkillSelectorProps {
  defaultSkills: WorkerAttributeSkills,
  setDefaultSkills: (defaultSkills: WorkerAttributeSkills) => void;
}
export interface NewTwilioWorkerSkill {
  levels: number[],
  levelSelected: number,
  skill: string,
  skills?: any[]
}