import { UMSoftphoneConfiguration } from "globals/interfaces";
import { Skill } from "callflowmanagement/Skills.Interfaces";

export interface SkillProfile {
  profileId: number,
  profileName: string
}
export interface TableState {
  [key: string]: any
  closedFilter: boolean,
  flashFilter: boolean,
  discrepancyFilter: boolean,
  filteredList: Skill[],
  profiles: UMSoftphoneConfiguration[],
  searchBy: string,
  selected: Skill[]
}