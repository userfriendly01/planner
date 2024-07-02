import {
  TableStateProps, UMUser
} from "globals/interfaces";

export interface ManagementHeaderProps {
  tableState: TableStateProps,
  setTableState: (opts: TableStateProps) => void
  setResettingSkills: (isResetting: boolean) => void
}

export interface ExportTritonUserProps {
  label: string,
  selected: UMUser[]
}