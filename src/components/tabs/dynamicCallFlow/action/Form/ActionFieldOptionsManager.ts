import {
  AbstractFormFieldOptionsManager,
  FieldOptions
} from "components/tabs/dynamicCallFlow/common/Form/AbstractFormFieldOptionsManager";
import { FieldDataType } from "components/tabs/dynamicCallFlow/common/Form/Form.Interfaces";
import { ActionRecordType } from "components/tabs/dynamicCallFlow/action/GraphQL/Action.Interfaces";
import { ActionRecordUtil } from "components/tabs/dynamicCallFlow/action/GraphQL/Action.Record.Util";
import { CALL_FLOW_NAME } from "components/tabs/dynamicCallFlow/action/Form/ActionFields";

const DYNAMIC_CALL_FLOW_CALL_FLOW_CONFIGURATION_FORM_FIELD_OPTIONS = "DYNAMIC_CALL_FLOW_CALL_FLOW_CONFIGURATION_FORM_FIELD_OPTIONS";

export class ActionFieldOptionsManager extends AbstractFormFieldOptionsManager<ActionRecordType> {
  protected getRecordPropertyValue(actionRecord: ActionRecordType, key: string): FieldDataType {
    return ActionRecordUtil.getPropertyValue(actionRecord, key);
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