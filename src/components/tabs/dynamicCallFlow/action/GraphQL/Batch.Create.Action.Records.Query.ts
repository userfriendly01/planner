import {
  ActionRecordType,
  Announcement,
  Menu,
  MenuOptions, Redirect
} from "./Action.Interfaces";
import { BatchResults } from "../../common/GraphQL/Abstract.BatchRecords.Query";
import {
  AbstractGraphQLQuery
} from "components/tabs/dynamicCallFlow/common/GraphQL/AbstractGraphQL.Query";
import {
  ActionTypeEnum, GraphQLInputVariables,
  GraphQLResponse
} from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";

interface CallFlowConfig {
  callFlowName: string;
  announcements: Array<Announcement>;
  menus: Array<Menu>;
  menuOptions: Array<MenuOptions>;
  redirects: Array<Redirect>;
}

class BatchCreateActionRecordsQuery extends AbstractGraphQLQuery {
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

  generateQueryVariables(actionRecords: Array<ActionRecordType>): CallFlowConfig {
    const announcements: Array<Announcement> = [];
    const menus: Array<Menu> = [];
    const menuOptions: Array<MenuOptions> = [];
    const redirects: Array<Redirect> = [];
    let callFlowName = "";

    // Have to create new objects or else javascript will include all the properties of all action types combined for each record, which cause an error in GraphQL
    actionRecords.forEach(actionRecord => {
      switch (actionRecord.actionType) {
        case ActionTypeEnum.ANNOUNCEMENT:
          announcements.push({
            actionId: actionRecord.actionId,
            actionType: actionRecord.actionType,
            callFlowName: actionRecord.callFlowName,
            createTime: actionRecord.createTime,
            updateTime: actionRecord.updateTime,
            speech: (actionRecord as Announcement).speech,
            nextActionType: (actionRecord as Announcement).nextActionType,
            nextActionId: (actionRecord as Announcement).nextActionId
          } as Announcement);
          break;
        case ActionTypeEnum.MENU:
          menus.push({
            actionId: actionRecord.actionId,
            actionType: actionRecord.actionType,
            callFlowName: actionRecord.callFlowName,
            createTime: actionRecord.createTime,
            updateTime: actionRecord.updateTime,
            speech: (actionRecord as Menu).speech,
            allowBargeIn: (actionRecord as Menu).allowBargeIn,
            finishOnKey: (actionRecord as Menu).finishOnKey,
            minDigits: (actionRecord as Menu).minDigits,
            maxDigits: (actionRecord as Menu).maxDigits,
            timeout: (actionRecord as Menu).timeout,
            repeat: (actionRecord as Menu).repeat,
            nextActionType: (actionRecord as Menu).nextActionType,
            nextActionId: (actionRecord as Menu).nextActionId
          } as Menu);
          break;
        case ActionTypeEnum.MENU_OPTIONS:
          menuOptions.push({
            actionId: actionRecord.actionId,
            actionType: actionRecord.actionType,
            callFlowName: actionRecord.callFlowName,
            createTime: actionRecord.createTime,
            updateTime: actionRecord.updateTime,
            options: (actionRecord as MenuOptions).options
          } as MenuOptions);
          break;
        case ActionTypeEnum.REDIRECT:
          redirects.push({
            actionId: actionRecord.actionId,
            actionType: actionRecord.actionType,
            callFlowName: actionRecord.callFlowName,
            createTime: actionRecord.createTime,
            updateTime: actionRecord.updateTime,
            url: (actionRecord as Redirect).url
          } as Redirect);
          break;
        default:
        //TODO: log action not found
      }

      callFlowName = actionRecord.callFlowName;
    });

    return {
      callFlowName,
      announcements,
      menus,
      menuOptions,
      redirects
    } as CallFlowConfig;
  }

  /**
   * This method mimics the AbstractBatchRecordsQuery.buildResponse as this particular batch job cannot extend that abstract class
   * since it bundles the ActionRecords into the subtypes of Announcement, Menu, MenuOptions, and Redirect.  We should look in to
   * NOT bundling the records up in that manner and send all records to GraphQL and let GraphQL separate them by ActionType.  That
   * would enable this batch job to extend the AbstractBatchRecordsQuery class and follow the pattern of the other batch jobs.
   * @param {string} accessToken
   * @param {Array<ActionRecordType>} actionRecords
   * @return {Promise<BatchResults<ActionRecordType>>}
   */
  async batchQuery(accessToken: string, actionRecords: Array<ActionRecordType>): Promise<BatchResults<ActionRecordType>> {
    const variables = {
      input: this.generateQueryVariables(actionRecords)
    } as GraphQLInputVariables<CallFlowConfig>;

    const graphQlResponse: GraphQLResponse<CallFlowConfig> = await this.query<GraphQLInputVariables<CallFlowConfig>, CallFlowConfig>(accessToken, variables);

    return {
      alertMsg: graphQlResponse.errors?.length === 0 ? "" : `Errors occurred processing ${this.queryName()} records`,
      errors: graphQlResponse.errors || [],
      failure: graphQlResponse.errors?.length > 0 ? actionRecords : [],
      hasError: graphQlResponse.errors?.length > 0,
      success: graphQlResponse.errors?.length === 0 ? actionRecords : []
    } as BatchResults<ActionRecordType>;
  }
}

const batchCreateDynamicActionQuery = new BatchCreateActionRecordsQuery();


export async function batchCreateDynamicActionRecords(accessToken: string, actionRecords: Array<ActionRecordType>): Promise<BatchResults<ActionRecordType>> {
  return await batchCreateDynamicActionQuery.batchQuery(accessToken, actionRecords);
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
  //Need to call the delete method first to remove the existing records and then add them again.
  return await batchCreateDynamicActionRecords(accessToken, actionRecords);
}