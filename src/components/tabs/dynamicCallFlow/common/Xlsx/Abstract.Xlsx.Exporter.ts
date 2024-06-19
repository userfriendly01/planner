import * as XLSX from "xlsx";

export abstract class AbstractXlsxExporter<XlsxRowType, RecordType> {
  generateWorkBooks(records: Array<RecordType>): Map<string, XLSX.WorkBook> {
    const workBooks: Map<string, XLSX.WorkBook> = new Map<string, XLSX.WorkBook>();
    const groupedRecords: Map<string, Array<RecordType>> = this.groupRecords(records);

    groupedRecords.forEach((groupRecords, groupKey) => {
      const xlsxRows = this.convertRecordsToXlsxRows(groupRecords);
      const workSheet = XLSX.utils.json_to_sheet(xlsxRows);
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, groupKey);
      workBooks.set(groupKey, workBook);
    });

    return workBooks;
  }

  async exportXlsxFiles(workBooks: Map<string, XLSX.WorkBook>): Promise<void> {
    for (const [groupName, workBook] of workBooks) {
      await XLSX.writeFileXLSX(workBook, `${groupName}.xlsx`);
    }
  }

  protected groupRecords(records: Array<RecordType>): Map<string, Array<RecordType>> {
    const groupedRecords: Map<string, Array<RecordType>> = new Map<string, Array<RecordType>>();

    records.forEach(record => {
      const groupKey = record[this.getGroupKey() as keyof RecordType] as string;

      if (!groupedRecords.has(groupKey)) {
        groupedRecords.set(record[this.getGroupKey() as keyof RecordType] as string, []);
      }

      groupedRecords.get(groupKey).push(record);
    });

    return groupedRecords;
  }

  protected abstract getGroupKey(): string;

  protected abstract convertRecordsToXlsxRows(records: Array<RecordType>): Array<XlsxRowType>;
}