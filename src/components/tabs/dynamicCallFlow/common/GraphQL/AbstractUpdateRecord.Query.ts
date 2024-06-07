import {
  AbstractSingleRecordQuery, SingleRecordResults
} from "./AbstractSingleRecord.Query";

export interface UpdateVariables<RecordType> {
  input: RecordType;
}

export abstract class AbstractUpdateRecordQuery extends AbstractSingleRecordQuery {

  async update<RecordType>(accessToken: string, record: RecordType): Promise<SingleRecordResults<RecordType>> {
    const updateVariables = {
      input: record
    } as UpdateVariables<RecordType>;

    return this.singleRecordQuery<RecordType, UpdateVariables<RecordType>>(accessToken, updateVariables);
  }
}

