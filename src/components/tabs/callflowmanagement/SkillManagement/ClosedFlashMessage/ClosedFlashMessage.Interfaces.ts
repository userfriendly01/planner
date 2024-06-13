import {
  ConfirmationModalOptsProps,
  SaveResultProps
} from "../../CallFlowConfirmationModal/CallFlowConfirmationModal.Interfaces";
import { TableState } from "../../CallFlowManagementWrapper/CallFlowManagement.Interfaces";
import { ActionType } from "../Skills.Interfaces";
import { Skill } from "globals/interfaces";
import {
  updateClosedMessage,
  updateFlashMessage
} from "services/message";
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

interface MessageType {
  name: string,
  filter: string,
  variable: string,
  updateFunction: (skill: Skill, message: string, nNumber: string) => Promise<AxiosResponse<any>>
}

export const messageTypes:{ [key: string]: MessageType} = {
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