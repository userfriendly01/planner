import { XlsxJSONRow } from "../../common/Xlsx/Xlsx.Interfaces";
import { ActionType } from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";

export interface CallerContextAttributes {
  reasonForReturning?: string;
  callIntent?: string;
}

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