import * as XLSX from "xlsx";
import { ParsingOptions, Sheet2JSONOpts, WorkBook, WorkSheet } from "xlsx";
import { XlsxJSONRow, XlsxReaderResults } from "./Xlsx.Interfaces";

export type RECORD_DATA_TYPE_NAME = "string" | "number" | "boolean" | "stringArray" | "jsonStringify";
export enum RECORD_DATA_TYPE_NAME_ENUM {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  STRING_ARRAY = "stringArray",
  JSON_STRINGIFY = "jsonStringify"
}

const XLSX_PARSING_OPTIONS: ParsingOptions = {
  type: "array", // possible types 'base64' | 'binary' | 'buffer' | 'file' | 'array' | 'string'
  FS: "," // field separator
};

const SHEET_TO_JSON_OPTIONS: Sheet2JSONOpts = {
  raw: false
};

const ROW_NUM = "__rowNum__";

export abstract class AbstractXlsxReader<XlsxRowType, RecordType> {
  protected _xlsxReaderResults: XlsxReaderResults<XlsxRowType, RecordType> = {
    xlsxRows: [],
    records: [],
    errors: []
  };

  async processXlsxFile(changeEvent: React.ChangeEvent<HTMLInputElement>): Promise<XlsxReaderResults<XlsxRowType, RecordType>> {
    changeEvent.preventDefault();

    if (changeEvent.target.files) {
      const workBook = this.getWorkBook((await (changeEvent.target.files.item(0))) as Blob);
      return this.processWorkBook(workBook);
    } else {
      return {
        errors: ["No files selected"]
      };
    }
  }

  private getWorkBook(rawData: Blob): WorkBook {
    const fileReader = new FileReader();
    let workbook: WorkBook;

    fileReader.onload = (progressEvent: ProgressEvent<FileReader>) => {
      workbook = XLSX.read(progressEvent.target?.result, XLSX_PARSING_OPTIONS);
    };

    fileReader.readAsArrayBuffer(rawData);

    return workbook;
  }

  processWorkBook(workBook: WorkBook): XlsxReaderResults<XlsxRowType, RecordType> {
    const sheetName = workBook.SheetNames[0];
    const workSheet = workBook.Sheets[sheetName];

    try {
      const xlsxRows: Array<XlsxRowType> = XLSX.utils.sheet_to_json<XlsxRowType>(workSheet, SHEET_TO_JSON_OPTIONS);

      this.inspectXlsxRows(xlsxRows);
      this._xlsxReaderResults.records = this.generateRecords(xlsxRows);
    } catch (error) {
      this._xlsxReaderResults.errors.push(error.message);
    }

    return this._xlsxReaderResults;
  }

  protected abstract inspectXlsxRows(xlsxRows: Array<XlsxRowType>): void

  protected abstract generateRecords(xlsxRows: Array<XlsxRowType>): Array<RecordType>;
}