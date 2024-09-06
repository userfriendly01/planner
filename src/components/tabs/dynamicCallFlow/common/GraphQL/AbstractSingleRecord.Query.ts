import {
  AbstractGraphQLQuery
} from "./AbstractGraphQL.Query";
import {
  GraphQLError,
  GraphQLResponse
} from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";

export interface SingleRecordResults<RecordType> {
  alertMsg?: string;
  errors?: GraphQLError[];
  record?: RecordType;
  hasError?: boolean;
}

export abstract class AbstractSingleRecordQuery extends AbstractGraphQLQuery {
  protected async singleRecordQuery<VariableType, RecordType>(accessToken: string, variables: VariableType): Promise<SingleRecordResults<RecordType>> {
    const graphQLResponse =
      await this.query<VariableType, RecordType>(accessToken, variables);

    let record: RecordType;

    if (graphQLResponse.data) {
      if (Object.keys(graphQLResponse.data).includes(this.queryName())) {
        record = graphQLResponse.data[this.queryName() as keyof typeof graphQLResponse.data] as RecordType;
      } else {
        record = graphQLResponse.data as RecordType;
      }
    }

    return this.buildResponse(record, graphQLResponse);
  }

  protected buildResponse<RecordType>(record: RecordType, graphQLResponse: GraphQLResponse<RecordType>): SingleRecordResults<RecordType> {
    const singleRecordResults = {
      alertMsg: "",
      errors: [],
      record,
      hasError: false
    } as SingleRecordResults<RecordType>;

    if (graphQLResponse.errors?.length > 0) {
      singleRecordResults.errors = graphQLResponse.errors;
      singleRecordResults.hasError = true;
      singleRecordResults.alertMsg = `Errors occurred during: ${this.queryName()}`;
    }

    return singleRecordResults;
  }
}

