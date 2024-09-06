import * as xlsx from "xlsx";
import { XlsxImporter } from "../Abstract.Xlsx.Importer";
import { XlsxImporterResults } from "../Xlsx.Interfaces";

export const DYNAMIC_CALL_FLOW_PATH = "src/components/tabs/dynamicCallFlow/";
export const DYNAMIC_CALL_FLOW_COMMON_XLSX_TEST_PATH = DYNAMIC_CALL_FLOW_PATH.concat("common/Xlsx/test/");



export function getXlsImporterResults<XlsxRowType, RecordType>(xlsxImporter: XlsxImporter<XlsxRowType, RecordType>, fileName: string): XlsxImporterResults<XlsxRowType, RecordType> {
  const workSheet = getWorkSheet(fileName);
  return xlsxImporter.processWorkSheet(workSheet);
}

export function getWorkSheet(fileName: string): xlsx.WorkSheet {
  const workBook = xlsx.readFile(fileName);
  const sheetName = workBook.SheetNames[0];
  return workBook.Sheets[sheetName];
}