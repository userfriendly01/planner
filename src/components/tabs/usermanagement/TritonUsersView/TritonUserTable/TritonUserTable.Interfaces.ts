import { TableStateProps } from "globals/interfaces";

export interface TritonUserTableProps {
  resettingSkills: boolean,
  tableState: TableStateProps,
  setTableState: (opts: TableStateProps) => void
}