import {
  Skill, SkillGroup
} from "callflowmanagement/Skills.Interfaces";

export interface SkillDropdownProps {
  skill: {
    label: string,
    value: string
  } | string,
  skills: Skill[],
  skillGroups: SkillGroup[],
  updateSkill: (skill: any) => void
}