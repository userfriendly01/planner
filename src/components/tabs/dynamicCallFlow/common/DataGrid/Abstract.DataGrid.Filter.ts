import { FieldOptions } from "../Form/AbstractFormFieldOptionsManager";
import {
  DataGridFilterRef, ReactSetState
} from "../DynamicCallFlow.Interfaces";

const ID = "id";

export interface Filter {
  [key: string]: string | number | boolean | Array<string | number | boolean> | undefined | null | Record<string, any> | Record<string, any>[];
}

export interface DataGridFilterModalProps<RecordType> {
  isOpen: boolean;
  dataGridFilter: DataGridFilterRef<RecordType>
}

export interface DataGridFilter<RecordType> {
  set sourceRecords(records: Array<RecordType>);
  set fieldOptions(fieldOptions: FieldOptions);
  get fieldOptions(): FieldOptions;
  saveFilter(filter: Filter): void;
  addFilterElement(key: string, value: string): Filter;
  removeFilterElement(key: string): Filter;
  getFilter(): Filter;
  applyFilter(minId?: number, maxId?: number): void;
  resetFilter(): Filter;
}

export abstract class AbstractDataGridFilter<RecordType> implements DataGridFilter<RecordType> {
  private _sourceRecords: Array<RecordType> = [];
  private _fieldOptions: FieldOptions = {};
  private _setDataGridRecords: ReactSetState<RecordType[]>;

  constructor(setDataGridRecords: ReactSetState<RecordType[]>) {
    this._setDataGridRecords = setDataGridRecords;
  }

  set sourceRecords(records: Array<RecordType>) {
    this._sourceRecords = records;
  }

  set fieldOptions(fieldOptions: FieldOptions) {
    this._fieldOptions = fieldOptions;
  }

  get fieldOptions(): FieldOptions {
    return this._fieldOptions;
  }

  abstract getFilterCacheKey(): string;

  resetFilter(): Filter {
    this.saveFilter({} as Filter);

    return {};
  }

  addFilterElement(key: string, value: string): Filter {
    const filter = this.getFilter();

    if (key && key.trim().length > 0 && value && value.trim().length > 0) {
      filter[key] = value;
      this.saveFilter(filter);
    }

    return filter;
  }

  removeFilterElement(key: string): Filter {
    const filter = this.getFilter();
    delete filter[key];
    this.saveFilter(filter);
    this.applyFilter();
    return filter;
  }

  saveFilter(filter: Filter): void {
    localStorage.setItem(this.getFilterCacheKey(), JSON.stringify(filter));
  }

  getFilter(): Filter {
    try {
      const filter = (JSON.parse(localStorage.getItem(this.getFilterCacheKey())) || {}) as Filter;

      Object.keys(filter).forEach(key => {
        if (!filter[key as keyof Filter] || (typeof filter[key as keyof Filter] === "string" && (filter[key as keyof RecordType] as string).trim() === "")) {
          delete filter[key as keyof Filter];
        }
      });

      return filter;
    } catch (e) {
      console.error("Error in getting filter model from local storage", e);
      return {} as Filter;
    }
  }

  protected abstract getPropertyValue(record: RecordType, key: string): string | Array<string> | number | boolean | undefined;

  applyFilter(idStart?: number, idEnd?: number): void {
    if (!this._sourceRecords) {
      return;
    }

    let recordsToFilter: Array<RecordType>;
    const filteredRecords: Array<RecordType> = [];

    if (idStart && idEnd) {
      recordsToFilter = this._sourceRecords.filter(
        (record: RecordType) => record[ID as keyof RecordType] >= idStart && record[ID as keyof RecordType] <= idEnd
      );
    } else {
      recordsToFilter = [...this._sourceRecords];
    }

    const filter = this.getFilter();

    if (Object.keys(filter).length > 0) {
      recordsToFilter.forEach(record => {
        let matched = 0;

        Object.keys(filter).forEach(key => {
          // A call flow record property has matched one of the filters, increment matched
          matched += this.getPropertyValue(record, key) === filter[key as keyof Filter] ? 1 : 0;
        });

        // If all elements in the filter have been matched to the record, add it to the array of matched call flow records and exit the loop.
        if (Object.keys(filter).length === matched) {
          filteredRecords.push(record);
          return;
        }
      });

      this._setDataGridRecords(filteredRecords);
    } else {
      this._setDataGridRecords([ ...this._sourceRecords ]);
    }
  }
}