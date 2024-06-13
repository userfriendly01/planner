import {
  ActionXlsRowType,
  AnnouncementXlsxRow, CallerContextAttributes,
  MenuOptionXlsxRow,
  MenuXlsxRow,
  RedirectXlsxRow
} from "./Action.Xlsx.Interfaces";
import {
  ActionRecordType,
  ActionTypeEnum,
  Announcement,
  Menu, MenuOptions, Redirect
} from "../GraphQL/Action.Interfaces";

export class ActionXlsxRecordGenerator {
  public generateActionRecords(actionXlsxRows: Array<ActionXlsRowType>): Array<ActionRecordType> {
    const actionRecords: Array<ActionRecordType> = [];

    actionXlsxRows.forEach((actionXlsxRow: ActionXlsRowType) => {
      const actionRecord: ActionRecordType = {} as ActionRecordType;

      actionRecord.actionId = actionXlsxRow.actionId;
      actionRecord.actionType = actionXlsxRow.actionType;
      actionRecord.callFlowName = actionXlsxRow.callFlowName;

      switch (actionRecord.actionType) {
        case ActionTypeEnum.ANNOUNCEMENT:
          this.mapToAnnouncement(actionRecord as Announcement, actionXlsxRow as AnnouncementXlsxRow);
          break;
        case ActionTypeEnum.MENU:
          this.mapToMenu(actionRecord as Menu, actionXlsxRow as MenuXlsxRow);
          break;
        case ActionTypeEnum.MENU_OPTIONS:
          this.mapToMenuOptions(actionRecord as MenuOptions, actionXlsxRow as MenuOptionXlsxRow);
          break;
        case ActionTypeEnum.REDIRECT:
          this.mapToRedirect(actionRecord as Redirect, actionXlsxRow as RedirectXlsxRow);
          break;
        default:
          console.error(`Unknown action type: ${actionRecord.actionType}`);
          return undefined;
      }

      actionRecords.push(actionRecord);
    });

    return this.consolidateMenuOptions(actionRecords);
  }

  private mapToAnnouncement(announcement: Announcement, announcementXlsxRow: AnnouncementXlsxRow): void {
    announcement.speech = announcementXlsxRow.speech;
    announcement.nextActionId = announcementXlsxRow.nextActionId;
    announcement.nextActionType = announcementXlsxRow.nextActionType;
  }

  private mapToMenu(menu: Menu, menuXlsxRow: MenuXlsxRow): void {
    const callerContextAttributes: CallerContextAttributes = {};

    if (menuXlsxRow.menuRepeatReasonForReturning) {
      callerContextAttributes.reasonForReturning = menuXlsxRow.menuRepeatReasonForReturning;
    }

    menu.nextActionId = menuXlsxRow.nextActionId;
    menu.nextActionType = menuXlsxRow.nextActionType;
    menu.speech = menuXlsxRow.speech;
    menu.allowBargeIn = menuXlsxRow.menuAllowBargeIn;
    menu.finishOnKey = menuXlsxRow.menuFinishOnKey;
    menu.minDigits = menuXlsxRow.menuMinDigits;
    menu.maxDigits = menuXlsxRow.menuMaxDigits;
    menu.timeout = menuXlsxRow.menuTimeout;
    menu.repeat = {
      loop: menuXlsxRow.menuRepeatLoop,
      nextActionType: menuXlsxRow.menuRepeatNextActionType,
      nextActionId: menuXlsxRow.menuRepeatNextActionId,
      callerContextAttributes: JSON.stringify(callerContextAttributes)
    };
  }

  private mapToMenuOptions(menuOptions: MenuOptions, menuOptionsXlsxRow: MenuOptionXlsxRow): void {
    const callerContextAttributes: CallerContextAttributes = {};

    if (menuOptionsXlsxRow.menuOptionReasonForReturning) {
      callerContextAttributes.reasonForReturning = menuOptionsXlsxRow.menuOptionReasonForReturning;
    }

    if (menuOptionsXlsxRow.menuOptionCallIntent) {
      callerContextAttributes.callIntent = menuOptionsXlsxRow.menuOptionCallIntent;
    }

    menuOptions.options = [
      {
        digit: menuOptionsXlsxRow.menuOptionDigit,
        callerContextAttributes: JSON.stringify(callerContextAttributes),
        nextActionType: menuOptionsXlsxRow.menuOptionNextActionType,
        nextActionId: menuOptionsXlsxRow.menuOptionNextActionId
      }
    ];
  }

  private mapToRedirect(redirect: Redirect, redirectXlsxRow: RedirectXlsxRow): void {
    redirect.url = redirectXlsxRow.redirectUrl;
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