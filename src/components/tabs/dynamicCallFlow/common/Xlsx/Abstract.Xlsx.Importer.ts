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
  raw: false
};

export interface XlsxImporter<XlsxRowType, RecordType> {
  processXlsxUpload(changeEvent: React.ChangeEvent<HTMLInputElement>): Promise<XlsxImporterResults<XlsxRowType, RecordType>>;
  processWorkSheet(workSheet: WorkSheet): XlsxImporterResults<XlsxRowType, RecordType>;
}

export abstract class AbstractXlsxImporter<XlsxRowType, RecordType> implements XlsxImporter<XlsxRowType, RecordType> {
  protected _xlsxImporterResults: XlsxImporterResults<XlsxRowType, RecordType> = {
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

      this.inspectXlsxRows(xlsxRows);
      this._xlsxImporterResults.records = this.generateRecords(xlsxRows);
    } catch (error) {
      this._xlsxImporterResults.errors.push(error.message);
    }

    return this._xlsxImporterResults;
  }

  protected abstract inspectXlsxRows(xlsxRows: Array<XlsxRowType>): void

  protected abstract generateRecords(xlsxRows: Array<XlsxRowType>): Array<RecordType>;
}