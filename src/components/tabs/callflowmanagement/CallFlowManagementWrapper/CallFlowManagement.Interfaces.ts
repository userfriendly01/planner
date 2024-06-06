import {
  Skill,
  TritonProfile
} from "globals/interfaces";

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
  selected: Skill[]
}