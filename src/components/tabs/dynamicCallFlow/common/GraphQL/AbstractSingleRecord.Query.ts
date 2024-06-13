import {
  AbstractGraphQLQuery, GraphQLError, GraphQLResponse
} from "./AbstractGraphQL.Query";

export interface SingleRecordGraphQLData<RecordType> {
  [key: string]: RecordType;
}

export interface SingleRecordResults<RecordType> {
  alertMsg?: string;
  errors?: GraphQLError[];
  record?: RecordType;
  hasError?: boolean;
}

export abstract class AbstractSingleRecordQuery extends AbstractGraphQLQuery {
  protected async singleRecordQuery<RecordType, Variables>(accessToken: string, variables: Variables): Promise<SingleRecordResults<RecordType>> {
    const graphQLResponse =
      await this.query<Variables, SingleRecordGraphQLData<RecordType>>(accessToken, variables);

    let record: RecordType;

    if (graphQLResponse.data) {
      record = graphQLResponse.data[this.queryName() as keyof typeof graphQLResponse.data] as RecordType;
    }

    return this.buildResponse(record, graphQLResponse);
  }

  protected buildResponse<RecordType>(record: RecordType, graphQLResponse: GraphQLResponse<SingleRecordGraphQLData<RecordType>>): SingleRecordResults<RecordType> {
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

