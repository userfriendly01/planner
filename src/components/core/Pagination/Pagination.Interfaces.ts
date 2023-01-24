import { TableStateProps } from "globals";

export interface PaginationProps {
  tableState: TableStateProps,
  setTableState: (opts: TableStateProps) => void
}