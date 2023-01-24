import { Skill } from "globals";

export interface SkillDropdownProps {
  skill: {
    label: string,
    value: string
  } | string,
  skills: Skill[] | string,
  updateSkill: (skill: any) => void
}