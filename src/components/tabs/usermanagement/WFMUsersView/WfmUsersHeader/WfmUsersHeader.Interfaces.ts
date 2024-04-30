import { TableStateProps } from "globals";
import { UMUser } from "globals";

export interface WfmUsersHeaderProps {
  tableState: TableStateProps
  setTableState: (opts: TableStateProps) => void,
  setStatus: (status: string) => void
}

export interface ExportWfmUserProps {
  label: string,
  selected: UMUser[]
}