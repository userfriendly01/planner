import { Skill } from "globals";

export interface SkillDropdownProps {
  skill: {
    label: string,
    value: string
  } | string,
  skills: Skill[],
  skillGroups: any[],  // TODO make a skillGroup Interface
  updateSkill: (skill: any) => void
}