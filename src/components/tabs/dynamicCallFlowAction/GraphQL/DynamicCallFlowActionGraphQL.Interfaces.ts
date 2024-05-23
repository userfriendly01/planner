import { GraphQLRecord } from "../../../../common/GraphQL/GraphQL.Interfaces";

export type ActionType = "ANNOUNCEMENT" | "MENU" | "MENUOPTIONS" | "TRANSFER" | "HANGUP";
export enum ActionTypeEnum {
  ANNOUNCEMENT = "ANNOUNCEMENT",
  MENU = "MENU",
  MENU_OPTIONS = "MENUOPTIONS",
  TRANSFER = "TRANSFER",
  HANGUP = "HANGUP"
}

export type ActionRecordType = Action | Announcement | Menu | MenuOptions;

export interface Action extends GraphQLRecord {
  actionId: string;
  actionType: ActionType;
  callFlowName: string;
  createTime: string;
  updateTime: string;
}

export interface MenuOption {
  digit: string
  callerContextAttributes?: any
  nextActionType: ActionType
  nextActionId?: string
}

export interface Announcement extends Action {
  speech: string
  nextActionType: ActionType
  nextActionId?: string
}

export interface MenuOptions extends Action {
  options: MenuOption[]
}

export interface Repeat {
  callerContextAttributes?: any
  loop?: number
  nextActionType: ActionType
  nextActionId?: string
}

export interface Menu extends Action {
  speech: string
  allowBargeIn?: boolean
  finishOnKey?: string
  minDigits?: number
  maxDigits?: number
  timeout?: number
  repeat?: Repeat
  nextActionType: ActionType
  nextActionId?: string
}