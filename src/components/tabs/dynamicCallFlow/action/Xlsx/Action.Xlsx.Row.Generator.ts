import {
  ActionXlsRowType,
  AnnouncementXlsxRow,
  CallerContextAttributes,
  CombinedActionXlsxRowType,
  MenuOptionXlsxRow,
  MenuXlsxRow,
  RedirectXlsxRow
} from "components/tabs/dynamicCallFlow/action/Xlsx/Action.Xlsx.Interfaces";
import {
  ActionRecordType,
  Announcement,
  Menu,
  MenuOption,
  MenuOptions,
  Redirect
} from "components/tabs/dynamicCallFlow/action/GraphQL/Action.Interfaces";
import { ActionTypeEnum } from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";

export class ActionXlsxRowGenerator {
  generateXlsxRows(actionRecords: Array<ActionRecordType>): Array<ActionXlsRowType> {
    const actionXlsxRows: Array<ActionXlsRowType> = [];

    actionRecords.forEach((actionRecord: ActionRecordType) => {
      let convertedActionXlsxRows: Array<ActionXlsRowType>;

      switch (actionRecord.actionType) {
        case ActionTypeEnum.ANNOUNCEMENT:
          convertedActionXlsxRows = this.mapToAnnouncement(actionRecord as Announcement);
          break;
        case ActionTypeEnum.MENU:
          convertedActionXlsxRows = this.mapToMenu(actionRecord as Menu);
          break;
        case ActionTypeEnum.MENU_OPTIONS:
          convertedActionXlsxRows = this.mapToMenuOptions(actionRecord as MenuOptions);
          break;
        case ActionTypeEnum.REDIRECT:
          convertedActionXlsxRows = this.mapToRedirect(actionRecord as Redirect);
          break;
        default:
          console.error(`Unknown action type: ${actionRecord.actionType}`);
          return undefined;
      }

      if (convertedActionXlsxRows) {
        convertedActionXlsxRows.forEach((actionXlsxRow: ActionXlsRowType) => {
          actionXlsxRow.actionId = actionRecord.actionId;
          actionXlsxRow.actionType = actionRecord.actionType;
          actionXlsxRow.callFlowName = actionRecord.callFlowName;
        });

        actionXlsxRows.push(...convertedActionXlsxRows);
      }
    });

    return this.reorderXlsxRowForHeaders(actionXlsxRows);
  }

  private mapToAnnouncement(announcement: Announcement): Array<AnnouncementXlsxRow> {
    const announcementXlsxRow: AnnouncementXlsxRow = {
      speech: announcement.speech,
      nextActionId: announcement.nextActionId,
      nextActionType: announcement.nextActionType
    } as AnnouncementXlsxRow;

    return [announcementXlsxRow];
  }

  private mapToMenu(menu: Menu): Array<MenuXlsxRow> {
    let callerContextAttributes: CallerContextAttributes = {
      reasonForReturning: ""
    };

    if (menu.repeat?.callerContextAttributes) {
      callerContextAttributes = JSON.parse(menu.repeat.callerContextAttributes);
    }

    const menuXlsxRow: MenuXlsxRow = {
      speech: menu.speech,
      nextActionId: menu.nextActionId,
      nextActionType: menu.nextActionType,
      menuAllowBargeIn: menu.allowBargeIn,
      menuFinishOnKey: menu.finishOnKey,
      menuMinDigits: menu.minDigits,
      menuMaxDigits: menu.maxDigits,
      menuTimeout: menu.timeout,
      menuRepeatLoop: menu.repeat?.loop,
      menuRepeatNextActionType: menu.repeat?.nextActionType,
      menuRepeatNextActionId: menu.repeat?.nextActionId,
      menuRepeatReasonForReturning: callerContextAttributes.reasonForReturning
    } as MenuXlsxRow;

    return [menuXlsxRow];
  }

  private mapToMenuOptions(menuOptions: MenuOptions): Array<MenuOptionXlsxRow> {
    return menuOptions.options.map((menuOption: MenuOption) => {
      let callerContextAttributes: CallerContextAttributes = {
        reasonForReturning: "",
        callIntent: ""
      };

      if (menuOption.callerContextAttributes) {
        callerContextAttributes = JSON.parse(menuOption.callerContextAttributes);
      }

      return {
        menuOptionDigit: menuOption.digit,
        menuOptionNextActionType: menuOption.nextActionType,
        menuOptionNextActionId: menuOption.nextActionId,
        menuOptionReasonForReturning: callerContextAttributes.reasonForReturning,
        menuOptionCallIntent: callerContextAttributes.callIntent
      } as MenuOptionXlsxRow;
    });
  }

  private mapToRedirect(redirect: Redirect): Array<RedirectXlsxRow> {
    return [ { redirectUrl: redirect.url } as RedirectXlsxRow ];
  }

  private reorderXlsxRowForHeaders(xlsxRows: Array<ActionXlsRowType>): Array<ActionXlsRowType> {
    return xlsxRows.map((xlsxRow: CombinedActionXlsxRowType) => ( {
      actionId: xlsxRow.actionId,
      actionType: xlsxRow.actionType,
      callFlowName: xlsxRow.callFlowName,
      nextActionId: xlsxRow.nextActionId,
      nextActionType: xlsxRow.nextActionType,
      speech: xlsxRow.speech,
      menuAllowBargeIn: xlsxRow.menuAllowBargeIn,
      menuFinishOnKey: xlsxRow.menuFinishOnKey,
      menuMinDigits: xlsxRow.menuMinDigits,
      menuMaxDigits: xlsxRow.menuMaxDigits,
      menuTimeout: xlsxRow.menuTimeout,
      menuRepeatLoop: xlsxRow.menuRepeatLoop,
      menuRepeatNextActionId: xlsxRow.menuRepeatNextActionId,
      menuRepeatNextActionType: xlsxRow.menuRepeatNextActionType,
      menuRepeatReasonForReturning: xlsxRow.menuRepeatReasonForReturning,
      menuOptionDigit: xlsxRow.menuOptionDigit,
      menuOptionNextActionType: xlsxRow.menuOptionNextActionType,
      menuOptionNextActionId: xlsxRow.menuOptionNextActionId,
      menuOptionReasonForReturning: xlsxRow.menuOptionReasonForReturning,
      menuOptionCallIntent: xlsxRow.menuOptionCallIntent,
      redirectUrl: xlsxRow.redirectUrl
    } as CombinedActionXlsxRowType));
  }
}