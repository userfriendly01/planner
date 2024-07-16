import { AbstractXlsxExporter } from "dynamicCallFlowCommon/Xlsx/Abstract.Xlsx.Exporter";
import { ActionXlsxRow } from "dynamicCallFlowAction/Xlsx/Action.Xlsx.Interfaces";
import { ActionRecordType } from "dynamicCallFlowAction/GraphQL/Action.Interfaces";
import { ActionXlsxRowGenerator } from "dynamicCallFlowAction/Xlsx/Action.Xlsx.Row.Generator";

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

    actionRecords.forEach(actionRecord => {
      if (!groupedRecords.has(actionRecord.callFlowName)) {
        groupedRecords.set(actionRecord.callFlowName, []);
      }

      groupedRecords.get(actionRecord.callFlowName).push(actionRecord);
    });

    return groupedRecords;
  }
}