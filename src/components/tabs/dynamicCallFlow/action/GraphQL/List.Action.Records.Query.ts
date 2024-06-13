import { AbstractListRecordsQuery } from "../../common/GraphQL/AbstractListRecords.Query";
import { ActionRecordType } from "./Action.Interfaces";

class ActionListRecordsQuery extends AbstractListRecordsQuery {
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

const actionListRecordsQuery = new ActionListRecordsQuery();

export async function actionListRecords(accessToken: string, nextToken: string = null): Promise<Array<ActionRecordType>> {
  const listGraphQLData = await actionListRecordsQuery.getList<ActionRecordType>(accessToken, 10000, nextToken);
  return listGraphQLData.items;
}