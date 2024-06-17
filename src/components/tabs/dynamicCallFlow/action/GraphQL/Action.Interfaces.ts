import {
  ActionType, GraphQLRecord
} from "../../common/GraphQL/DynamicCallFlow.Interfaces";

export type ActionRecordType = Action | Announcement | Menu | MenuOptions | Redirect

export type ActionRecord = Action & Announcement & Menu & MenuOptions & Redirect

export interface Action extends GraphQLRecord {
  actionId?: string;
  actionType?: ActionType;
  callFlowName?: string;
  createTime?: number;
  updateTime?: number;
}

export interface MenuOption {
  digit?: string
  callerContextAttributes?: any
  nextActionType?: ActionType
  nextActionId?: string
}

export interface Announcement extends Action {
  speech?: string
  nextActionType?: ActionType
  nextActionId?: string
}

export interface MenuOptions extends Action {
  options?: MenuOption[];
}

export interface Repeat {
  callerContextAttributes?: string;
  loop?: number;
  nextActionType?: ActionType;
  nextActionId?: string;
}

export interface Menu extends Action {
  speech?: string
  allowBargeIn?: boolean
  finishOnKey?: string
  minDigits?: number
  maxDigits?: number
  timeout?: number
  repeat?: Repeat
  nextActionType: ActionType
  nextActionId?: string
}

export interface Redirect extends Action {
  url: string;
}