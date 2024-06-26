import { AbstractXlsxExporter } from "components/tabs/dynamicCallFlow/common/Xlsx/Abstract.Xlsx.Exporter";
import { ActionXlsxRow } from "dynamicCallFlow/Xlsx/Action.Xlsx.Interfaces";
import { ActionRecordType } from "dynamicCallFlow/GraphQL/Action.Interfaces";
import { ActionXlsxRowGenerator } from "dynamicCallFlow/Xlsx/Action.Xlsx.Row.Generator";
import { CALL_FLOW_NAME } from "dynamicCallFlow/Form/ActionFields";

export class ActionXlsxExporter extends AbstractXlsxExporter<ActionXlsxRow, ActionRecordType> {
  private readonly actionXlsxRowGenerator: ActionXlsxRowGenerator = new ActionXlsxRowGenerator();

  static instance(): ActionXlsxExporter {
    return new ActionXlsxExporter();
  }

  protected convertRecordsToXlsxRows(records: Array<ActionRecordType>): Array<ActionXlsxRow> {
    return this.actionXlsxRowGenerator.generateXlsxRows(records);
  }

  protected groupRecordsByWorkBookNames(actionRecords: Array<ActionRecordType>): Map<string, Array<ActionRecordType>> {
    const groupedRecords: Map<string, Array<ActionRecordType>> = new Map<string, Array<ActionRecordType>>();
    groupedRecords.set(CALL_FLOW_NAME, []);

    actionRecords.forEach(actionRecord => {
      groupedRecords.get(CALL_FLOW_NAME).push(actionRecord);
    });

    return groupedRecords;
  }
}