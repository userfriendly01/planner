import {
  AbstractXlsxReader, XlsxJSONRow
} from "../../common/XlsxReader/AbstractXlsxReader";
import {
  Action,
  ActionRecordType,
  ActionType,
  ActionTypeEnum,
  Announcement,
  Menu,
  MenuOptions,
  Repeat
} from "../GraphQL/DynamicCallFlowActionGraphQL.Interfaces";
import {
  XLSX_ACTION_ID, XLSX_ACTION_TYPE, XLSX_CALL_FLOW_NAME, XLSX_CREATE_TIME,
  XLSX_MENU_ALLOW_BARGE_IN,
  XLSX_MENU_FINISH_ON_KEY,
  XLSX_MENU_MAX_DIGITS,
  XLSX_MENU_MIN_DIGITS,
  XLSX_MENU_OPTION_CALL_INTENT,
  XLSX_MENU_OPTION_DIGIT,
  XLSX_MENU_OPTION_NEXT_ACTION_ID,
  XLSX_MENU_OPTION_NEXT_ACTION_TYPE,
  XLSX_MENU_OPTION_REASON_FOR_RETURNING,
  XLSX_MENU_REPEAT_LOOP,
  XLSX_MENU_REPEAT_NEXT_ACTION_ID,
  XLSX_MENU_REPEAT_NEXT_ACTION_TYPE,
  XLSX_MENU_REPEAT_REASON_FOR_RETURNING,
  XLSX_MENU_TIMEOUT,
  XLSX_NEXT_ACTION_ID,
  XLSX_NEXT_ACTION_TYPE,
  XLSX_SPEECH, XLSX_UPDATE_TIME
} from "./DynamicCallFlowActionXlsxHeaders";
import {
  v4 as uuidv4, validate as uuidValidate
} from "uuid"; // TODO: Need to create a delcaration file for uuid

class DynamicCallFlowActionXlsxReader extends AbstractXlsxReader<ActionRecordType> {
  protected mapXlsxJSONRowToRecord(xlsxJSONRow: XlsxJSONRow): ActionRecordType {
    const action = this.mapXlsxJSONRowToAction(xlsxJSONRow);

    switch (action.actionType) {
      case ActionTypeEnum.ANNOUNCEMENT:
        return this.mapXlsxJSONRowToAnnouncement(action, xlsxJSONRow);
      case ActionTypeEnum.MENU:
        return this.mapXlsxJSONRowToMenu(action, xlsxJSONRow);
      case ActionTypeEnum.MENU_OPTIONS:
        return this.mapXlsxJSONRowToMenuOptions(action, xlsxJSONRow);
      default:
        return undefined; //TODO: Should probably throw an error here or something
    }
  }

  /**
   * Post-processing needs to be performed for MenuOptions records to group them by actionId.  The uploaded XLSX file has each
   * MenuOption in the MenuOptions.options listed on its own row, this method will collect all MenuOption to make a single MenuOptions
   * record for related MenuOption rows in the XLSX file.
   * @param {Array<ActionRecordType>} actionRecords
   * @return {Array<ActionRecordType>}
   */
  protected postFileReaderProcessing(actionRecords: Array<ActionRecordType>): Array<ActionRecordType> {
    const xlsxActionIdMap: Map<string, string> = new Map<string, string>();
    const menuOptionsActions: Map<string, MenuOptions> = new Map<string, MenuOptions>();
    const processedActionRecords: Array<ActionRecordType> = [];

    // Iterate through the actionRecords, check if the actionId is a valid UUID, if not generate a new UUID for the actionId.
    // Also, consolidate all MenuOption rows to a single MenuOptions record.
    actionRecords.forEach((actionRecord: ActionRecordType) => {
      if (!uuidValidate(actionRecord.actionId)) {
        // This conditional check is due to the xlsx file having a separate row for each MenuOption in a MenuOptions record.
        // Therefore, it may have already generated a new UUID for this actionId and it will reuse the already generated UUID.
        if (xlsxActionIdMap.has(actionRecord.actionId)) {
          actionRecord.actionId = xlsxActionIdMap.get(actionRecord.actionId);
        } else {
          xlsxActionIdMap.set(actionRecord.actionId, uuidv4());
          actionRecord.actionId = xlsxActionIdMap.get(actionRecord.actionId);
        }
      }

      if (actionRecord.actionType === ActionTypeEnum.MENU_OPTIONS) {
        const menuOptions = actionRecord as MenuOptions;

        // If a previous MenuOption xlsx row has been processed for this MenuOptions record, add the MenuOption to the existing MenuOptions record.
        // This is due to the xlsx file having a separate row for each MenuOption in a MenuOptions record.
        if (menuOptionsActions.has(menuOptions.actionId)) {
          menuOptionsActions.get(menuOptions.actionId).options.push(...menuOptions.options);
        } else {
          menuOptionsActions.set(menuOptions.actionId, menuOptions);
        }
      } else {
        processedActionRecords.push(actionRecord);
      }
    });

    processedActionRecords.push(...menuOptionsActions.values());

    return processedActionRecords;
  }


  private mapXlsxJSONRowToAction(xlsxJSONRow: XlsxJSONRow): Action {
    return {
      actionId: xlsxJSONRow[XLSX_ACTION_ID] as string,
      actionType: xlsxJSONRow[XLSX_ACTION_TYPE] as ActionType,
      callFlowName: xlsxJSONRow[XLSX_CALL_FLOW_NAME] as string,
      createTime: xlsxJSONRow[XLSX_CREATE_TIME] as number,
      updateTime: xlsxJSONRow[XLSX_UPDATE_TIME] as number
    } as Action;
  }

  private mapXlsxJSONRowToAnnouncement(action: Action, xlsxJSONRow: XlsxJSONRow): Announcement {
    return {
      ...action,
      speech: xlsxJSONRow[XLSX_SPEECH] as string,
      nextActionType: xlsxJSONRow[XLSX_NEXT_ACTION_TYPE] as ActionType,
      nextActionId: xlsxJSONRow[XLSX_NEXT_ACTION_ID] as string
    } as Announcement;
  }

  private mapXlsxJSONRowToMenu(action: Action, xlsxJSONRow: XlsxJSONRow): Menu {
    const callerContextAttributes = {
      reasonForReturning: xlsxJSONRow[XLSX_MENU_REPEAT_REASON_FOR_RETURNING] as string
    };

    return {
      ...action,
      speech: xlsxJSONRow[XLSX_SPEECH] as string,
      allowBargeIn: xlsxJSONRow[XLSX_MENU_ALLOW_BARGE_IN] as boolean,
      finishOnKey: xlsxJSONRow[XLSX_MENU_FINISH_ON_KEY] as string,
      minDigits: xlsxJSONRow[XLSX_MENU_MIN_DIGITS] as number,
      maxDigits: xlsxJSONRow[XLSX_MENU_MAX_DIGITS] as number,
      timeout: xlsxJSONRow[XLSX_MENU_TIMEOUT] as number,
      repeat: {
        callerContextAttributes: JSON.stringify(callerContextAttributes),
        loop: xlsxJSONRow[XLSX_MENU_REPEAT_LOOP] as number,
        nextActionId: xlsxJSONRow[XLSX_MENU_REPEAT_NEXT_ACTION_ID] as string,
        nextActionType: xlsxJSONRow[XLSX_MENU_REPEAT_NEXT_ACTION_TYPE] as ActionType
      } as Repeat,
      nextActionType: xlsxJSONRow[XLSX_NEXT_ACTION_TYPE] as ActionType,
      nextActionId: xlsxJSONRow[XLSX_NEXT_ACTION_ID] as string
    } as Menu;
  }

  private mapXlsxJSONRowToMenuOptions(action: Action, xlsxJSONRow: XlsxJSONRow): MenuOptions {
    const callerContextAttributes = {
      reasonForReturning: xlsxJSONRow[XLSX_MENU_OPTION_REASON_FOR_RETURNING] as string,
      callIntent: xlsxJSONRow[XLSX_MENU_OPTION_CALL_INTENT] as string
    };

    return {
      ...action,
      options: [{
        digit: xlsxJSONRow[XLSX_MENU_OPTION_DIGIT] as string,
        callerContextAttributes: JSON.stringify(callerContextAttributes),
        nextActionId: xlsxJSONRow[XLSX_MENU_OPTION_NEXT_ACTION_ID] as string,
        nextActionType: xlsxJSONRow[XLSX_MENU_OPTION_NEXT_ACTION_TYPE] as ActionType
      }]
    } as MenuOptions;
  }
}