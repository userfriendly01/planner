import * as XLSX from "xlsx";
import {
  ParsingOptions,
  Sheet2JSONOpts
} from "xlsx";
import fs from "fs";
import { XlsxJSONRow } from "../../../../../common/XlsxReader/AbstractXlsxReader";

const XLSX_PARSING_OPTIONS: ParsingOptions = {
  type: "array", // possible types 'base64' | 'binary' | 'buffer' | 'file' | 'array' | 'string'
  FS: "," // field separator
};

const SHEET_TO_JSON_OPTIONS: Sheet2JSONOpts = {
  raw: false
};
describe("CallFlowPhoneNumberXlsxReader", () => {
  test("test reading file", () => {
    const file = fs.readFileSync("src/common/CsvReader/test/CallFlowPhoneNumber.xlsx");
    const workbook = XLSX.read(file, XLSX_PARSING_OPTIONS);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const json = XLSX.utils.sheet_to_json<XlsxJSONRow>(worksheet, SHEET_TO_JSON_OPTIONS);
    expect(json).toBeTruthy();
    console.log(JSON.stringify(json));
  });
});