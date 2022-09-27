import {
  ConfirmationModalOptsProps,
  SaveResultProps
} from "../CallFlowConfirmationModal/CallFlowConfirmationModal.Interfaces";
import { TableState } from "../CallFlowManagementWrapper/CallFlowManagement.Interfaces";
import { Skill } from "globals";
import {
  updateClosedMessage,
  updateFlashMessage
} from "services";
import { AxiosResponse } from "axios";

export enum ActionTypes  {
  VIEW = "view",
  EDIT = "edit",
  DELETE = "delete"
}

export interface ActionBarProps {
  action: ActionTypes,
  setAction: (action: ActionTypes) => void
}

export interface MessageContainerProps {
  checked: Skill[],
  confirmationModalOpts: ConfirmationModalOptsProps,
  messageType: MessageType,
  tableState: TableState,
  setChecked: (props: Skill[]) => void,
  setConfirmationModalOpts: (props: ConfirmationModalOptsProps) => void,
  setSaveResult: (props: SaveResultProps) => void,
}

export interface MessageBoxProps {
  action: ActionTypes,
  checked: Skill[],
  tableState: TableState,
  text: string,
  setText: (text: string) => void,
  messageType: MessageType
}

export interface SaveButtonProps {
  action: ActionTypes,
  setAction: (action: ActionTypes) => void
  setSaveResult: (props: SaveResultProps) => void,
  checked: Skill[],
  confirmationModalOpts: ConfirmationModalOptsProps,
  setConfirmationModalOpts: (props: ConfirmationModalOptsProps) => void,
  setChecked: (props: Skill[]) => void,
  messageType: MessageType,
  text: string
}

export interface MessageType {
  name: string,
  filter: string,
  variable: string,
  updateFunction: (skill: Skill, message: string, nNumber: string) => Promise<AxiosResponse<any>>
}

export const messageTypes = {
  CLOSED: {
    name: "Closed Message",
    filter: "closedFilter",
    variable: "closedMessage",
    updateFunction: updateClosedMessage
  },
  FLASH: {
    name: "Flash Message",
    filter: "flashFilter",
    variable: "flashMessage",
    updateFunction: updateFlashMessage
  }
};