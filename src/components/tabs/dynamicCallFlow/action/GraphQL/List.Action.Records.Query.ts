import { AbstractListRecordsQuery } from "components/tabs/dynamicCallFlow/common/GraphQL/AbstractListRecords.Query";
import { ActionRecordType } from "components/tabs/dynamicCallFlow/action/GraphQL/Action.Interfaces";

export class ActionListRecordsQuery extends AbstractListRecordsQuery {
  /**
   * Should probably be renamed in GraphQL to convey that it is returning all
   * call flow configs, not just one.
   */
  queryName(): string {
    return "getCallFlowConfig";
  }

  //TODO: Need to implement nextToken in shared-graph-api
  queryDefinition(): string {
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
            ... on Redirect {
              actionId
              actionType
              callFlowName
              createTime
              url
              updateTime
            }
            ... on Capture {
              actionId
              actionType
              callFlowName
              createTime
              endpoint
              parameter
              updateTime
              validLengths
              outcomes {
                outcomeType
                nextActionId
                nextActionType
              }
            }
          }
        }
      }`;
  }
}

export const listActionRecordsQuery = new ActionListRecordsQuery();

export async function listActionRecords(accessToken: string, nextToken: string = null): Promise<Array<ActionRecordType>> {
  const listGraphQLData = await listActionRecordsQuery.getList<ActionRecordType>(accessToken, 10000, nextToken);
  return listGraphQLData.items;
}