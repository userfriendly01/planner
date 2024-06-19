import { AbstractXlsxExporter } from "components/tabs/dynamicCallFlow/common/Xlsx/Abstract.Xlsx.Exporter";
import { ActionXlsxRow } from "dynamicCallFlow/Xlsx/Action.Xlsx.Interfaces";
import { ActionRecordType } from "dynamicCallFlow/GraphQL/Action.Interfaces";
import { ActionXlsxRecordGenerator } from "dynamicCallFlow/Xlsx/Action.Xlsx.Row.Generator";
import { CALL_FLOW_NAME } from "dynamicCallFlow/Form/ActionFields";

export class ActionXlsxExporter extends AbstractXlsxExporter<ActionXlsxRow, ActionRecordType> {
  protected getGroupKey(): string {
    return CALL_FLOW_NAME;
  }

  protected convertRecordsToXlsxRows(records: Array<ActionRecordType>): Array<ActionXlsxRow> {
    return ActionXlsxRecordGenerator.generateXlsxRows(records);
  }
}