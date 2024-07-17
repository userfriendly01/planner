import {
  DYNAMIC_CALL_FLOW_PATH,
  getXlsImporterResults
} from "components/tabs/dynamicCallFlow/common/Xlsx/test/Xlsx.Testing.Util";
import { XlsxImporterResults } from "components/tabs/dynamicCallFlow/common/Xlsx/Xlsx.Interfaces";
import { ActionXlsxRow } from "components/tabs/dynamicCallFlow/action/Xlsx/Action.Xlsx.Interfaces";
import { ActionRecordType } from "components/tabs/dynamicCallFlow/action/GraphQL/Action.Interfaces";
import { ActionXlsxImporter } from "components/tabs/dynamicCallFlow/action/Xlsx/Action.Xlsx.Importer";

export const ACTION_XLSX_TEST_PATH = DYNAMIC_CALL_FLOW_PATH.concat("action/Xlsx/test/");

export function getActionXlsxImporterResults(fileName: string): XlsxImporterResults<ActionXlsxRow, ActionRecordType> {
  return getXlsImporterResults(new ActionXlsxImporter(), ACTION_XLSX_TEST_PATH.concat(fileName));
}