import {
  ActionRecordType,
  ActionTypeEnum,
  Announcement,
  Menu,
  MenuOptions, Redirect
} from "./Action.Interfaces";
import {
  AbstractGraphQLQuery, GraphQLResponse
} from "../../common/GraphQL/AbstractGraphQL.Query";
import {
  AbstractBatchRecordsQuery,
  BatchGraphQLResponse,
  BatchResults
} from "../../common/GraphQL/Abstract.BatchRecords.Query";

interface BatchCreateDynamicActionVariables {
  input: {
    callFlowName: string;
    announcements: Array<Announcement>;
    menus: Array<Menu>;
    menuOptions: Array<MenuOptions>;
    redirects: Array<Redirect>;
  }
}

class BatchCreateActionRecordsQuery extends AbstractBatchRecordsQuery<ActionRecordType, ActionRecordType>{
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

  async runCreateBatch(accessToken: string, actionRecords: Array<ActionRecordType>): Promise<BatchResults<ActionRecordType>> {
    const batchGraphQLResponse = await this.query<BatchCreateDynamicActionVariables, ActionRecordType>(accessToken, this.generateQueryVariables(actionRecords)) as BatchGraphQLResponse<ActionRecordType>;
    return this.buildResponse([batchGraphQLResponse]);
  }
}

const batchCreateDynamicActionQuery = new BatchCreateActionRecordsQuery();

/**
 * This method simply calls the BatchCreateDynamicActionQuery.runBatch.  It is here in case any common manipulation of the action
 * records occur, they can be done here rather than all over the application.  As of now, it appears it isn't necessary.
 * @param {string} accessToken
 * @param {Array<ActionRecordType>} actionRecords
 * @return {Promise<BatchResults<ActionRecordType>>}
 */
export async function batchCreateDynamicActionRecords(accessToken: string, actionRecords: Array<ActionRecordType>): Promise<BatchResults<ActionRecordType>> {
  return await batchCreateDynamicActionQuery.runCreateBatch(accessToken, actionRecords);
}

/**
 * For dynamic action update, really we are just calling the batch create.  When a dynamic action is added
 * to DynamoDB, it will overwrite the existing record if there is one since the pkey is the phone number.  This method was
 * created simply for continuity
 * @param {string} accessToken
 * @param {Array<ActionRecordType>} actionRecords
 * @return {Promise<BatchResults<ActionRecordType>>}
 */
export async function batchUpdateDynamicActionRecords(accessToken: string, actionRecords: Array<ActionRecordType>): Promise<BatchResults<ActionRecordType>> {
  return await batchCreateDynamicActionRecords(accessToken, actionRecords);
}