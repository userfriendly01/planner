import {
  AbstractSingleRecordQuery, SingleRecordResults
} from "./AbstractSingleRecordQuery";

export interface UpdateVariables<RecordType> {
  input: RecordType;
}

export abstract class AbstractUpdateQuery extends AbstractSingleRecordQuery {

  async update<RecordType>(accessToken: string, callFlowRecord: RecordType): Promise<SingleRecordResults<RecordType>> {
    const updateVariables = {
      input: callFlowRecord
    } as UpdateVariables<RecordType>;

    return this.singleRecordQuery<RecordType, UpdateVariables<RecordType>>(accessToken, updateVariables);
  }
}

