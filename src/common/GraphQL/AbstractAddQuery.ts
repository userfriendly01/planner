import {
  AbstractSingleRecordQuery, SingleRecordResults
} from "./AbstractSingleRecordQuery";

export interface AddVariables<RecordType> {
  input: RecordType;
}

export abstract class AbstractAddQuery extends AbstractSingleRecordQuery {
  async add<RecordType>(accessToken: string, input: RecordType): Promise<SingleRecordResults<RecordType>> {
    const addVariables = {
      input
    } as AddVariables<RecordType>;

    return await this.singleRecordQuery<RecordType, AddVariables<RecordType>>(accessToken, addVariables);
  }
}

