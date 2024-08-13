import * as XLSX from "xlsx";
import {
  ParsingOptions, Sheet2JSONOpts, WorkSheet
} from "xlsx";
import { XlsxImporterResults } from "./Xlsx.Interfaces";

export type RECORD_DATA_TYPE_NAME = "string" | "number" | "boolean" | "stringArray" | "jsonStringify";
export enum RECORD_DATA_TYPE_NAME_ENUM {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  STRING_ARRAY = "stringArray",
  JSON_STRINGIFY = "jsonStringify"
}

const XLSX_PARSING_OPTIONS: ParsingOptions = {
  type: "array" // possible types 'base64' | 'binary' | 'buffer' | 'file' | 'array' | 'string'
};

const SHEET_TO_JSON_OPTIONS: Sheet2JSONOpts = {
  raw: false,
  defval: null // defult empty cell to an empty string, or else the json object for this row will not contain the key for this cell
};

export interface XlsxImporter<XlsxRowType, RecordType> {
  processXlsxUpload(changeEvent: React.ChangeEvent<HTMLInputElement>): Promise<XlsxImporterResults<XlsxRowType, RecordType>>;
  processWorkSheet(workSheet: WorkSheet): XlsxImporterResults<XlsxRowType, RecordType>;
}

export abstract class AbstractXlsxImporter<XlsxRowType, RecordType> implements XlsxImporter<XlsxRowType, RecordType> {
  protected _xlsxImporterResults: XlsxImporterResults<XlsxRowType, RecordType> = {
    headers: [],
    xlsxRows: [],
    records: [],
    errors: []
  };

  async processXlsxUpload(changeEvent: React.ChangeEvent<HTMLInputElement>): Promise<XlsxImporterResults<XlsxRowType, RecordType>> {
    changeEvent.preventDefault();

    if (changeEvent.target.files && changeEvent.target.files.length > 0) {
      const workSheet = await this.getWorkSheet(changeEvent.target.files[0]);
      return this.processWorkSheet(workSheet);
    } else {
      return {
        errors: ["No files selected"]
      };
    }
  }

  private async getWorkSheet(file: File): Promise<WorkSheet> {
    const data = await file.arrayBuffer();
    const workBook = XLSX.read(data, XLSX_PARSING_OPTIONS);
    const sheetName = workBook.SheetNames[0];
    return workBook.Sheets[sheetName];
  }

  processWorkSheet(workSheet: WorkSheet): XlsxImporterResults<XlsxRowType, RecordType> {
    try {
      const xlsxRows: Array<XlsxRowType> = XLSX.utils.sheet_to_json<XlsxRowType>(workSheet, SHEET_TO_JSON_OPTIONS);
      if (xlsxRows.length === 0) {
        this._xlsxImporterResults.errors.push("The file is empty.");
      } else if (xlsxRows.length > 500) {
        this._xlsxImporterResults.errors.push("The maximum number of phone numbers that can be imported at one time is 500.");
      } else {
        const headers: Array<string> = (XLSX.utils.sheet_to_json<Array<string>>(workSheet, { header: 1 }))[0];
        this.inspectXlsx(headers, xlsxRows);
        this._xlsxImporterResults.records = this.generateRecords(xlsxRows);
      }
    } catch (error) {
      this._xlsxImporterResults.errors.push(error.message);
    }

    return this._xlsxImporterResults;
  }

  protected hasValidXlsxHeaders(actualColumnHeaders: Array<string>, expectedColumnHeaders: Array<string>): boolean {
    const missingColumnHeaders: Array<string> = [];

    expectedColumnHeaders.forEach((header: string) => {
      if (!actualColumnHeaders.includes(header)) {
        missingColumnHeaders.push(header);
      }
    });

    if (missingColumnHeaders.length > 0) {
      this._xlsxImporterResults.errors.push(`Missing column headers: ${missingColumnHeaders.join(", ")}`);
    }

    return missingColumnHeaders.length === 0;
  }

  protected abstract inspectXlsx(headers: Array<string>, xlsxRows: Array<XlsxRowType>): void

  protected abstract generateRecords(xlsxRows: Array<XlsxRowType>): Array<RecordType>;
}