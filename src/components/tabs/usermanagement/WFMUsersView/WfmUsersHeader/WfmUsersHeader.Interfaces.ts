import { TableStateProps } from "globals";
import { Worker } from "globals";

export interface WfmUsersHeaderProps {
  tableState: TableStateProps
  setTableState: (opts: TableStateProps) => void,
}

export interface ExportWfmUserProps {
  label: string,
  selected: Worker[]
}