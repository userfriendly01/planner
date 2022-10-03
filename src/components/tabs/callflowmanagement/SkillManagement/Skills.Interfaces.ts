import { Skill } from "globals";
import { TableState } from "../CallFlowManagementWrapper/CallFlowManagement.Interfaces";
import {
  ConfirmationModalOptsProps,
  SaveResultProps
} from "../CallFlowConfirmationModal/CallFlowConfirmationModal.Interfaces";

export const ActionTypes = [
  {
    label: "View",
    value: "view"
  },
  {
    label: "Add",
    value: "add"
  },
  {
    label: "Edit",
    value: "edit"
  },
  {
    label: "Delete",
    value: "delete"
  }
];

export interface ActionContainerProps {
  checked: Skill[],
  confirmationModalOpts: ConfirmationModalOptsProps,
  tableState: TableState,
  setChecked: (props: Skill[]) => void,
  setConfirmationModalOpts: (props: ConfirmationModalOptsProps) => void,
  setSaveResult: (props: SaveResultProps) => void,
}

export interface SkillsContainerProps {
  checked: Skill[],
  tableState: TableState,
  setChecked: (skills: Skill[]) => void
  setTableState: (tableState: TableState) => void
}

export interface SkillsExportButtonProps {
  checked: Skill[]
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