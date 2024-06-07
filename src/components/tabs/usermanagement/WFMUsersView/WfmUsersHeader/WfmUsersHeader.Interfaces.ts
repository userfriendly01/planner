import {
  TableStateProps, UMUser
} from "globals/interfaces";

export interface WfmUsersHeaderProps {
  tableState: TableStateProps
  setTableState: (opts: TableStateProps) => void,
  setStatus: (status: string) => void
}

export interface ExportWfmUserProps {
  label: string,
  selected: UMUser[]
}