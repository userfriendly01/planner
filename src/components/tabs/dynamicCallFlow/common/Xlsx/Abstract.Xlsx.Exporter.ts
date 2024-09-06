import * as XLSX from "xlsx";

export abstract class AbstractXlsxExporter<XlsxRowType, RecordType> {
  private readonly workBooks: Map<string, XLSX.WorkBook> = new Map<string, XLSX.WorkBook>();

  async exportXlsxFiles(records: Array<RecordType>, fileName?: string): Promise<void> {
    this.generateWorkBooks(records);

    for (const [workBookName, workBook] of this.workBooks) {
      await XLSX.writeFileXLSX(workBook, `${fileName.concat("-") || ""}${workBookName}.xlsx`);
    }
  }

  generateWorkBooks(records: Array<RecordType>): Map<string, XLSX.WorkBook> {
    const recordsGroupedByWorkBookNames: Map<string, Array<RecordType>> = this.groupRecordsByWorkBookNames(records);

    recordsGroupedByWorkBookNames.forEach((groupRecords, workBookName) => {
      if (groupRecords.length > 0) {
        const xlsxRows: Array<XlsxRowType> = this.convertRecordsToXlsxRows(groupRecords);
        const workSheet = XLSX.utils.json_to_sheet(xlsxRows); // xlsxRows belong in a worksheet.
        const workBook = XLSX.utils.book_new(); // worksheet belongs in a workbook.  The workbook will be the file generated.
        // there is only one worksheet in a workbook in this case, therefore, the worksheet name and workbook name (which is what the file will be named) will be the same
        XLSX.utils.book_append_sheet(workBook, workSheet, workBookName);
        this.workBooks.set(workBookName, workBook);
      }
    });

    return this.workBooks;
  }

  abstract groupRecordsByWorkBookNames(records: Array<RecordType>): Map<string, Array<RecordType>>;

  abstract convertRecordsToXlsxRows(records: Array<RecordType>): Array<XlsxRowType>;
}