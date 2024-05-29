import {
  AbstractSingleRecordQuery, SingleRecordResults
} from "./AbstractSingleRecord.Query";

export interface AddVariables<RecordType> {
  input: RecordType;
}

export abstract class AbstractCreateRecordQuery extends AbstractSingleRecordQuery {
  async create<RecordType>(accessToken: string, input: RecordType): Promise<SingleRecordResults<RecordType>> {
    const addVariables = {
      input
    } as AddVariables<RecordType>;

    return await this.singleRecordQuery<RecordType, AddVariables<RecordType>>(accessToken, addVariables);
  }
}

