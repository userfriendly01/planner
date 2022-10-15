import {
  ConfirmationModalOptsProps,
  SaveResultProps
} from "../../CallFlowConfirmationModal/CallFlowConfirmationModal.Interfaces";
import { TableState } from "../../CallFlowManagementWrapper/CallFlowManagement.Interfaces";
import { ActionType } from "../Skills.Interfaces";
import { Skill } from "globals";
import {
  updateClosedMessage,
  updateFlashMessage
} from "services";
import { AxiosResponse } from "axios";
export interface MessageContainerProps {
  action: ActionType,
  confirmationModalOpts: ConfirmationModalOptsProps,
  tableState: TableState,
  messageType: MessageType,
  setAction: (action: ActionType) => void,
  setTableState: (state: TableState) => void,
  setConfirmationModalOpts: (props: ConfirmationModalOptsProps) => void,
  setSaveResult: (props: SaveResultProps) => void,
}
export interface MessageBoxProps {
  action: ActionType,
  tableState: TableState,
  text: string,
  setText: (text: string) => void,
  messageType: MessageType
}

export interface SaveButtonProps {
  action: ActionType,
  setAction: (action: ActionType) => void
  setSaveResult: (props: SaveResultProps) => void,
  tableState: TableState,
  confirmationModalOpts: ConfirmationModalOptsProps,
  setConfirmationModalOpts: (props: ConfirmationModalOptsProps) => void,
  setTableState: (state: TableState) => void,
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