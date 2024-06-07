import { ActionRecordType } from "./DynamicCallFlowActionGraphQL.Interfaces";

export class ActionRecordUtil {
  public static getPropertyValue(actionRecord: ActionRecordType, key: string): string | Array<string> | number | boolean {
    if (!actionRecord || !key) {
      return;
    }

    return actionRecord[key as keyof ActionRecordType];
  }

  public static setPropertyValue(actionRecord: ActionRecordType, key: string, value: string | Array<string> | number | boolean): ActionRecordType {
    if (!actionRecord || !key || !value) {
      return;
    }

    return {
      ...actionRecord,
      [key]: value
    };
  }
}