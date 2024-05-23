import {
  ActionRecord,
  ActionRecordType,
  ActionTypeEnum,
  Announcement,
  Menu,
  MenuOptions, Redirect
} from "./DynamicCallFlowActionGraphQL.Interfaces";
import { AbstractGraphQLQuery } from "../../../../common/GraphQL/AbstractGraphQLQuery";
import { GraphQLResponse } from "../../../../common/GraphQL/GraphQL.Interfaces";

interface BatchCreateDynamicActionVariables {
  input: {
    callFlowName: string;
    announcements: Array<Announcement>;
    menus: Array<Menu>;
    menuOptions: Array<MenuOptions>;
    redirects: Array<Redirect>;
  }
}

class BatchCreateDynamicActionQuery extends AbstractGraphQLQuery {
  protected batchInputName(): string {
    return "batchPhoneNumberInput";
  }

  protected queryName(): string {
    return "createCallFlowConfig";
  }

  protected queryDefinition(): string {
    return `
      mutation createCallFlowConfig($input: CallFlowConfigInput! ) {
        createCallFlowConfig(input: $input) {
            callFlowName
          }
        }`;
  }

  generateQueryVariables(actionRecords: Array<ActionRecordType>): BatchCreateDynamicActionVariables {
    const announcements: Array<Announcement> = [];
    const menus: Array<Menu> = [];
    const menuOptions: Array<MenuOptions> = [];
    const redirects: Array<Redirect> = [];
    let callFlowName = "";

    actionRecords.forEach(actionRecord => {
      switch (actionRecord.actionType) {
        case ActionTypeEnum.ANNOUNCEMENT:
          announcements.push(actionRecord as Announcement);
          break;
        case ActionTypeEnum.MENU:
          announcements.push(actionRecord as Menu);
          break;
        case ActionTypeEnum.MENU_OPTIONS:
          announcements.push(actionRecord as MenuOptions);
          break;
        case ActionTypeEnum.REDIRECT:
          announcements.push(actionRecord as Redirect);
          break;
        default:
        //TODO: log action not found
      }

      callFlowName = actionRecord.callFlowName;
    });

    return {
      input: {
        callFlowName,
        announcements,
        menus,
        menuOptions,
        redirects
      }
    } as BatchCreateDynamicActionVariables;
  }

  async runBatch(accessToken: string, actionRecords: Array<ActionRecordType>): Promise<GraphQLResponse<ActionRecordType>> {
    return await this.query<BatchCreateDynamicActionVariables, ActionRecordType>(accessToken, this.queryDefinition(), this.generateQueryVariables(actionRecords));
  }
}

const batchCreateDynamicActionQuery = new BatchCreateDynamicActionQuery();

/**
 * This method simply calls the BatchCreateDynamicActionQuery.runBatch.  It is here in case any common manipulation of the action
 * records occur, they can be done here rather than all over the application.  As of now, it appears it isn't necessary.
 * @param {string} accessToken
 * @param {Array<ActionRecordType>} actionRecords
 * @return {Promise<GraphQLResponse<ActionRecordType>>}
 */
export async function batchCreateDynamicActionRecords(accessToken: string, actionRecords: Array<ActionRecordType>): Promise<GraphQLResponse<ActionRecordType>> {
  return await batchCreateDynamicActionQuery.runBatch(accessToken, actionRecords);
}

/**
 * For dynamic action update, really we are just calling the batch create.  When a dynamic action is added
 * to DynamoDB, it will overwrite the existing record if there is one since the pkey is the phone number.  This method was
 * created simply for continuity
 * @param {string} accessToken
 * @param {Array<ActionRecordType>} actionRecords
 * @return {Promise<GraphQLResponse<ActionRecordType>>}
 */
export async function batchUpdateDynamicActionRecords(accessToken: string, actionRecords: Array<ActionRecordType>): Promise<GraphQLResponse<ActionRecordType>> {
  return await batchCreateDynamicActionRecords(accessToken, actionRecords);
}