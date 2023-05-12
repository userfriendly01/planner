import { TableStateProps } from "globals";
export interface FilterButtonProps {
    tableState: TableStateProps
    setTableState: (opts: TableStateProps) => void,
}

export interface FilterModalProps {
  handleClear: ()=> void
  handleClose: () => void
  tableState: TableStateProps
  setTableState: (opts: TableStateProps) => void,
}