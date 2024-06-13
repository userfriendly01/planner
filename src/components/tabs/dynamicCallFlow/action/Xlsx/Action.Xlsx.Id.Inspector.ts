import {
  ActionXlsRowType, AnnouncementXlsxRow, MenuOptionXlsxRow, MenuXlsxRow
} from "./Action.Xlsx.Interfaces";
import {
  generateUuid, isValidUUID
} from "../../common/GraphQL/GraphQL.Util";
import {
  ActionTypeEnum
} from "../GraphQL/Action.Interfaces";


export class ActionXlsxIdInspector {
  private readonly xlsxIdToActionIdMap: Map<string, ActionXlsRowType> = new Map<string, ActionXlsRowType>();
  private readonly actionIdInspectionErrors: Array<string> = [];

  public inspect(actionXlsxRows: Array<ActionXlsRowType>): Array<string> {
    this.inspectActionIds(actionXlsxRows);
    this.inspectNextActionIdReferences(actionXlsxRows);

    return this.actionIdInspectionErrors;
  }

  private inspectActionIds(actionXlsxRows: Array<ActionXlsRowType>): void {
    actionXlsxRows.forEach((actionXlsxRow: ActionXlsRowType) => {
      // retain the original xlsxActionId from the xlsx file for reference in case of an error
      actionXlsxRow.xlsxId = actionXlsxRow.actionId;

      /** If actionId from xlsx file is already mapped, then use it, otherwise generate a new UUID.  The only time an
      // actionId would already be mapped is for MenuOptions action type.  MenuOptions are repeated in the xlsx file,
      // due to you can only enter one MenuOption per xlsx row.  A MenuOptions action with 3 MenuOption will have 3 rows
      // the xlsx file. *** Note: MenuOptions has an array of MenuOption, therefore, multiple rows in the xlsx file.
       **/
      if (this.xlsxIdToActionIdMap.has(actionXlsxRow.xlsxId)) {
        actionXlsxRow.actionId = this.xlsxIdToActionIdMap.get(actionXlsxRow.xlsxId).actionId;
      } else {
        if (isValidUUID(actionXlsxRow.actionId)) {
          this.xlsxIdToActionIdMap.set(actionXlsxRow.xlsxId, actionXlsxRow);
        } else {
          actionXlsxRow.actionId = generateUuid();
          this.xlsxIdToActionIdMap.set(actionXlsxRow.xlsxId, actionXlsxRow);
        }
      }
    });
  }

  private inspectNextActionIdReferences(actionXlsxRows: Array<ActionXlsRowType>): void {
    actionXlsxRows.forEach((actionXlsxRow: ActionXlsRowType) => {
      switch(actionXlsxRow.actionType) {
        case ActionTypeEnum.ANNOUNCEMENT:
          (actionXlsxRow as AnnouncementXlsxRow).nextActionId = this.inspectNextActionIdReference(actionXlsxRow, (actionXlsxRow as AnnouncementXlsxRow).nextActionId);
          break;
        case ActionTypeEnum.MENU:
          (actionXlsxRow as MenuXlsxRow).nextActionId = this.inspectNextActionIdReference(actionXlsxRow, (actionXlsxRow as MenuXlsxRow).nextActionId);
          (actionXlsxRow as MenuXlsxRow).menuRepeatNextActionId = this.inspectNextActionIdReference(actionXlsxRow, (actionXlsxRow as MenuXlsxRow).menuRepeatNextActionId);
          break;
        case ActionTypeEnum.MENU_OPTIONS:
          (actionXlsxRow as MenuOptionXlsxRow).menuOptionNextActionId = this.inspectNextActionIdReference(actionXlsxRow, (actionXlsxRow as MenuOptionXlsxRow).menuOptionNextActionId);
          break;
        default:
        // no nextActionId to inspect
      }
    });
  }

  private inspectNextActionIdReference(actionXlsxRow: ActionXlsRowType, nextActionId: string): string {
    if (nextActionId) {
      if (this.xlsxIdToActionIdMap.has(nextActionId)) {
        return this.xlsxIdToActionIdMap.get(nextActionId).actionId;
      } else {
        this.logReferencedActionIdError(actionXlsxRow, nextActionId);
      }
    }

    return nextActionId;
  }
  private logReferencedActionIdError(actionXlsRow: ActionXlsRowType, nextActionId: string): void {
    this.actionIdInspectionErrors.push(`${actionXlsRow.actionType} Action[${actionXlsRow.xlsxId}] references unknown actionId: ${nextActionId} for nextActionId.`);
  }
}