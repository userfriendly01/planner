import {
  AbstractSingleRecordQuery, SingleRecordResults
} from "./AbstractSingleRecordQuery";

export abstract class AbstractDeleteQuery extends AbstractSingleRecordQuery {

  async delete<RecordType, Variables>(accessToken: string, variables: Variables): Promise<SingleRecordResults<RecordType>> {
    return await this.singleRecordQuery<RecordType, Variables>(accessToken, variables);
  }
}

