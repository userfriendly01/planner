import * as xlsx from "xlsx";
import { XlsxReader } from "../Abstract.Xlsx.Reader";
import { XlsxReaderResults } from "../Xlsx.Interfaces";
import { ActionXlsxRow } from "dynamicCallFlow/Xlsx/Action.Xlsx.Interfaces";
import { ActionRecordType } from "dynamicCallFlow/GraphQL/Action.Interfaces";
import { ActionXlsxReader } from "dynamicCallFlow/Xlsx/Action.Xlsx.Reader";

export function getActionXlsxReaderResults(fileName: string): XlsxReaderResults<ActionXlsxRow, ActionRecordType> {
  return getXlsReaderResults(new ActionXlsxReader(), fileName);
}

export function getXlsReaderResults<XlsxRowType, RecordType>(xlsxReader: XlsxReader<XlsxRowType, RecordType>, fileName: string): XlsxReaderResults<XlsxRowType, RecordType> {
  const workSheet = getWorkSheet(fileName);
  return xlsxReader.processWorkSheet(workSheet);
}

export function getWorkSheet(fileName: string): xlsx.WorkSheet {
  const workBook = xlsx.readFile(fileName);
  const sheetName = workBook.SheetNames[0];
  return workBook.Sheets[sheetName];
}