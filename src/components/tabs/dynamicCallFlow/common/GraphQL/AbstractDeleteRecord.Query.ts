import {
  AbstractSingleRecordQuery, SingleRecordResults
} from "./AbstractSingleRecord.Query";
import { CallFlowDeleteInput } from "dynamicCallFlow/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { GraphQLInputVariables } from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";

export abstract class AbstractDeleteRecordQuery extends AbstractSingleRecordQuery {
  async delete<VariableType, RecordType>(accessToken: string, variables: VariableType): Promise<SingleRecordResults<RecordType>> {
    const inputVariables = {
      input: variables
    } as GraphQLInputVariables<VariableType>;

    return await this.singleRecordQuery<GraphQLInputVariables<VariableType>, RecordType>(accessToken, inputVariables);
  }
}

