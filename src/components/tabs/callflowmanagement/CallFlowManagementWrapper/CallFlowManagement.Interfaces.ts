import {
  Skill,
  TritonProfile
} from "globals";

export interface SkillProfile {
  profileId: number,
  profileName: string
}
export interface TableState {
  [key: string]: any
  closedFilter: boolean,
  flashFilter: boolean,
  filteredList: Skill[],
  profiles: TritonProfile[],
  searchBy: string,
  selected: Skill
}

export interface View {
  value: string,
  label: string
}

export const views = [
  {
    value: "SKILLS_MANAGEMENT",
    label: "Skills Management"
  }
];