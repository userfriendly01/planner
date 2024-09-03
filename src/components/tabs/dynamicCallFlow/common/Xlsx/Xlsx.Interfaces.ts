
export interface XlsxJSONRow {
  [key: string]: string | number | boolean | Array<string>;
  xlsxId?: string;
}

export interface XlsxImporterResults<XlsxRowType, RecordType> {
  headers?: Array<string>;
  xlsxRows?: Array<XlsxRowType>;
  records?: Array<RecordType>;
  errors: Array<string>;
}
