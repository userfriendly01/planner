import {
  initializeDataGrid, sortRecords
} from "../DynamicCallFlow.Common.DataGrid";

interface TestRecord {
  id: number;
}
describe("sortRecords", () => {
  describe("initializeDataGrid", () => {
    it("shouldReturnDefaultDataGridStateProps", () => {
      const result = initializeDataGrid();
      expect(result).toEqual({
        fetching: true,
        idStart: 0,
        idEnd: 0,
        maxId: 0,
        minId: 0
      });
    });

    it("shouldReturnFetchingTrue", () => {
      const result = initializeDataGrid();
      expect(result.fetching).toBe(true);
    });

    it("shouldReturnIdStartZero", () => {
      const result = initializeDataGrid();
      expect(result.idStart).toBe(0);
    });

    it("shouldReturnIdEndZero", () => {
      const result = initializeDataGrid();
      expect(result.idEnd).toBe(0);
    });

    it("shouldReturnMaxIdZero", () => {
      const result = initializeDataGrid();
      expect(result.maxId).toBe(0);
    });

    it("shouldReturnMinIdZero", () => {
      const result = initializeDataGrid();
      expect(result.minId).toBe(0);
    });
  });

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