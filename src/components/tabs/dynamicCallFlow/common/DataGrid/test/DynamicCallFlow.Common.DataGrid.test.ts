import { sortRecords } from "../DynamicCallFlow.Common.DataGrid";

interface TestRecord {
  id: number;
}
describe("sortRecords", () => {
  it("shouldSortRecordsAndReturnCorrectDataGridStatePropsWhenRecordsExist", () => {
    const records: Array<TestRecord> = [{ id: 3 }, { id: 1 }, { id: 2 }];
    const [sortedRecords, dataGridStateProps] = sortRecords<TestRecord>(records);
    expect(sortedRecords).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }] as Array<TestRecord>);
    expect(dataGridStateProps).toEqual({
      fetching: false,
      idStart: 1,
      idEnd: 3,
      minId: 1,
      maxId: 3
    });
  });

  it("shouldReturnUnchangedRecordsAndDefaultDataGridStatePropsWhenNoRecordsExist", () => {
    const records: TestRecord[] = [];
    const [sortedRecords, dataGridStateProps] = sortRecords(records);
    expect(sortedRecords).toEqual([]);
    expect(dataGridStateProps).toEqual({
      fetching: false,
      idStart: 0,
      idEnd: 0,
      minId: 0,
      maxId: 0
    });
  });

  it("shouldSortRecordsAndReturnCorrectDataGridStatePropsWhenSingleRecordExists", () => {
    const records = [{ id: 1 }];
    const [sortedRecords, dataGridStateProps] = sortRecords(records);
    expect(sortedRecords).toEqual([{ id: 1 }]);
    expect(dataGridStateProps).toEqual({
      fetching: false,
      idStart: 1,
      idEnd: 1,
      minId: 1,
      maxId: 1
    });
  });
});