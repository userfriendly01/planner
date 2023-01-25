import { TableStateProps } from "globals";

export interface ManagementHeaderProps {
  tableState: TableStateProps
  setTableState: (opts: TableStateProps) => void,
}