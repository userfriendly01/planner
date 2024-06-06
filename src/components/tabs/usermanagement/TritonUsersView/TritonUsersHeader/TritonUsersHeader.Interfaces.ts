import {
  TableStateProps, UMUser
} from "globals/interfaces";

export interface ManagementHeaderProps {
  tableState: TableStateProps,
  setTableState: (opts: TableStateProps) => void
}

export interface ExportTritonUserProps {
  label: string,
  selected: UMUser[]
}