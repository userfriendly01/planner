import React from "react";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { AlertBarController } from "./AlertBar.Controller";
import { DataGridFilter } from "./DataGrid/Abstract.DataGrid.Filter";
import { DataGridController } from "./DataGrid/Abstract.DataGrid.Controller";
import { ModalController } from "./Modal.Controller";
import { ADGroupPermission } from "globals/interfaces";
import { useAdminState } from "context/appContext";

export type MutableRefObject<T> = React.MutableRefObject<T>;
export type ReactGridApi = React.MutableRefObject<GridApiCommunity>;
export type AlertBarControllerRef = MutableRefObject<AlertBarController>
export type DataGridControllerRef<RecordType> = MutableRefObject<DataGridController<RecordType>>;
export type DataGridFilterRef<RecordType> = MutableRefObject<DataGridFilter<RecordType>>
export type ReactSetState<StateActionType> = React.Dispatch<React.SetStateAction<StateActionType>>;
export interface ReactStateAction<StateActionType> {
  state: StateActionType;
  setState: ReactSetState<StateActionType>;
}

export interface DynamicCallFlowContextStore<ModalType> {
  accessTokenGraph: string;
  permissions: ADGroupPermission[];
  currentOpenModal: ModalType;
  modalController: React.MutableRefObject<ModalController<ModalType>>;
}