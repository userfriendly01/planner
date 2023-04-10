import { TableStateProps } from "globals";

export interface WfmUserTableProps {
  tableState: TableStateProps,
  setTableState: (opts: TableStateProps) => void
}