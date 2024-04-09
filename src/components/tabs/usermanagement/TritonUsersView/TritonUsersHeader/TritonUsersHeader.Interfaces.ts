import { TableStateProps } from "globals";
import { UMUser } from "globals";

export interface ManagementHeaderProps {
  tableState: TableStateProps,
  setTableState: (opts: TableStateProps) => void
}

export interface ExportTritonUserProps {
  label: string,
  selected: UMUser[]
}