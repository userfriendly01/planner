import { ActionRecordType } from "../DynamicCallFlowActionGraphQL.Interfaces";

export class DynamicActionRecordUtil {
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