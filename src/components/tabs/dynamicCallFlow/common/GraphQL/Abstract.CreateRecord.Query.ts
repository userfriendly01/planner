import {
  AbstractSingleRecordQuery, SingleRecordResults
} from "./AbstractSingleRecord.Query";

import { GraphQLInputVariables } from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";

export abstract class AbstractCreateRecordQuery extends AbstractSingleRecordQuery {
  async create<RecordType>(accessToken: string, record: RecordType): Promise<SingleRecordResults<RecordType>> {
    const inputVariables = {
      input: record
    } as GraphQLInputVariables<RecordType>;

    return await this.singleRecordQuery<GraphQLInputVariables<RecordType>, RecordType>(accessToken, inputVariables);
  }
}

