import {
  AbstractFormFieldOptionsManager,
  FieldOptions
} from "dynamicCallFlowCommon/Form/AbstractFormFieldOptionsManager";
import { FieldDataType } from "dynamicCallFlowCommon/Form/Form.Interfaces";
import { ActionRecordType } from "dynamicCallFlowAction/GraphQL/Action.Interfaces";
import { ActionRecordUtil } from "dynamicCallFlowAction/GraphQL/Action.Record.Util";
import { CALL_FLOW_NAME } from "dynamicCallFlowAction/Form/ActionFields";

const DYNAMIC_CALL_FLOW_CALL_FLOW_CONFIGURATION_FORM_FIELD_OPTIONS = "DYNAMIC_CALL_FLOW_CALL_FLOW_CONFIGURATION_FORM_FIELD_OPTIONS";

export class ActionFieldOptionsManager extends AbstractFormFieldOptionsManager<ActionRecordType> {
  protected getRecordKeyValue(actionRecord: ActionRecordType, key: string): string | Array<string> | undefined {
    const keyValue: FieldDataType = ActionRecordUtil.getPropertyValue(actionRecord, key);

    if (!keyValue) {
      return undefined;
    }

    if (Array.isArray(keyValue)) {
      return keyValue as Array<string>;
    }

    return keyValue as string;
  }

  protected getFieldOptionsCacheKey(): string {
    return DYNAMIC_CALL_FLOW_CALL_FLOW_CONFIGURATION_FORM_FIELD_OPTIONS;
  }

  protected getDataDrivenOptionsFieldNames(): Array<string> {
    return [CALL_FLOW_NAME];
  }

  protected getDataDrivenOptionsFieldNamesWithList(): Array<string> {
    return [];
  }

  protected getStaticFieldOptions(): FieldOptions {
    return {} as FieldOptions;
  }
}