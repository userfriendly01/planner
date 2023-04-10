import { TableStateProps } from "globals";
import { Worker } from "globals";
export interface ManagementHeaderProps {
  tableState: TableStateProps
  setTableState: (opts: TableStateProps) => void,
}

export interface ExportTritonUserProps {
  label: string,
  selected: Worker[]
}