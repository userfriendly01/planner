import * as XLSX from "xlsx";
import {
  ParsingOptions, Sheet2JSONOpts
} from "xlsx";

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

export interface XlsxJSONRow {
  [key: string]: string | number | boolean | Array<string>;
}

// export interface XlsxReaderFailure<RecordType> {
//   record: XlsxJSONRow | RecordType;
//   error: string;
// }
//
// export interface XlsxReaderSuccess<RecordType> {
//   xlsxJSONRow: XlsxJSONRow;
//   record: RecordType;
// }

export interface XlsxReaderResults<RecordType> {
  records?: Array<RecordType>;
  error: Array<string>;
}

export abstract class AbstractXlsxReader<RecordType> {
  async generateRecords(changeEvent: React.ChangeEvent<HTMLInputElement>): Promise<XlsxReaderResults<RecordType>> {
    changeEvent.preventDefault();

    if (changeEvent.target.files) {
      return this.reader((await (changeEvent.target.files.item(0))) as Blob);
    } else {
      return {
        error: ["No files selected"]
      };
    }
  }

  reader(rawData: Blob): XlsxReaderResults<RecordType> {
    const xlsxReaderResults: XlsxReaderResults<RecordType> = {
      records: [],
      error: []
    };
    const fileReader = new FileReader();

    fileReader.onload = (progressEvent: ProgressEvent<FileReader>) => {
      const xlsxJSONRows: Array<XlsxJSONRow> = this.covertXlsxToSimpleJSON(progressEvent.target?.result);

      const HEADER_ROW = 1;

      if (typeof xlsxJSONRows === "object") {
        xlsxJSONRows.forEach((xlsxJSONRow: XlsxJSONRow) => {
          try {
            xlsxReaderResults.records.push(this.mapXlsxJSONRowToRecord(xlsxJSONRow));
          } catch (error) {
            xlsxReaderResults.error.push(error.message);
          }
        });
      }
    };

    fileReader.readAsArrayBuffer(rawData);

    xlsxReaderResults.records = this.postFileReaderProcessing(xlsxReaderResults.records);

    return xlsxReaderResults;
  }

  covertXlsxToSimpleJSON(xlsxFile: ArrayBuffer | string): Array<XlsxJSONRow> {
    const workbook = XLSX.read(xlsxFile, XLSX_PARSING_OPTIONS);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    return XLSX.utils.sheet_to_json<XlsxJSONRow>(worksheet, SHEET_TO_JSON_OPTIONS);
  }

  protected abstract mapXlsxJSONRowToRecord(xlsxJSONRow: XlsxJSONRow): RecordType;

  protected abstract postFileReaderProcessing(records: Array<RecordType>): Array<RecordType>;
}