import { XlsxJSONRow } from "components/tabs/dynamicCallFlow/common/Xlsx/Xlsx.Interfaces";
import { ActionType } from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";
import {
  ACTION_ID,
  ACTION_TYPE,
  CALL_FLOW_NAME,
  NEXT_ACTION_ID,
  NEXT_ACTION_TYPE, SPEECH
} from "dynamicCallFlowAction/Form/ActionFields";

export interface CallerContextAttributes {
  reasonForReturning?: string;
  callIntent?: string;
}

export type CombinedActionXlsxRowType = ActionXlsxRow & AnnouncementXlsxRow & MenuXlsxRow & MenuOptionXlsxRow & RedirectXlsxRow;
export type ActionXlsRowType = ActionXlsxRow | AnnouncementXlsxRow | MenuXlsxRow | MenuOptionXlsxRow | RedirectXlsxRow;

export interface ActionXlsxRow extends XlsxJSONRow {
  actionId: string;
  actionType: ActionType;
  callFlowName: string;
}

export interface AnnouncementXlsxRow extends ActionXlsxRow {
  nextActionId: string;
  nextActionType: ActionType;
  speech: string;
}

export interface MenuXlsxRow extends ActionXlsxRow {
  nextActionId: string;
  nextActionType: ActionType;
  speech: string;
  menuAllowBargeIn: boolean;
  menuFinishOnKey: string;
  menuMinDigits: number;
  menuMaxDigits: number;
  menuTimeout: number;
  menuRepeatReasonForReturning: string;
  menuRepeatLoop: number;
  menuRepeatNextActionId: string;
  menuRepeatNextActionType: ActionType;
}

export interface MenuOptionXlsxRow extends ActionXlsxRow {
  menuOptionDigit: string;
  menuOptionNextActionType: ActionType;
  menuOptionNextActionId: string;
  menuOptionReasonForReturning: string;
  menuOptionCallIntent: string;
}

export interface RedirectXlsxRow extends ActionXlsxRow {
  redirectUrl: string;
}

export const ActionXlsxHeaders = [
  ACTION_ID,
  ACTION_TYPE,
  CALL_FLOW_NAME,
  NEXT_ACTION_ID,
  NEXT_ACTION_TYPE,
  SPEECH,
  "menuAllowBargeIn",
  "menuFinishOnKey",
  "menuMinDigits",
  "menuMaxDigits",
  "menuTimeout",
  "menuRepeatLoop",
  "menuRepeatNextActionId",
  "menuRepeatNextActionType",
  "menuRepeatReasonForReturning",
  "menuOptionDigit",
  "menuOptionNextActionType",
  "menuOptionNextActionId",
  "menuOptionReasonForReturning",
  "menuOptionCallIntent",
  "redirectUrl"
];