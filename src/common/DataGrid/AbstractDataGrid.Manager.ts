import { DataGridState } from "./DataGridState.Manager";
import { AlertBarState } from "../StateManager/AlertBarState.Manager";
import {
  Filter,
  MasterData
} from "./DataGridState.Interfaces";

const ID = "id";
const INVALID_VALUES = [null, "null", "", undefined];

export abstract class AbstractDataGridManager<T> {
  protected dataGridState: DataGridState<T>;
  protected alertBarState: AlertBarState;

  constructor(dataGridState: DataGridState<T>, alertBarState: AlertBarState) {
    this.dataGridState = dataGridState;
    this.alertBarState = alertBarState;
  }

  get dataGrid(): DataGridState<T> {
    return this.dataGridState;
  }

  get alertBar(): AlertBarState {
    return this.alertBarState;
  }

  protected abstract retrieveData(accessToken: string): Promise<Array<T>>;

  protected abstract getPropertyValue(record: T, key: string): string | Array<string> | number | boolean | undefined;

  async loadDataGrid(accessToken: string): Promise<void> {
    this.alertBarState.info("Data loading in progress. Please wait for the complete set of data to be loaded.");

    let records = await this.retrieveData(accessToken);

    if (records?.length > 0) {
      records = records.sort((a: T, b: T) => ((a[ID as keyof T] as number) - (b[ID as keyof T] as number)));
      records = records.map((record: T, index: number) => ({
        ...record,
        id: index + 1
      }));

      const minId: number = records[0][ID as keyof T] as number;
      const maxId: number = records[records.length - 1][ID as keyof T] as number;

      // this was being set on the FlowStateVariables, but it doesn't exist in the original definition.  why was it being set?
      const masterData = this.getGridMasterData(records);

      if (Object.keys(this.getFilter()).length > 0) {
        this.filterRecords(records, minId, maxId);
      }

      this.dataGridState.state = {
        filteredData: records,
        masterData,
        fetching: false,
        idStart: minId,
        idEnd: maxId,
        minId,
        maxId
      };

      this.alertBarState.success("Successfully loaded the phone number data.");
    } else {
      //TODO: Not sure why the original code was checking phoneNumberRecords is not undefined if the if portion of this conditional
      // statement is already checking the length is greater than zero. Should be able to remove this if statement otherwise we'll be setting the values to an empty array .
      if (records) {
        this.dataGridState.setData(records)
          .setFilteredData(records);
      }

      this.dataGridState.setFetching(false);

      this.alertBarState.error("Error in retrieving records. Please check the console log");
    }
  }

  filterRecords(records?: Array<T>, minId?: number, maxId?: number): void {
    let {
      data, idStart, idEnd
    } = this.dataGridState;

    //TODO: Why set data, idStart, and idEnd and then reset it.
    if (records) {
      data = records;
      idStart = minId;
      idEnd = maxId;
    }

    const filteredRecords = data.filter(
      (record: T) => record[ID as keyof T] >= idStart && record[ID as keyof T]  <= idEnd
    );

    const filter = this.getFilter();

    if (Object.keys(filter).length > 0) {
      const filteredArray: Array<T> = [];

      filteredRecords.forEach(record => {
        let matched = 0;

        Object.keys(filter).forEach(key => {
          // A call flow record property has matched one of the filters, increment matched
          matched += this.getPropertyValue(record, key) === filter[key as keyof Filter] ? 1 : 0;
        });

        // If all elements in the filter have been matched to the call flow record, add it to the array of matched call flow records and exit the loop.
        if (Object.keys(filter).length === matched) {
          filteredArray.push(record);
          return;
        }
      });

      this.dataGridState.setFilteredData(filteredArray)
        .setFilter(filter);
    } else {
      this.dataGridState.setFilteredData(filteredRecords)
        .setFilter(filter);
    }
  }

  protected abstract getFilterCacheKey(): string;

  getFilter(): Filter {
    try {
      const filter = (JSON.parse(localStorage.getItem(this.getFilterCacheKey())) || {}) as Filter;

      Object.keys(filter).forEach(key => {
        if (!filter[key as keyof Filter] || (typeof filter[key as keyof Filter] === "string" && (filter[key as keyof T] as string).trim() === "")) {
          delete filter[key as keyof Filter];
        }
      });

      return filter;
    } catch (e) {
      console.error("Error in getting filter model from local storage", e);
      return {} as Filter;
    }
  }

  protected abstract getMasterDataCacheKey(): string;

  private getLastMasterDataCachedDateKey(): string {
    return this.getMasterDataCacheKey().concat("_lastCachedDate");
  }

  protected abstract getMasterDataItems(): Array<string>;

  protected abstract getMasterDataItemsWithList(): Array<string>;

  getGridMasterData(records: Array<T>): MasterData {
    const masterData = localStorage.getItem(this.getMasterDataCacheKey()) ?
      JSON.parse(localStorage.getItem(this.getMasterDataCacheKey())) : {} as MasterData;

    records.forEach((record: T) => this.getMasterDataItems().forEach((key: string) => {
      const propertyValue = this.getPropertyValue(record, key);

      if (!masterData[key as keyof MasterData]) {
        masterData[key as keyof MasterData] = [];
      }

      if (this.getMasterDataItemsWithList().includes(key) && propertyValue) {
        (propertyValue as Array<string>).forEach(arrayElement => {
          if (!INVALID_VALUES.includes(arrayElement)) {
            masterData[key as keyof MasterData].push(arrayElement);
          }
        });
      }

      if (typeof(propertyValue) === "string" && !INVALID_VALUES.includes(propertyValue)) {
        masterData[key as keyof MasterData].push(propertyValue);
      }
    }));

    Object.keys(masterData).forEach(key => masterData[key as keyof MasterData] = [...new Set(masterData[key as keyof MasterData])].sort());

    localStorage.setItem(this.getMasterDataCacheKey(), JSON.stringify(masterData));
    localStorage.setItem(this.getLastMasterDataCachedDateKey(), new Date().toString());

    return masterData;
  }
}