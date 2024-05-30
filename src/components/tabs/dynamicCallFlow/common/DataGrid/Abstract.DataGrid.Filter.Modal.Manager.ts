import { DataGridState } from "./DataGrid.State";
import { AlertBarStateManager } from "../StateManager/AlertBar.StateManager";
import {
  AbstractReactState, ReactSetState
} from "../StateManager/Abstract.ReactState";

const ID = "id";

export interface Filter {
  [key: string]: string | number | boolean | Array<string | number | boolean> | undefined | null | Record<string, any> | Record<string, any>[];
}

export interface DataGridFilterModalManager<RecordType> {
  openModal(): void;
  closeModal(): void;
  saveFilter(filter: Filter): void;
  getFilter(): Filter;
  filterRecords(records?: Array<RecordType>, minId?: number, maxId?: number): void;
}
export interface DataGridFilterStateProps {
  filter?: Filter
  isModalOpen?: boolean;
}

export abstract class AbstractDataGridFilterModalManager<RecordType> extends AbstractReactState<DataGridFilterStateProps> implements DataGridFilterModalManager<RecordType> {
  private readonly _dataGrid: DataGridState<RecordType>;
  private readonly _alertBar: AlertBarStateManager;

  constructor(dataGrid: DataGridState<RecordType>, state: DataGridFilterStateProps, setState: ReactSetState<DataGridFilterStateProps>, alertBar: AlertBarStateManager) {
    super(state, setState);
    this._dataGrid = dataGrid;
    this._alertBar = alertBar;
  }

  abstract getFilterCacheKey(): string;

  get isModalOpen() {
    return this.state.isModalOpen;
  }

  openModal(): void {
    this.state = {
      isModalOpen: true
    };
  }

  closeModal(): void {
    this.state = {
      isModalOpen: false
    };
  }

  saveFilter(filter: Filter): void {
    this.state = {
      filter
    };
    localStorage.setItem(this.getFilterCacheKey(), JSON.stringify(filter));
    this.filterRecords();
    this.closeModal();
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

  filterRecords(records?: Array<RecordType>, minId?: number, maxId?: number): void {
    let {
      data, idStart, idEnd
    } = this._dataGrid.state;

    if (records) {
      data = records;
      idStart = minId;
      idEnd = maxId;
    }

    const filteredRecords = data.filter(
      (record: RecordType) => record[ID as keyof RecordType] >= idStart && record[ID as keyof RecordType]  <= idEnd
    );

    const filter = this.getFilter();

    if (Object.keys(filter).length > 0) {
      const filteredData: Array<RecordType> = [];

      filteredRecords.forEach(record => {
        let matched = 0;

        Object.keys(filter).forEach(key => {
          // A call flow record property has matched one of the filters, increment matched
          matched += this.getPropertyValue(record, key) === filter[key as keyof Filter] ? 1 : 0;
        });

        // If all elements in the filter have been matched to the call flow record, add it to the array of matched call flow records and exit the loop.
        if (Object.keys(filter).length === matched) {
          filteredData.push(record);
          return;
        }
      });

      this._dataGrid.state = {
        filteredData
      };

      this.state = {
        filter
      };
    } else {
      this.state = {
        filter
      };
    }
  }
}