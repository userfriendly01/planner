import {
  DYNAMIC_CALL_FLOW_PATH,
  getXlsImporterResults
} from "dynamicCallFlowCommon/Xlsx/test/Xlsx.Testing.Util";
import { XlsxImporterResults } from "dynamicCallFlowCommon/Xlsx/Xlsx.Interfaces";
import { ActionXlsxRow } from "dynamicCallFlowAction/Xlsx/Action.Xlsx.Interfaces";
import { ActionRecordType } from "dynamicCallFlowAction/GraphQL/Action.Interfaces";
import { ActionXlsxImporter } from "dynamicCallFlowAction/Xlsx/Action.Xlsx.Importer";

export const ACTION_XLSX_TEST_PATH = DYNAMIC_CALL_FLOW_PATH.concat("action/Xlsx/test/");

export function getActionXlsxImporterResults(fileName: string): XlsxImporterResults<ActionXlsxRow, ActionRecordType> {
  return getXlsImporterResults(new ActionXlsxImporter(), ACTION_XLSX_TEST_PATH.concat(fileName));
}