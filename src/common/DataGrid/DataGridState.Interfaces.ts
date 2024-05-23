import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { AlertColor } from "@mui/material";
import { ReactStateAction } from "../StateManager/AbstractReactState.Interfaces";

export interface AlertBarProps {
  open: boolean;
  msg: string;
  severityType: AlertColor;
  duration?: number
}

export type ApiRefAction = ReactStateAction<GridApiCommunity>;
export type SelectedListAction<RecordType> = ReactStateAction<Array<RecordType>>;

export type OpenAddModalType = <RecordType>(flag: boolean, isSubmitted?: boolean, record?: RecordType) => void;

export type PreviewModalActionType = "add" | "edit" | "delete"
export enum PreviewModalActionTypeEnum {
  ADD = "add",
  EDIT = "edit",
  DELETE = "delete"
}

export interface MasterData {
  [key: string]: Array<string>;
}

export interface Filter {
  [key: string]: string | number | boolean | Array<string | number | boolean> | undefined | null | Record<string, any> | Record<string, any>[];
}

export interface DataGridStateProps<RecordType> {
  data?: Array<RecordType>;
  filteredData?: Array<RecordType>;
  filter?: Filter;
  masterData?: MasterData;
  fetching?: boolean;
  selectedRow?: RecordType;
  isEditModalOpen?: boolean;
  isPreviewModalOpen?: boolean;
  previewModalAction?: PreviewModalActionType;
  isAddModalOpen?: boolean;
  isFilterModalOpen?: boolean;
  idStart?: number;
  idEnd?: number;
  maxId?: number;
  minId?: number;
  saveSuccess?: number;
}
