
export interface XlsxJSONRow {
  [key: string]: string | number | boolean | Array<string>;
  xlsxId: string;
}

export interface XlsxImporterResults<XlsxRowType, RecordType> {
  xlsxRows?: Array<XlsxRowType>;
  records?: Array<RecordType>;
  errors: Array<string>;
}
