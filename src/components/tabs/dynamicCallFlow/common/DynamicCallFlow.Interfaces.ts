import React from "react";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import ModalController from "./Modal.Controller";
import { ADGroupPermission } from "globals/interfaces";

export type MutableRefObject<T> = React.MutableRefObject<T>;
export type ReactGridApi = React.MutableRefObject<GridApiCommunity>;
export type ReactSetState<StateActionType> = React.Dispatch<React.SetStateAction<StateActionType>>;
export interface ReactStateAction<StateActionType> {
  state: StateActionType;
  setState: ReactSetState<StateActionType>;
}

export interface DynamicCallFlowContextStore<ModalType> {
  accessTokenGraph: string;
  permissions: Array<ADGroupPermission>;
  currentOpenModal: ModalType;
  modalController: React.MutableRefObject<ModalController<ModalType>>;
}