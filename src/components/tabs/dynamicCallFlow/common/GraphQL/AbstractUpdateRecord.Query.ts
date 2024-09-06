import {
  AbstractSingleRecordQuery, SingleRecordResults
} from "./AbstractSingleRecord.Query";

import { GraphQLInputVariables } from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";

export abstract class AbstractUpdateRecordQuery extends AbstractSingleRecordQuery {
  async update<RecordType>(accessToken: string, record: RecordType): Promise<SingleRecordResults<RecordType>> {
    const updateVariables = {
      input: record
    } as GraphQLInputVariables<RecordType>;

    return this.singleRecordQuery<GraphQLInputVariables<RecordType>, RecordType>(accessToken, updateVariables);
  }
}

