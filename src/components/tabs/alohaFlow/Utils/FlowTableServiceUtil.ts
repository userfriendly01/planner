import {
  retrieveFlowData as v1RetrieveFlowData,
  batchFlowUpdate as v1BatchFlowUpdate,
  batchDeleteItems as v1BatchDeleteItems,
  batchFlowCreate as v1BatchFlowCreate,
  retrieveFlowData as v2RetrieveFlowData,
  batchFlowUpdate as v2BatchFlowUpdate,
  batchDeleteItems as v2BatchDeleteItems,
  batchFlowCreate as v2BatchFlowCreate,
  addFlowRule as v1AddFlowRule,
  addFlowRule as v2AddFlowRule,
  deleteFlowRule as v1DeleteFlowRule,
  deleteFlowRule as v2DeleteFlowRule,
  updateFlowDB as v1UpdateFlowDB,
  updateFlowDB as v2UpdateFlowDB
} from "services";
import {
  CctSharedCallFlowDb,
  FlowMasterData
} from "../AlohaFlow.Interfaces";

/**
 * This is the function to use to call queryFlowData function multiple time
 * until nextToken become null
 * @param {String} accessToken OAuth Access Token
 * @param {String} graphQlApiUrl Endpoint URL
 * @param {Number} counter - counter for the row ID
 * @param {String} nextToken - the page token to grab the next batch/page of records
 * @param {any} rowInsert - the insert function used in this function that will insert the completed row into the component
 */
export const retrieveFlowData = async (
  accessToken: string,
  graphQlApiUrl: string,
  counter = 1,
  nextToken = "",
  rowInsert: (result?: CctSharedCallFlowDb[]) => FlowMasterData
): Promise<void> => {
  // const firstLoad = 
  await v1RetrieveFlowData(accessToken, graphQlApiUrl, counter, nextToken, rowInsert) as any;
  // await v2RetrieveFlowData(accessToken, graphQlApiUrl, firstLoad.counter, "", rowInsert, firstLoad.flowData);
};

export type BatchResponse = {
    failure: Array<any>,
    flag: boolean,
    success: Array<any>
}

/**
 * This is the Function to batch update the Flow Object to the DB
 * @param {flowData} items List of Flow object that need to update
 * @param {String} accessToken token to use while calling graphql query
 * @param {String} graphQlApiUrl Endpoint URL
 * @returns
 */
export const batchFlowUpdate = async (
  items: Array<CctSharedCallFlowDb>,
  accessToken: string,
  graphQlApiUrl: string
): Promise<BatchResponse> =>  {

  return await commonProcessing(items, accessToken, graphQlApiUrl, v1BatchFlowUpdate, v2BatchFlowUpdate);
};

/**
 * This is the Function to batch update the Flow Object to the DB
 * @param {flowData} items List of Flow object that need to update
 * @param {String} accessToken token to use while calling graphql query
 * @param {String} graphQlApiUrl Endpoint URL
 * @returns
 */
const commonProcessing = async (
  items: Array<CctSharedCallFlowDb>,
  accessToken: string,
  graphQlApiUrl: string,
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

  const response = await batchFunction1(items1, accessToken, graphQlApiUrl) as BatchResponse;

  if(items2.length) {
    const response2 = await batchFunction2(items2, accessToken, graphQlApiUrl)as BatchResponse;

    response2.failure.forEach(x => response.failure.push(x));
    response2.success.forEach(x => response.success.push(x));
  }

  return response;
};

/**
 * This is the Function to batch delete the Flow Objects
 * @param {flowData} items List of Flow object that need to update
 * @param {String} accessToken token to use while calling graphql query
 * @param {String} graphQlApiUrl Endpoint URL
 * @returns
 */
export const batchDeleteItems = async (
  items: Array<CctSharedCallFlowDb>,
  accessToken: string,
  graphQlApiUrl: string
): Promise<BatchResponse> =>  {

  return await commonProcessing(items, accessToken, graphQlApiUrl, v1BatchDeleteItems, v2BatchDeleteItems);

};


/**
 * This is the Function to batch delete the Flow Objects
 * @param {flowData} items List of Flow object that need to update
 * @param {String} accessToken token to use while calling graphql query
 * @param {String} graphQlApiUrl Endpoint URL
 * @returns
 */
export const batchFlowCreate = async (
  items: Array<CctSharedCallFlowDb>,
  accessToken: string,
  graphQlApiUrl: string
): Promise<BatchResponse> =>  {

  return await commonProcessing(items, accessToken, graphQlApiUrl, v1BatchFlowCreate, v2BatchFlowCreate);

};

/**
 * This is the Function to add the Flow Object ]to the DB
 * @param {CctSharedCallFlowDb} item Flow object that need to add
 * @param {String} accessToken token to use while calling graphql query
 * @param {String} graphQlApiUrl Endpoint URL
 * @param {String} curTime the current time, for the db record's create time
 * @param {Array<String>} dataRequests list of data requests.
 * @returns
 */
export const addFlowRule = (item: CctSharedCallFlowDb,
  accessToken: string,
  graphQlApiUrl: string,
  curTime = new Date().toISOString(),
  dataRequests: Array<string>=[]): Promise<any> => {
  if(item.nextActionId) {
    return v2AddFlowRule(item, accessToken, graphQlApiUrl, curTime, dataRequests);
  }

  return v1AddFlowRule(item, accessToken, graphQlApiUrl, curTime, dataRequests);

};

/**
 * This is the Function to update the Flow Object ]to the DB
 * @param {CctSharedCallFlowDb} item Flow object that need to add
 * @param {String} accessToken token to use while calling graphql query
 * @param {String} graphQlApiUrl Endpoint URL
 * @returns
 */
export const updateFlowDB = (item: CctSharedCallFlowDb,
  accessToken: string,
  graphQlApiUrl: string): Promise<any> => {
  if(item.nextActionId) {
    return v2UpdateFlowDB(item, accessToken, graphQlApiUrl);
  }

  return v1UpdateFlowDB(item, accessToken, graphQlApiUrl);

};

/**
 * This is the Function to delete the Flow Object ]to the DB
 * @param {CctSharedCallFlowDb} item Flow object that need to add
 * @param {String} accessToken token to use while calling graphql query
 * @param {String} graphQlApiUrl Endpoint URL
 * @returns
 */
export const deleteFlowRule = (item: CctSharedCallFlowDb,
  accessToken: string,
  graphQlApiUrl: string): Promise<any> => {
  if(item.nextActionId) {
    return v2DeleteFlowRule(item, accessToken, graphQlApiUrl);
  }

  return v1DeleteFlowRule(item, accessToken, graphQlApiUrl);

};
