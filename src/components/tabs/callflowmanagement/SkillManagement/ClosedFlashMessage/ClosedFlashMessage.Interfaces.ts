import {
  ConfirmationModalOptsProps,
  SaveResultProps
} from "../../CallFlowConfirmationModal/CallFlowConfirmationModal.Interfaces";
import { TableState } from "../../CallFlowManagementWrapper/CallFlowManagement.Interfaces";
import { ActionTypes } from "../Skills.Interfaces";
import { Skill } from "globals";
import {
  updateClosedMessage,
  updateFlashMessage
} from "services";
import { AxiosResponse } from "axios";

export interface MessageBoxProps {
  action: typeof ActionTypes[0],
  checked: Skill[],
  tableState: TableState,
  text: string,
  setText: (text: string) => void,
  messageType: MessageType
}

export interface SaveButtonProps {
  action: typeof ActionTypes[0],
  setAction: (action: typeof ActionTypes[0]) => void
  setSaveResult: (props: SaveResultProps) => void,
  checked: Skill[],
  confirmationModalOpts: ConfirmationModalOptsProps,
  setConfirmationModalOpts: (props: ConfirmationModalOptsProps) => void,
  setChecked: (props: Skill[]) => void,
  propertyValue: any,
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