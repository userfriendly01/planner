import {
  AbstractSingleRecordQuery, SingleRecordResults
} from "./AbstractSingleRecord.Query";

export abstract class AbstractDeleteRecordQuery extends AbstractSingleRecordQuery {

  async delete<RecordType, Variables>(accessToken: string, variables: Variables): Promise<SingleRecordResults<RecordType>> {
    return await this.singleRecordQuery<RecordType, Variables>(accessToken, variables);
  }
}

