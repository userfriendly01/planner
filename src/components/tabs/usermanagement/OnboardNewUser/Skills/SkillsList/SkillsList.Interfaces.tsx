import {
  Skill, SkillGroup
} from "globals";

export interface SkillDropdownProps {
  skill: {
    label: string,
    value: string
  } | string,
  skills: Skill[],
  skillGroups: SkillGroup[],
  updateSkill: (skill: any) => void
}