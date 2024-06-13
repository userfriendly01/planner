import { TableStateProps } from "globals/interfaces";

export interface PaginationProps {
  tableState: TableStateProps,
  setTableState: (opts: TableStateProps) => void
}