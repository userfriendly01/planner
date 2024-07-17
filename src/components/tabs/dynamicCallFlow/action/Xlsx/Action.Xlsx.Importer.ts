import { AbstractXlsxImporter } from "components/tabs/dynamicCallFlow/common/Xlsx/Abstract.Xlsx.Importer";
import { ActionRecordType } from "components/tabs/dynamicCallFlow/action/GraphQL/Action.Interfaces";
import { ActionXlsRowType } from "components/tabs/dynamicCallFlow/action/Xlsx/Action.Xlsx.Interfaces";
import { ActionXlsxValueInspector } from "components/tabs/dynamicCallFlow/action/Xlsx/Action.Xlsx.Value.Inspector";
import { ActionXlsxIdInspector } from "components/tabs/dynamicCallFlow/action/Xlsx/Action.Xlsx.Id.Inspector";
import { ActionXlsxRecordGenerator } from "components/tabs/dynamicCallFlow/action/Xlsx/Action.Xlsx.Record.Generator";

export class ActionXlsxImporter extends AbstractXlsxImporter<ActionXlsRowType, ActionRecordType> {
  private readonly _actionIdXlsxInspector: ActionXlsxIdInspector = new ActionXlsxIdInspector();
  private readonly _actionValuesXlsxInspector: ActionXlsxValueInspector = new ActionXlsxValueInspector();
  private readonly _actionRecordsXlsxGenerator: ActionXlsxRecordGenerator = new ActionXlsxRecordGenerator();

  static getInstance(): ActionXlsxImporter {
    return new ActionXlsxImporter();
  }
  protected inspectXlsxRows(actionXlsxRows: Array<ActionXlsRowType>): void {
    this._xlsxImporterResults.errors.push(...this._actionIdXlsxInspector.inspect(actionXlsxRows));
    this._xlsxImporterResults.errors.push(...this._actionValuesXlsxInspector.inspectValues(actionXlsxRows));
  }

  protected generateRecords(actionXlsxRows: Array<ActionXlsRowType>): Array<ActionRecordType> {
    return this._actionRecordsXlsxGenerator.generateActionRecords(actionXlsxRows);
  }
}
