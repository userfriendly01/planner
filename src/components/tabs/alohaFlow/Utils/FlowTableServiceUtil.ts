import {
  retrieveFlowData as v1RetrieveFlowData,
  batchFlowUpdate as v1BatchFlowUpdate,
  batchDeleteItems as v1BatchDeleteItems,
  batchFlowCreate as v1BatchFlowCreate,
  retrieveDynamicFlowData as v2RetrieveFlowData,
  batchDynamicFlowUpdate as v2BatchFlowUpdate,
  batchDynamicDeleteItems as v2BatchDeleteItems,
  addFlowRule as v1AddFlowRule,
  addDynamicFlowRule as v2AddFlowRule,
  deleteFlowRule as v1DeleteFlowRule,
  deleteDynamicFlowRule as v2DeleteFlowRule,
  updateFlowDB as v1UpdateFlowDB,
  updateDynamicFlowDB as v2UpdateFlowDB
} from "services";
import {
  CctSharedCallFlowDb,
  FlowMasterData
} from "../AlohaFlow.Interfaces";
import { FormValidationRule } from "utils/interfaces";

/**
 * Retrieve all of the Call Flow records and use the rowInsert function to persist
 * the complete recordset - for example, into a DataGrid.  
 * until nextToken become null
 * @param {String} accessToken OAuth Access Token
 * @param {Number} counter - counter for the row ID
 * @param {String} nextToken - the page token to grab the next batch/page of records
 * @param {any} rowInsert - the insert function used in this function that will insert the completed row into the component
 * @returns {boolean} success (false if there were errors)
 */
export const retrieveFlowData = async (
  accessToken: string,
  counter = 1,
  nextToken = "",
  rowInsert: (result?: CctSharedCallFlowDb[]) => FlowMasterData | Promise<void>
): Promise<boolean> => {
  const firstLoad = await v2RetrieveFlowData(accessToken, counter, nextToken, rowInsert) as any;
  const secondLoad = await v1RetrieveFlowData(accessToken, firstLoad.counter, null, rowInsert, firstLoad.flowData) as any;

  return !(firstLoad.errors || secondLoad.errors);
};

export type BatchResponse = {
    errors: Array<any>,
    failure: Array<any>,
    flag: boolean,
    success: Array<any>,
    alertMsg?: string
}

/**
 * This is the Function to batch update the Flow Object to the DB
 * @param {flowData} items List of Flow object that need to update
 * @param {String} accessToken token to use while calling graphql query
 * @returns
 */
export const batchFlowUpdate = async (
  items: Array<CctSharedCallFlowDb>,
  accessToken: string
): Promise<BatchResponse> =>  {

  return await commonProcessing(items, accessToken, v1BatchFlowUpdate, v2BatchFlowUpdate);
};

/**
 * This process for insert and update is exactly the same, so we can code for it just 
 * once.  It splits the list of items into 2 - 1 for the legacy call flow table, and one 
 * for the dynamic call flow table.  After running the appropriate service function, 
 * it merges the results into 1 BatchResponse object.
 * @param {flowData} items List of Flow objects that need to update, or list of pkeys to delete
 * @param {String} accessToken token to use while calling graphql query
 * @param {Function} batchFunction1 - legacy batchFlowCreate or batchFlowUpdate
 * @param {Function} batchFunction2 - dynamic batchFlowCreate or batchFlowUpdate
 * @returns
 */
const commonProcessing = async (
  items: Array<CctSharedCallFlowDb>,
  accessToken: string,
  batchFunction1: any,
  batchFunction2: any
): Promise<BatchResponse> => {
  const items1: Array<CctSharedCallFlowDb> = [];
  const items2: Array<CctSharedCallFlowDb> = [];

  items.forEach(x => {
    if(x.nextActionId) {
      items2.push(x);
    } else {
      items1.push(x);
    }
  });

  const response = await batchFunction1(items1, accessToken) as BatchResponse;
  if(items1.length === 0) {
    response.flag = false;
    response.alertMsg = "";
  }

  if(items2.length) {
    const response2 = await batchFunction2(items2, accessToken)as BatchResponse;

    response2.errors?.forEach(x => response.errors.push(x));
    response2.failure?.forEach(x => response.failure.push(x));
    response2.success?.forEach(x => response.success.push(x));
  }
  if(response.errors?.length) {
    response.flag = true;
    response.alertMsg = "Errors occurred: " + response.errors.map(x=> x.message).join(" / ");
  }


  return response;
};

/**
 * This is the Function to batch delete the Flow Objects.
 * @param {Array<String>} items List of Flow object that need to update
 * @param {String} accessToken token to use while calling graphql query
 * @returns
 */
export const batchDeleteItems = async (
  items: Array<CctSharedCallFlowDb>,
  accessToken: string
): Promise<BatchResponse> =>  {

  const response = await v1BatchDeleteItems(items.filter(x=>!x.nextActionId).map(x => x.pkey), accessToken) as BatchResponse;
  const callFlowItems = items.filter(x=>x.nextActionId);

  if(callFlowItems.length !== 0) {
    const response2 = await v2BatchDeleteItems(callFlowItems.map(x => x.pkey), accessToken) as BatchResponse;

    if(response2) {
      response2.failure.forEach(x => response.failure.push(x));
      response2.success.forEach(x => response.success.push(x));
      response.alertMsg = response.alertMsg ?? response2.alertMsg;
    }
  }

  return response;

};

/**
   * Since the UI grid loads Call Flow records from 2 tables, we should 
   * remove duplicates from the opposite table, since they shouldn't exist.  This 
   * function will call batchDeleteItems, while toggling the nextActionId value so 
   * it will delete the rows.
   * @param {Array<CctSharedCallFlowDb>} rows - the rows just updated or created 
   * @param {String} accessToken - token to use while calling graphql query
   * @returns Promise<BatchResponse>
   */
export const deleteOppositeRows = (
  rows: Array<CctSharedCallFlowDb>,
  accessToken: string
): Promise<BatchResponse> => {
  const oppositeRows: Array<CctSharedCallFlowDb> = rows.map(x => {
    return {
      ...x,
      nextActionId: x.nextActionId? "": "simulatedNextActionId"
    } as CctSharedCallFlowDb;
  });

  const response =  batchDeleteItems(oppositeRows, accessToken);
  return response;
};

/**
 * This is the Function to batch delete the Flow Objects
 * @param {flowData} items List of Flow object that need to update
 * @param {String} accessToken token to use while calling graphql query
 * @returns
 */
export const batchFlowCreate = async (
  items: Array<CctSharedCallFlowDb>,
  accessToken: string
): Promise<BatchResponse> =>  {

  return await commonProcessing(items, accessToken, v1BatchFlowCreate, v2BatchFlowUpdate);

};

/**
 * This is the Function to add the Flow object to the DB
 * @param {CctSharedCallFlowDb} item Flow object
 * @param {String} accessToken token to use while calling graphql query
 * @param {String} curTime the current time, for the db record's create time
 * @param {Array<String>} dataRequests list of data requests.
 * @returns
 */
export const addFlowRule = (item: FormValidationRule,
  accessToken: string,
  curTime = new Date().toISOString(),
  dataRequests: Array<string>=[]): Promise<any> => {
  if(item.nextActionId?.value) {
    return v2AddFlowRule(item, accessToken, Math.floor(new Date(curTime).getTime()/1000), dataRequests);
  }

  return v1AddFlowRule(item, accessToken, curTime, dataRequests);

};

/**
 * This is the Function to update the Flow object in the DB
 * @param {CctSharedCallFlowDb} item Flow object
 * @param {String} accessToken token to use while calling graphql query
 * @returns
 */
export const updateFlowDB = (item: CctSharedCallFlowDb,
  accessToken: string): Promise<any> => {
  if(item.nextActionId) {
    return v2UpdateFlowDB(item, accessToken);
  }

  return v1UpdateFlowDB(item, accessToken);

};

/**
 * This is the Function to delete the Flow object from the DB
 * @param {CctSharedCallFlowDb} item Flow object
 * @param {String} accessToken token to use while calling graphql query
 * @returns
 */
export const deleteFlowRule = (item: CctSharedCallFlowDb,
  accessToken: string): Promise<any> => {
  if(item.nextActionId) {
    return v2DeleteFlowRule(item, accessToken);
  }

  return v1DeleteFlowRule(item, accessToken);

};
