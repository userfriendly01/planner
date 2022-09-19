import {
  ConfirmationModalOptsProps,
  SaveResultProps
} from "../CallFlowConfirmationModal/CallFlowConfirmationModal.Interfaces";
import { Skill } from "globals";
import {
  updateClosedMessage,
  updateFlashMessage
} from "services";

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
  checked: any[],
  confirmationModalOpts: ConfirmationModalOptsProps,
  messageType: any,
  selected: any,
  setChecked: (props: Skill[]) => void,
  setConfirmationModalOpts: (props: ConfirmationModalOptsProps) => void,
  setSaveResult: (props: SaveResultProps) => void,
}

export interface MessageBoxProps {
  action: ActionTypes,
  checked: any[],
  selected: any,
  text: string,
  setText: (text: string) => void,
  messageType: any
}

export interface SaveButtonProps {
  action: ActionTypes,
  setAction: (action: ActionTypes) => void
  setSaveResult: (props: SaveResultProps) => void,
  checked: any[],
  confirmationModalOpts: ConfirmationModalOptsProps,
  setConfirmationModalOpts: (props: ConfirmationModalOptsProps) => void,
  setChecked: (props: Skill[]) => void,
  messageType: any,
  text: string
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