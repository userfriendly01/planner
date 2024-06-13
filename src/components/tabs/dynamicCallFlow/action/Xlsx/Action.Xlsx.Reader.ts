import { AbstractXlsxReader } from "../../common/Xlsx/Abstract.Xlsx.Reader";
import { ActionRecordType } from "../GraphQL/Action.Interfaces";
import { ActionXlsRowType } from "./Action.Xlsx.Interfaces";
import { ActionXlsxValueInspector } from "./Action.Xlsx.Value.Inspector";
import { ActionXlsxIdInspector } from "./Action.Xlsx.Id.Inspector";
import { ActionXlsxRecordGenerator } from "./Action.Xlsx.Record.Generator";

export class ActionXlsxReader extends AbstractXlsxReader<ActionXlsRowType, ActionRecordType> {
  private readonly _actionIdXlsxInspector: ActionXlsxIdInspector = new ActionXlsxIdInspector();
  private readonly _actionValuesXlsxInspector: ActionXlsxValueInspector = new ActionXlsxValueInspector();
  private readonly _actionRecordsXlsxGenerator: ActionXlsxRecordGenerator = new ActionXlsxRecordGenerator();

  static getInstance(): ActionXlsxReader {
    return new ActionXlsxReader();
  }
  protected inspectXlsxRows(actionXlsxRows: Array<ActionXlsRowType>): void {
    this._xlsxReaderResults.errors.push(...this._actionIdXlsxInspector.inspect(actionXlsxRows));
    this._xlsxReaderResults.errors.push(...this._actionValuesXlsxInspector.inspectValues(actionXlsxRows));
  }

  protected generateRecords(actionXlsxRows: Array<ActionXlsRowType>): Array<ActionRecordType> {
    return this._actionRecordsXlsxGenerator.generateActionRecords(actionXlsxRows);
  }
}
