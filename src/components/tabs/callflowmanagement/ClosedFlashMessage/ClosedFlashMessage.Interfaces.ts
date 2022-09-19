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
  setAction: (action: ActionTypes) => void,
  setText: (text: string) => void
}

export interface MessageContainerProps {
  confirmationModalOpts: ConfirmationModalOptsProps,
  setSaveResult: (props: SaveResultProps) => void,
  setConfirmationModalOpts: (props: ConfirmationModalOptsProps) => void,
  selected: any[],
  setSelected: (props: Skill[]) => void,
  messageType: any,
}

export interface MessageBoxProps {
  text: string,
  setText: (text: string) => void,
  action: ActionTypes,
  setAction: (action: ActionTypes) => void,
  selected: any[],
  messageType: any
}

export interface SaveButtonProps {
  action: ActionTypes,
  setSaveResult: (props: SaveResultProps) => void,
  selected: any[],
  confirmationModalOpts: ConfirmationModalOptsProps,
  setConfirmationModalOpts: (props: ConfirmationModalOptsProps) => void,
  setSelected: (props: Skill[]) => void,
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