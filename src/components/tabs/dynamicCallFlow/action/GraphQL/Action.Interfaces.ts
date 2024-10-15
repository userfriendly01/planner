import {
  ActionType
} from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";

export type ActionRecordType = Action | Capture | Announcement | Menu | MenuOptions | Redirect

export interface Action {
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

export interface Outcome {
  outcomeType?: string
  nextActionType?: ActionType
  nextActionId?: string
}

export interface Announcement extends Action {
  speech?: string
  nextActionType?: ActionType
  nextActionId?: string
}

export interface Capture extends Action {
  endpoint?: string
  parameter?: string
  captureTimeout: number
  validLengths?: number[]
  outcomes?: Outcome[]
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