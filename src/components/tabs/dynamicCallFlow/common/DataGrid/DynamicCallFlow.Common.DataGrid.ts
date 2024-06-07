import { DataGridFilter } from "./Abstract.DataGrid.Filter";
import React from "react";

const ID = "id";

export interface DataGridContextStore<RecordType> {
  allRecords: Array<RecordType>;
  setAllRecords: React.Dispatch<React.SetStateAction<RecordType[]>>;
  dataGridRecords: Array<RecordType>;
  setDataGridRecords: React.Dispatch<React.SetStateAction<RecordType[]>>;
  selectedRecords: Array<RecordType>;
  setSelectedRecords: React.Dispatch<React.SetStateAction<RecordType[]>>;
  setDataGridProps: React.Dispatch<React.SetStateAction<DataGridStateProps>>;
  dataGridFilter: React.MutableRefObject<DataGridFilter<RecordType>>;
}

export interface DataGridStateProps {
  fetching?: boolean;
  idStart?: number;
  idEnd?: number;
  maxId?: number;
  minId?: number;
}

export function initializeDataGrid(): DataGridStateProps {
  return {
    fetching: true,
    idStart: 0,
    idEnd: 0,
    maxId: 0,
    minId: 0
  } as DataGridStateProps;
}

export function sortDataGrid<RecordType>(records: Array<RecordType>): [Array<RecordType>, DataGridStateProps] {
  let sortedRecords: Array<RecordType> = [];

  if (records?.length > 0) {
    sortedRecords = records.sort((recordOne: RecordType, record2: RecordType) => ((recordOne[ID as keyof RecordType] as number) - (record2[ID as keyof RecordType] as number)));
    sortedRecords = records.map((record: RecordType, index: number) => ({
      ...record,
      id: index + 1
    }));

    const minId: number = sortedRecords[0][ID as keyof RecordType] as number;
    const maxId: number = sortedRecords[sortedRecords.length - 1][ID as keyof RecordType] as number;

    return [ sortedRecords, {
      fetching: false,
      idStart: minId,
      idEnd: maxId,
      minId,
      maxId
    }];

    //TODO: Apply filter records on an initial load?
    // if (Object.keys(this.getFilter()).length > 0) {
    //   this.filterRecords(records, minId, maxId);
    // }
  } else {
    return [records, {
      fetching: false
    }];
  }
}