import {
  AbstractDataGridFilter, Filter
} from "dynamicCallFlowCommon/DataGrid/Abstract.DataGrid.Filter";
import { ReactSetState } from "dynamicCallFlowCommon/DynamicCallFlow.Interfaces";

describe("AbstractDataGridFilter", () => {
  let dataGridFilter: AbstractDataGridFilter<any>;
  let mockSetDataGridRecords: ReactSetState<any[]>;
  let filter: Filter;

  beforeEach(() => {
    filter = {} as Filter;
    mockSetDataGridRecords = jest.fn();
    dataGridFilter = new (class extends AbstractDataGridFilter<any> {
      getFilterCacheKey() {
        return "testCacheKey";
      }
      getPropertyValue(record: any, key: string) {
        return record[key];
      }
      getFilter(): Filter {
        return filter;
      }
    })(mockSetDataGridRecords);
  });

  it("shouldSetSourceRecords", () => {
    const records = [{ id: 1 }, { id: 2 }];
    dataGridFilter.sourceRecords = records;
    expect(dataGridFilter["_sourceRecords"]).toEqual(records);
  });

  it("shouldSetFieldOptions", () => {
    const fieldOptions = { option1: ["value1"]};
    dataGridFilter.fieldOptions = fieldOptions;
    expect(dataGridFilter.fieldOptions).toEqual(fieldOptions);
  });

  it("shouldResetFilter", () => {
    const result = dataGridFilter.resetFilter();
    expect(result).toEqual({});
    expect(localStorage.getItem("testCacheKey")).toBe(JSON.stringify({}));
  });

  it("shouldAddFilterElement", () => {
    const result = dataGridFilter.addFilterElement("key", "value");
    expect(result).toEqual({ key: "value" });
    expect(localStorage.getItem("testCacheKey")).toBe(JSON.stringify({ key: "value" }));
  });

  it("shouldRemoveFilterElement", () => {
    dataGridFilter.addFilterElement("key", "value");
    const result = dataGridFilter.removeFilterElement("key");
    expect(result).toEqual({});
    expect(localStorage.getItem("testCacheKey")).toBe(JSON.stringify({}));
  });

  it("shouldGetFilter", () => {
    dataGridFilter.addFilterElement("key", "value");
    const result = dataGridFilter.getFilter();
    expect(result).toEqual({ key: "value" });
  });

  it("shouldReturnUnfilteredStringWhenNoFilter", () => {
    const result = dataGridFilter.filterToString();
    expect(result).toBe("Unfiltered");
  });

  it("shouldReturnFilterStringWhenFilterExists", () => {
    dataGridFilter.addFilterElement("key", "value");
    const result = dataGridFilter.filterToString();
    expect(result).toBe("key[value]");
  });

  // it("shouldApplyFilterWithSourceRecords", () => {
  //   dataGridFilter.sourceRecords = [{ id: 1 }, { id: 2 }];
  //   dataGridFilter.addFilterElement("id", "1");
  //   const result = dataGridFilter.applyFilter();
  //   expect(result).toEqual([{ id: 1 }]);
  //   expect(mockSetDataGridRecords).toHaveBeenCalledWith([{ id: 1 }]);
  // });
  //
  // it("shouldApplyFilterWithIdRange", () => {
  //   dataGridFilter.sourceRecords = [{ id: 1 }, { id: 2 }, { id: 3 }];
  //   const result = dataGridFilter.applyFilter(undefined);
  //   expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  //   expect(mockSetDataGridRecords).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
  // });

  // it("shouldThrowErrorIfNoSourceRecords", () => {
  //   expect(() => dataGridFilter.applyFilter()).toThrow("No source records to filter");
  // });
});