import { TableStateProps } from "globals";

export interface TritonUserTableProps {
  tableState: TableStateProps,
  setTableState: (opts: TableStateProps) => void
}