import { AbstractXlsxImporter } from "components/tabs/dynamicCallFlow/common/Xlsx/Abstract.Xlsx.Importer";
import { ActionRecordType } from "components/tabs/dynamicCallFlow/action/GraphQL/Action.Interfaces";
import {
  ActionXlsRowType,
  ActionXlsxHeaders
} from "components/tabs/dynamicCallFlow/action/Xlsx/Action.Xlsx.Interfaces";
import { ActionXlsxImportValidator } from "dynamicCallFlowAction/Xlsx/Action.Xlsx.Import.Validator";
import { ActionXlsxImportIdValidator } from "dynamicCallFlowAction/Xlsx/Action.Xlsx.Import.Id.Validator";
import { ActionXlsxImportRecordGenerator } from "dynamicCallFlowAction/Xlsx/Action.Xlsx.Import.Record.Generator";

export class ActionXlsxImporter extends AbstractXlsxImporter<ActionXlsRowType, ActionRecordType> {
  private readonly _actionIdXlsxInspector: ActionXlsxImportIdValidator = new ActionXlsxImportIdValidator();
  private readonly _actionXlsxImportValidator: ActionXlsxImportValidator = new ActionXlsxImportValidator();
  private readonly _actionRecordsXlsxGenerator: ActionXlsxImportRecordGenerator = new ActionXlsxImportRecordGenerator();

  static getInstance(): ActionXlsxImporter {
    return new ActionXlsxImporter();
  }
  protected inspectXlsx(headers: Array<string>, actionXlsxRows: Array<ActionXlsRowType>): void {
    if (this.hasValidXlsxHeaders(headers, ActionXlsxHeaders)) {
      this._xlsxImporterResults.errors.push(...this._actionIdXlsxInspector.inspect(actionXlsxRows));
      this._xlsxImporterResults.errors.push(...this._actionXlsxImportValidator.inspectValues(actionXlsxRows));
    }
  }

  protected generateRecords(actionXlsxRows: Array<ActionXlsRowType>): Array<ActionRecordType> {
    return this._actionRecordsXlsxGenerator.generateActionRecords(actionXlsxRows);
  }
}
