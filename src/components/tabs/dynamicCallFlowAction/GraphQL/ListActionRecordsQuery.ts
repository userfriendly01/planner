import { AbstractListQuery } from "../../../../common/GraphQL/AbstractListQuery";
import { ActionRecordType } from "./DynamicCallFlowActionGraphQL.Interfaces";

class ListActionRecordsQuery extends AbstractListQuery {
  protected queryName(): string {
    return "getCallFlowConfig";
  }

  //TODO: Need to implement nextToken in shared-graph-api
  protected queryDefinition(): string {
    return `
      query ${this.queryName()} {
        ${this.queryName()} {
          items {
            ... on Menu {
              allowBargeIn
              finishOnKey
              actionId
              actionType
              callFlowName
              createTime
              maxDigits
              minDigits
              nextActionId
              nextActionType
              repeat {
                callerContextAttributes
                loop
                nextActionId
                nextActionType
              }
              speech
              timeout
              updateTime
            }
            ... on MenuOptions {
              __typename
              actionId
              actionType
              callFlowName
              createTime
              updateTime
              options {
                callerContextAttributes
                digit
                nextActionId
                nextActionType
              }
            }
            ... on Announcement {
              nextActionId
              actionId
              actionType
              callFlowName
              createTime
              nextActionType
              speech
              updateTime
            }
          }
        }
      }`.replace(/[\n\r]/g, "");
  }
}

const listActionRecordsQuery = new ListActionRecordsQuery();

export async function listActionRecords(accessToken: string, nextToken: string = null): Promise<[string, Array<ActionRecordType>]> {
  const listGraphQLData = await listActionRecordsQuery.getList<ActionRecordType>(accessToken, 10000, nextToken);
  return [listGraphQLData.nextToken, listGraphQLData.items];
}