const ID = "id";

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

export function sortRecords<RecordType>(records: Array<RecordType>, idKey?: string): [Array<RecordType>, DataGridStateProps] {
  let sortedRecords: Array<RecordType> = [];
  const sortKey = idKey || ID;

  if (records?.length > 0) {
    sortedRecords = records.sort((recordOne: RecordType, record2: RecordType) => ((recordOne[sortKey as keyof RecordType] as number) - (record2[sortKey as keyof RecordType] as number)));
    sortedRecords = records.map((record: RecordType, index: number) => ({
      ...record,
      id: index + 1
    }));

    const minId: number = sortedRecords[0][sortKey as keyof RecordType] as number;
    const maxId: number = sortedRecords && sortedRecords.length > 0 ? sortedRecords[sortedRecords.length - 1][sortKey as keyof RecordType] as number : minId;

    return [ sortedRecords, {
      fetching: false,
      idStart: minId,
      idEnd: maxId,
      minId,
      maxId
    }];
  } else {
    return [records, {
      fetching: false,
      idStart: 0,
      idEnd: 0,
      minId: 0,
      maxId: 0
    }];
  }
}