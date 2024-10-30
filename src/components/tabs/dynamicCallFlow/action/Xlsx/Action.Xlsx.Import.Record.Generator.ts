import {
  ActionXlsRowType,
  AnnouncementXlsxRow,
  CallerContextAttributes,
  CaptureXlsxRow,
  MenuOptionXlsxRow,
  MenuXlsxRow,
  RedirectXlsxRow
} from "components/tabs/dynamicCallFlow/action/Xlsx/Action.Xlsx.Interfaces";
import {
  ActionRecordType,
  Announcement,
  Capture,
  Menu,
  MenuOptions,
  Redirect
} from "components/tabs/dynamicCallFlow/action/GraphQL/Action.Interfaces";
import { ActionTypeEnum } from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";
import { logger } from "utils/logger";

export class ActionXlsxImportRecordGenerator {
  public generateActionRecords(actionXlsxRows: Array<ActionXlsRowType>): Array<ActionRecordType> {
    const actionRecords: Array<ActionRecordType> = [];

    actionXlsxRows.forEach((actionXlsxRow: ActionXlsRowType) => {
      let actionRecord: ActionRecordType;

      switch (actionXlsxRow.actionType) {
        case ActionTypeEnum.ANNOUNCEMENT:
          actionRecord = this.mapToAnnouncement(actionXlsxRow as AnnouncementXlsxRow);
          break;
        case ActionTypeEnum.CAPTURE:
          actionRecord = this.mapToCapture(actionXlsxRow as CaptureXlsxRow);
          break;
        case ActionTypeEnum.MENU:
          actionRecord = this.mapToMenu(actionXlsxRow as MenuXlsxRow);
          break;
        case ActionTypeEnum.MENU_OPTIONS:
          actionRecord = this.mapToMenuOptions(actionXlsxRow as MenuOptionXlsxRow);
          break;
        case ActionTypeEnum.REDIRECT:
          actionRecord = this.mapToRedirect(actionXlsxRow as RedirectXlsxRow);
          break;
        default:
          logger.error(`Unknown action type: ${actionXlsxRow.actionType}`, { ...actionXlsxRow });
          return undefined;
      }

      if (actionRecord) {
        actionRecord.actionId = actionXlsxRow.actionId;
        actionRecord.actionType = actionXlsxRow.actionType;
        actionRecord.callFlowName = actionXlsxRow.callFlowName;
        actionRecords.push(actionRecord);
      }
    });

    return this.consolidateArrays(actionRecords);
  }

  private mapToAnnouncement(announcementXlsxRow: AnnouncementXlsxRow): Announcement {
    return {
      speech: announcementXlsxRow.speech,
      nextActionId: announcementXlsxRow.nextActionId,
      nextActionType: announcementXlsxRow.nextActionType
    } as Announcement;
  }

  private mapToCapture(captureXlsxRow: CaptureXlsxRow): Capture {
    let validLengths = JSON.parse(captureXlsxRow.captureValidLengths);
    if (!validLengths || !Array.isArray(validLengths)) {
      validLengths = [];
    }
    let timeoutInSeconds = parseInt(captureXlsxRow.captureTimeout);
    if (isNaN(timeoutInSeconds)) {
      timeoutInSeconds = 5;
    }
    return {
      validLengths: validLengths,
      endpoint: captureXlsxRow.captureEndpoint,
      parameter: captureXlsxRow.captureParameter,
      captureTimeout: timeoutInSeconds * 1000,
      outcomes: JSON.parse(captureXlsxRow.captureOutcomes)
    };
  }

  private mapToMenu(menuXlsxRow: MenuXlsxRow): Menu {
    const callerContextAttributes: CallerContextAttributes = {};

    if (menuXlsxRow.menuRepeatReasonForReturning) {
      callerContextAttributes.reasonForReturning = menuXlsxRow.menuRepeatReasonForReturning;
    }

    return {
      nextActionId: menuXlsxRow.nextActionId,
      nextActionType: menuXlsxRow.nextActionType,
      speech: menuXlsxRow.speech,
      allowBargeIn: menuXlsxRow.menuAllowBargeIn,
      finishOnKey: menuXlsxRow.menuFinishOnKey,
      minDigits: menuXlsxRow.menuMinDigits,
      maxDigits: menuXlsxRow.menuMaxDigits,
      timeout: menuXlsxRow.menuTimeout,
      repeat: {
        loop: menuXlsxRow.menuRepeatLoop,
        nextActionType: menuXlsxRow.menuRepeatNextActionType,
        nextActionId: menuXlsxRow.menuRepeatNextActionId,
        callerContextAttributes: JSON.stringify(callerContextAttributes)
      }
    } as Menu;
  }

  private mapToMenuOptions(menuOptionsXlsxRow: MenuOptionXlsxRow): MenuOptions {
    const callerContextAttributes: CallerContextAttributes = {};

    if (menuOptionsXlsxRow.menuOptionReasonForReturning) {
      callerContextAttributes.reasonForReturning = menuOptionsXlsxRow.menuOptionReasonForReturning;
    }

    if (menuOptionsXlsxRow.menuOptionCallIntent) {
      callerContextAttributes.callIntent = menuOptionsXlsxRow.menuOptionCallIntent;
    }

    return {
      options: [
        {
          digit: menuOptionsXlsxRow.menuOptionDigit,
          callerContextAttributes: JSON.stringify(callerContextAttributes),
          nextActionType: menuOptionsXlsxRow.menuOptionNextActionType,
          nextActionId: menuOptionsXlsxRow.menuOptionNextActionId
        }
      ]
    };
  }

  private mapToRedirect(redirectXlsxRow: RedirectXlsxRow): Redirect {
    return {
      url: redirectXlsxRow.redirectUrl
    };
  }

  private consolidateArrays(actionRecords: Array<ActionRecordType>): Array<ActionRecordType> {
    const menuOptionsMap: Map<string, MenuOptions> = new Map<string, MenuOptions>();
    const captureOutcomesMap: Map<string, Capture> = new Map<string, Capture>();

    actionRecords.forEach((actionRecord: ActionRecordType) => {
      if (actionRecord.actionType === ActionTypeEnum.MENU_OPTIONS) {
        const menuOptions: MenuOptions = actionRecord as MenuOptions;
        if (menuOptionsMap.has(menuOptions.actionId)) {
          menuOptionsMap.get(menuOptions.actionId).options.push(menuOptions.options[0]);
        } else {
          menuOptionsMap.set(menuOptions.actionId, menuOptions);
        }
      }
      if (actionRecord.actionType === ActionTypeEnum.CAPTURE) {
        const capture: Capture = actionRecord as Capture;
        if (captureOutcomesMap.has(capture.actionId)) {
          captureOutcomesMap.get(capture.actionId).outcomes.push(capture.outcomes[0]);
        } else {
          captureOutcomesMap.set(capture.actionId, capture);
        }
      }
    });

    const updatedActionRecords = actionRecords.filter((actionRecord: ActionRecordType) => {
      return !menuOptionsMap.has(actionRecord.actionId) && !captureOutcomesMap.has(actionRecord.actionId);
    });
    updatedActionRecords.push(...menuOptionsMap.values());
    updatedActionRecords.push(...captureOutcomesMap.values());

    return updatedActionRecords;
  }
}