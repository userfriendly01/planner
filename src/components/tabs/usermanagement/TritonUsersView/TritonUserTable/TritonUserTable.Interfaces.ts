import { TableStateProps } from "globals/interfaces";

export interface TritonUserTableProps {
  tableState: TableStateProps,
  setTableState: (opts: TableStateProps) => void
}