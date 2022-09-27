import { Skill } from "globals";
import { TableState } from "../CallFlowManagementWrapper/CallFlowManagement.Interfaces";
export interface SkillsContainerProps {
  checked: Skill[],
  tableState: TableState,
  setChecked: (skills: Skill[]) => void
  setTableState: (tableState: TableState) => void
}

export interface SkillsHeaderProps {
  tableState: TableState,
  checked: Skill[],
  setTableState: (tableState: TableState) => void
}

export interface SkillsTableProps {
  checked: Skill[],
  tableState: TableState,
  setChecked: (skills: Skill[]) => void
  setTableState: (tableState: TableState) => void
}