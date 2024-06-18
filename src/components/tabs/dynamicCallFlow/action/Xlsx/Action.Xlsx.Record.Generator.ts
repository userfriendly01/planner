import {
  ActionXlsRowType,
  AnnouncementXlsxRow, CallerContextAttributes,
  MenuOptionXlsxRow,
  MenuXlsxRow,
  RedirectXlsxRow
} from "./Action.Xlsx.Interfaces";
import {
  ActionRecordType,
  Announcement,
  Menu, MenuOptions, Redirect
} from "../GraphQL/Action.Interfaces";
import { ActionTypeEnum } from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";

export class ActionXlsxRecordGenerator {
  public generateActionRecords(actionXlsxRows: Array<ActionXlsRowType>): Array<ActionRecordType> {
    const actionRecords: Array<ActionRecordType> = [];
    let dataGridId = 0;

    actionXlsxRows.forEach((actionXlsxRow: ActionXlsRowType) => {
      dataGridId++;
      let actionRecord: ActionRecordType;

      switch (actionXlsxRow.actionType) {
        case ActionTypeEnum.ANNOUNCEMENT:
          actionRecord = this.mapToAnnouncement(actionXlsxRow as AnnouncementXlsxRow);
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
          console.error(`Unknown action type: ${actionXlsxRow.actionType}`);
          return undefined;
      }

      if (actionRecord) {
        actionRecord.id = dataGridId;
        actionRecord.actionId = actionXlsxRow.actionId;
        actionRecord.actionType = actionXlsxRow.actionType;
        actionRecord.callFlowName = actionXlsxRow.callFlowName;
        actionRecords.push(actionRecord);
      }
    });

    return this.consolidateMenuOptions(actionRecords);
  }

  private mapToAnnouncement(announcementXlsxRow: AnnouncementXlsxRow): Announcement {
    return {
      speech: announcementXlsxRow.speech,
      nextActionId: announcementXlsxRow.nextActionId,
      nextActionType: announcementXlsxRow.nextActionType
    } as Announcement;
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

  private consolidateMenuOptions(actionRecords: Array<ActionRecordType>): Array<ActionRecordType> {
    const menuOptionsMap: Map<string, MenuOptions> = new Map<string, MenuOptions>();

    actionRecords.forEach((actionRecord: ActionRecordType) => {
      if (actionRecord.actionType === ActionTypeEnum.MENU_OPTIONS) {
        const menuOptions: MenuOptions = actionRecord as MenuOptions;
        if (menuOptionsMap.has(menuOptions.actionId)) {
          menuOptionsMap.get(menuOptions.actionId).options.push(menuOptions.options[0]);
        } else {
          menuOptionsMap.set(menuOptions.actionId, menuOptions);
        }
      }
    });

    const updatedActionRecords = actionRecords.filter((actionRecord: ActionRecordType) => !menuOptionsMap.has(actionRecord.actionId));
    updatedActionRecords.push(...menuOptionsMap.values());

    return updatedActionRecords;
  }
}