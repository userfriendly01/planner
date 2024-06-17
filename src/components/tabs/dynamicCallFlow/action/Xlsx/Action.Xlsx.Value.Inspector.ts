import {
  ActionXlsRowType,
  AnnouncementXlsxRow,
  MenuOptionXlsxRow,
  MenuXlsxRow,
  RedirectXlsxRow
} from "./Action.Xlsx.Interfaces";

import { ActionTypeEnum } from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";

export class ActionXlsxValueInspector {
  private readonly actionValueInspectionErrors: Array<string> = [];

  public inspectValues(actionXlsxRows: Array<ActionXlsRowType>): Array<string> {
    actionXlsxRows.forEach((actionXlsxRow: ActionXlsRowType) => {
      if (!actionXlsxRow.actionId || actionXlsxRow.actionId.trim().length === 0) {
        this.logActionValidationError(actionXlsxRow, "missing actionId.");
      }

      if (!actionXlsxRow.actionType || !(actionXlsxRow.actionType in ActionTypeEnum)) {
        this.logActionValidationError(actionXlsxRow, `invalid actionType of ${actionXlsxRow.actionType}.`);
      }

      if (!actionXlsxRow.callFlowName || actionXlsxRow.callFlowName.trim().length === 0) {
        this.logActionValidationError(actionXlsxRow, "missing callFlowName.");
      }

      switch (actionXlsxRow.actionType) {
        case ActionTypeEnum.ANNOUNCEMENT:
          this.inspectAnnouncementValues(actionXlsxRow as AnnouncementXlsxRow);
          break;
        case ActionTypeEnum.MENU:
          this.inspectMenuValues(actionXlsxRow as MenuXlsxRow);
          break;
        case ActionTypeEnum.MENU_OPTIONS:
          this.inspectMenuOptionValues(actionXlsxRow as MenuOptionXlsxRow);
          break;
        case ActionTypeEnum.REDIRECT:
          this.inspectRedirectValues(actionXlsxRow as RedirectXlsxRow);
          break;
        default:
        // no values to inspect
      }
    });

    return this.actionValueInspectionErrors;
  }

  private inspectAnnouncementValues(announcementXlsxRow: AnnouncementXlsxRow): void {
    if (!announcementXlsxRow.speech || announcementXlsxRow.speech.trim().length === 0) {
      this.logActionValidationError(announcementXlsxRow, "missing speech.");
    }

    if (!announcementXlsxRow.nextActionType) {
      this.logActionValidationError(announcementXlsxRow, "missing nextActionType.");
    }

    if (!announcementXlsxRow.nextActionId && announcementXlsxRow.nextActionType !== ActionTypeEnum.HANGUP) {
      this.logActionValidationError(announcementXlsxRow, "missing nextActionId.");
    }

  }

  private inspectMenuValues(menuXlsxRow: MenuXlsxRow): void {
    if (!menuXlsxRow.speech || menuXlsxRow.speech.trim().length === 0) {
      this.logActionValidationError(menuXlsxRow, "missing speech.");
    }

    if (!menuXlsxRow.nextActionId) {
      this.logActionValidationError(menuXlsxRow, "missing nextActionId.");
    }

    if (!menuXlsxRow.nextActionType) {
      this.logActionValidationError(menuXlsxRow, "missing nextActionType.");
    }

    if (!menuXlsxRow.menuAllowBargeIn) {
      menuXlsxRow.menuAllowBargeIn = true;
    }

    if (!menuXlsxRow.menuFinishOnKey) {
      menuXlsxRow.menuFinishOnKey = "#";
    }

    if (!menuXlsxRow.menuMinDigits) {
      menuXlsxRow.menuMinDigits = 1;
    }

    if (!menuXlsxRow.menuMaxDigits) {
      menuXlsxRow.menuMaxDigits = 1;
    }

    if (!menuXlsxRow.menuTimeout) {
      menuXlsxRow.menuTimeout = 7;
    }

    if (!menuXlsxRow.menuRepeatLoop) {
      menuXlsxRow.menuRepeatLoop = 3;
    }

    if (!menuXlsxRow.menuRepeatNextActionId) {
      if (menuXlsxRow.menuRepeatNextActionType === ActionTypeEnum.MENU || !menuXlsxRow.menuRepeatNextActionType) {
        menuXlsxRow.menuRepeatNextActionId = menuXlsxRow.actionId;
      } else {
        this.logActionValidationError(menuXlsxRow, `menuRepeatActionType of ${menuXlsxRow.menuRepeatNextActionType || "unknown"} requires a value for menuRepeatNextActionId.`);
      }
    }

    if (!menuXlsxRow.menuRepeatNextActionType) {
      if (menuXlsxRow.menuRepeatNextActionId === menuXlsxRow.actionId) {
        menuXlsxRow.menuRepeatNextActionType = ActionTypeEnum.MENU;
      } else {
        this.logActionValidationError(menuXlsxRow, "missing menuRepeatNextActionType.");
      }
    }
  }

  private inspectMenuOptionValues(menuOptionXlsxRow: MenuOptionXlsxRow): void {
    if (!menuOptionXlsxRow.menuOptionDigit) {
      this.logActionValidationError(menuOptionXlsxRow, "missing menuOptionDigit.");
    }

    if (!menuOptionXlsxRow.menuOptionNextActionId && menuOptionXlsxRow.menuOptionNextActionType !== ActionTypeEnum.HANGUP
      && menuOptionXlsxRow.menuOptionNextActionType !== ActionTypeEnum.TRANSFER) {
      this.logActionValidationError(menuOptionXlsxRow, `menuOptionNextActionType of ${menuOptionXlsxRow.menuOptionNextActionType || "unknown"} requires a value for menuOptionNextActionId.`);
    }

    if (!menuOptionXlsxRow.menuOptionNextActionType) {
      this.logActionValidationError(menuOptionXlsxRow, "A value for menuOptionNextActionType is required for MenuOptions action.");
    }
  }

  private inspectRedirectValues(redirectXlsxRow: RedirectXlsxRow): void {
    try {
      const redirectUrl = new URL(redirectXlsxRow.redirectUrl);
    } catch (error) {
      if ((error as Error).name === "TypeError") {
        this.logActionValidationError(redirectXlsxRow, `invalid redirectUrl '${redirectXlsxRow.redirectUrl}'.`);
      } else {
        throw error;
      }
    }
  }

  private logActionValidationError(actionXlsRow: ActionXlsRowType, error: string): void {
    this.actionValueInspectionErrors.push(`${actionXlsRow.actionType} Action[${actionXlsRow.xlsxId}] ${error}`);
  }
}