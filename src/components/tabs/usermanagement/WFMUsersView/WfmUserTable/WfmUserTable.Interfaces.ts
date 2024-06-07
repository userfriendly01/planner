import { TableStateProps } from "globals/interfaces";

export interface WfmUserTableProps {
  tableState: TableStateProps,
  setTableState: (opts: TableStateProps) => void
}