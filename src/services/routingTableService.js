/* eslint-disable no-console */
import { env } from "globals";
import {
  logger, removeAllWhiteSpace
} from "utils";

/**
 * This is the function use to query the appsync API to get the data from DB
 * @param {String} accessToken token to use while calling graphql query
 * @param {String} nextToken Token for next set of data
 * @returns list of data and nextToken if any
 */
async function queryRoutingData(accessToken, nextToken = null) {
  let result = {};
  try {
    const response = await fetch(env.GRAPH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken
      },
      body: JSON.stringify({
        query: `
            query listCctSharedCallRoutingGlobalDbs {
                listCctSharedCallRoutingGlobalDbs(limit: 10000, nextToken: ${nextToken ? JSON.stringify(nextToken) : nextToken}) {
                  nextToken
                  items {
                        all
                        pkey
                        skey
                        brand
                        callerState
                        callerType
                        callIntent
                        channel
                        dayOfWeek
                        transferDestination
                        transferMessage
                        twilioSkill
                        percentOfCallers
                        policyType
                        startTime
                        endTime
                        crcSkill
                        priority
                        alternateTransferDestination
                        tfnRoutingGroup
                        occupancyCheck {
                          percentage
                          team
                        }
                        routingSteps {
                          callerState
                          teams
                          time
                        }
                    }
                }
            }
        `,
        variables: {}
      })
    });
    result = await response.json();
  } catch (error) {
    logger.error("Error in queryRoutingData", error);
  }
  return result;
}

/**
 * This is the function to use to call queryRoutingData function multiple time
 * until nextToken become null
 * @param {String} accessToken token to use while calling graphql query
 * @returns {routingData} list of data contain all the result present in DB
 */
async function retrieveRoutingData(accessToken,firstChunkData) {
  let routingData = [];
  let isFirstTime = true;
  let result = firstChunkData;
  let listItems = firstChunkData?.data?.listCctSharedCallRoutingGlobalDbs?.items || [];
  try {
    while (isFirstTime || result.data?.listCctSharedCallRoutingGlobalDbs.nextToken) {
      if(!isFirstTime || Object.keys(firstChunkData).length === 0){
        result = await queryRoutingData(accessToken, result.data?.listCctSharedCallRoutingGlobalDbs
          .nextToken);
        listItems = result.data?.listCctSharedCallRoutingGlobalDbs?.items || [];
      }
      const tempRoutingData = listItems.map(elem => (
        {
          ...elem,
          id: elem &&
            elem.skey &&
            parseInt(elem.skey.split("__")[2], 10)
        })) || [];
      routingData = routingData.concat(tempRoutingData);
      isFirstTime = false;
    }
  } catch (error) {
    logger.error("Error in retrieveRoutingData", error);
  }
  return routingData;
}

/**
 * This is the Function to update the Routing Object ]to the DB
 * @param {routingData} item Routing object that need to update
 * @param {String} accessToken token to use while calling graphql query 
 * @returns 
 */
async function updateRoutingDB(item, accessToken) {
  let response;
  const input = {
    pkey: item.pkey,
    skey: item.skey,
    brand: item.brand,
    channel: item.channel,
    callIntent: item.callIntent,
    dayOfWeek: item.dayOfWeek,
    callerState: item.callerState,
    callerType: item.callerType,
    twilioSkill: item.twilioSkill || "",
    transferDestination: item.transferDestination || "",
    percentOfCallers: item.percentOfCallers,
    transferMessage: item.transferMessage || "",
    policyType: item.policyType,
    startTime: item.startTime,
    endTime: item.endTime,
    alternateTransferDestination: item?.alternateTransferDestination,
    crcSkill: item.crcSkill || "",
    priority: item?.priority || "",
    occupancyCheck: item?.occupancyCheck || [],
    routingSteps: item?.routingSteps || [],
    tfnRoutingGroup: item?.tfnRoutingGroup || ""
  };
  try {
    const fetchResponse = await fetch(env.GRAPH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken
      },
      body: JSON.stringify({
        query: `
          mutation updateCctSharedCallRoutingGlobalDb($input: UpdateCctSharedCallRoutingGlobalDbInput!) {
            updateCctSharedCallRoutingGlobalDb(input: $input) {
              pkey
              skey
              brand
              callerState
              callerType
              callIntent
              channel
              dayOfWeek
              endTime
              percentOfCallers
              policyType
              startTime
              transferDestination
              transferMessage
              twilioSkill
              crcSkill
              priority
              alternateTransferDestination
              tfnRoutingGroup
              occupancyCheck {
                percentage
                team
              }
              routingSteps {
                callerState
                teams
                time
              }
            }
          }
      `,
        variables: {
          input
        }
      })
    });
    response = await fetchResponse.json();
    logger.log("updateRoutingDB Response:", response);
  } catch (error) {
    logger.error("Error in updateRoutingDB", error);
  }
  return response;
}

/**
 * This is the Function to add the Routing Object ]to the DB
 * @param {routingData} item Routing object that need to add
 * @param {String} accessToken token to use while calling graphql query 
 * @returns 
 */
async function addRoutingRule(item, accessToken) {
  let response;
  const input = {
    all: "ALL",
    pkey: item.pkey.value,
    skey: item.skey.value,
    brand: item.brand.value,
    channel: item.channel.value,
    callIntent: item.callIntent.value,
    dayOfWeek: item.dayOfWeek.value,
    callerState: item.callerState.value,
    callerType: item.callerType.value,
    twilioSkill: item.twilioSkill?.value || "",
    transferDestination: item.transferDestination?.value || "",
    percentOfCallers: item.percentOfCallers?.value,
    transferMessage: item.transferMessage?.value || "",
    policyType: item.policyType.value,
    startTime: item.startTime.value,
    endTime: item.endTime.value,
    alternateTransferDestination: item.alternateTransferDestination?.value || "",
    crcSkill: item.crcSkill?.value || "",
    priority: item.priority?.value || "",
    occupancyCheck: item.occupancyCheck?.value || [],
    routingSteps: item.routingSteps?.value || [],
    tfnRoutingGroup: item?.tfnRoutingGroup?.value || ""
  };
  try {
    const fetchResponse = await fetch(env.GRAPH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken
      },
      body: JSON.stringify({
        query: `
          mutation AddOne($input: CreateCctSharedCallRoutingGlobalDbInput!) {
            createCctSharedCallRoutingGlobalDb(input: $input) {
              pkey
              skey
              brand
              callerState
              callerType
              callIntent
              channel
              dayOfWeek
              endTime
              percentOfCallers
              policyType
              startTime
              transferDestination
              transferMessage
              twilioSkill
              crcSkill
              priority
              alternateTransferDestination
              tfnRoutingGroup
              occupancyCheck {
                percentage
                team
              }
              routingSteps {
                callerState
                teams
                time
              }
            }
          }
      `,
        variables: {
          input
        }
      })
    });
    response = await fetchResponse.json();
    logger.log("Add Routing Rule Response:", response);
  } catch (error) {
    logger.error("Error in Adding Routing Rule", error);
  }
  return response;
}

/**
 * This is the Function to delete the Routing Object ]to the DB
 * @param {routingData} item Routing object that need to delete
 * @param {String} accessToken token to use while calling graphql query 
 * @returns 
 */
async function deleteRoutingRule(item, accessToken) {
  let response;
  try {
    const fetchResponse = await fetch(env.GRAPH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken
      },
      body: JSON.stringify({
        query: `
          mutation DeleteOne {
            deleteCctSharedCallRoutingGlobalDb(input: {
                pkey: "${item.pkey}",
                skey: "${item.skey}"
              }) {
              all
              brand
              callerState
              callerType
              callIntent
              channel
              dayOfWeek
              endTime
              percentOfCallers
              policyType
              startTime
              transferDestination
              transferMessage
              twilioSkill
              crcSkill
              priority
              alternateTransferDestination
              tfnRoutingGroup
              occupancyCheck {
                percentage
                team
              }
              routingSteps {
                callerState
                teams
                time
              }
            }
          }
      `,
        variables: {
        }
      })
    });
    response = await fetchResponse.json();
    logger.log("Delete Routing Rule Response:", response);
  } catch (error) {
    logger.error("Error in Deleting Routing Rule", error);
  }
  return response;
}

async function routingBatchDelete(items, accessToken){
  var routingDeleteArray=[];
  const size=25;
  const response = {
    "success": [],
    "flag": false,
    "failure": []
  };
  while (items.length > 0){
    routingDeleteArray.push(items.splice(0, size));
  }
  for(const routeValue of routingDeleteArray){
    const keysToDelete = routeValue.map(x => {
      return {
        pkey: x.pkey,
        skey: x.skey
      };
    }
    );
    const routingRespId = routeValue.map(x=>({ "id": x.id }));

    await batchDelete(keysToDelete,accessToken).then(resp=>{
      if(!resp?.errors){
        response.success = response.success.concat(routingRespId);
      }
      else{
        console.error("error while deleting the records", resp.errors);
        response.failure = response.failure.concat(routingRespId);
        response.flag = true;
      }
    });

  }
  return response;
}

/**
 * This is the Function to delete the Routing Object ]to the DB
 * @param {routingData[]} item Routing object that need to delete
 * @param {String} accessToken token to use while calling graphql query 
 * @returns 
 */
async function batchDelete(items, accessToken) {
  let response;

  try {
    const body = JSON.stringify({
      query: `
        mutation DeleteMany {
          batchDeleteCctSharedCallRoutingGlobalDb(input: {
              routingKey: ${JSON.stringify(items)}
            }) {
            items {
              pkey
              skey
            }
          }
        }
    `,
      variables: {
      }
    }).replace(/\\"pkey\\":/g, "pkey:").replace(/\\"skey\\":/g, "skey:");

    const fetchResponse = await fetch(env.GRAPH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken
      },
      body
    });
    response = await fetchResponse.json();
    logger.log("Batch Delete Routing Rule Response:", response);
  } catch (error) {
    logger.error("Error in Routing Batch Delete", error);
  }
  return response;
}

async function routingBatchUpdate(items, accessToken){
  var routingDeleteArray=[];
  const size=25;
  const response = {
    success: [],
    flag: false,
    failure: [],
    alertMsg: ""
  };
  if(items.length === 0){
    response.alertMsg = "Please Select Something to Edit";
    response.flag=true;
  }
  while (items.length > 0){
    routingDeleteArray.push(items.splice(0, size));
  }
  for(var i=0; i<routingDeleteArray.length; i++){
    await batchRoutingUpdate(routingDeleteArray[i],accessToken).then(resp=>{
      if(!resp?.errors){
        response.success = response.success.concat(routingDeleteArray[i]);
      }
      else{
        console.error("error while updating the records", resp.errors);
        response.failure = response.failure.concat(routingDeleteArray[i]);
        response.flag = true;
      }
    });
  }
  return response;
}


/**
 * This is the Function to batch update the Routing Object to the DB
 * @param {routingData} items List of Routing object that need to update
 * @param {String} accessToken token to use while calling graphql query 
 * @returns 
 */
const batchRoutingUpdate = async(items, accessToken) =>{
  let response;
  const input = items.map(item=>{
    return {
      all: "ALL",
      pkey: item.pkey,
      skey: item.skey,
      brand: item.brand,
      channel: item.channel,
      callIntent: item.callIntent,
      dayOfWeek: item.dayOfWeek,
      callerState: item.callerState,
      callerType: item.callerType,
      twilioSkill: item.twilioSkill || "",
      transferDestination: item.transferDestination || "",
      percentOfCallers: item.percentOfCallers,
      transferMessage: item.transferMessage || "",
      policyType: item.policyType,
      startTime: item.startTime,
      endTime: item.endTime,
      crcSkill: item.crcSkill || "",
      priority: item?.priority || "",
      occupancyCheck: item?.occupancyCheck || [],
      routingSteps: item?.routingSteps || [],
      tfnRoutingGroup: item?.tfnRoutingGroup || "",
      alternateTransferDestination: item?.alternateTransferDestination || ""
    };
  });
  try {
    const fetchResponse = await fetch(env.GRAPH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken
      },
      body: JSON.stringify({
        query: `
        mutation batchUpdateCctSharedCallRoutingDb($input: CctSharedCallRoutingDbBatchUpdateInput!) {
          batchUpdateCctSharedCallRoutingDb(input: $input) {
            items {
              all
              brand
              callIntent
              callerState
              callerType
              channel
              crcSkill
              dayOfWeek
              endTime
              occupancyCheck {
                percentage
                team
              }
              percentOfCallers
              pkey
              policyType
              priority
              routingSteps {
                callerState
                teams
                time
              }
              skey
              startTime
              transferDestination
              transferMessage
              twilioSkill
              tfnRoutingGroup
              alternateTransferDestination
            }
            nextToken
          }
        }
      `,
        variables: {
          input: { batchRoutingUpdateInput: input }
        }
      })
    });
    response = await fetchResponse.json();
    logger.info("Update Batch RoutingDB Response:", { response });
  } catch (error) {
    logger.error("Error in Update Batch RoutingDB", { error });
  }
  return response;
};

async function routingBatchCreate(items, accessToken){
  var routingDeleteArray=[];
  const size=25;
  const response = {
    success: [],
    flag: false,
    failure: [],
    alertMsg: ""
  };
  if(items.length === 0){
    response.alertMsg="Please Select Something to Add";
    response.flag = true;
  }
  while (items.length > 0){
    routingDeleteArray.push(items.splice(0, size));
  }
  for(var i=0; i<routingDeleteArray.length; i++){
    await batchRoutingCreate(routingDeleteArray[i], accessToken).then(resp=>{
      if(!resp?.errors){
        response.success = response.success.concat(routingDeleteArray[i]);
      }
      else{
        console.error("error while creating the records", resp.errors);
        response.failure = response.failure.concat(routingDeleteArray[i]);
        response.flag = true;
        response.alertMsg = "error while creating the records";
      }
    });
  }
  return response;
}

/**
 * This is the Function to batch Create the Routing Object to the DB
 * @param {routingData} items List of Routing object that need to update
 * @param {String} accessToken token to use while calling graphql query
 * @returns
 */
const batchRoutingCreate = async(items, accessToken) =>{
  let response;
  const input = items.map(item=>{
    return {
      all: "ALL",
      pkey: removeAllWhiteSpace(item.callIntent).toLocaleLowerCase(),
      skey: removeAllWhiteSpace(`${item.brand}__${item.channel}__${item.id}`).toLocaleLowerCase(),
      brand: item.brand,
      channel: item.channel,
      callIntent: item.callIntent,
      dayOfWeek: item.dayOfWeek,
      callerState: item.callerState,
      callerType: item.callerType,
      twilioSkill: item.twilioSkill || "",
      transferDestination: item.transferDestination || "",
      percentOfCallers: item.percentOfCallers,
      transferMessage: item.transferMessage || "",
      policyType: item.policyType,
      startTime: item.startTime,
      endTime: item.endTime,
      crcSkill: item.crcSkill || "",
      priority: item?.priority || "",
      occupancyCheck: item?.occupancyCheck || [],
      routingSteps: item?.routingSteps || [],
      tfnRoutingGroup: item?.tfnRoutingGroup || "",
      alternateTransferDestination: item?.alternateTransferDestination || ""
    };
  });
  try {
    const fetchResponse = await fetch(env.GRAPH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken
      },
      body: JSON.stringify({
        query: `
        mutation batchCreateCctSharedCallRoutingGlobalDb($input: CctSharedCallRoutingGlobalDbBatchCreateInput!) {
          batchCreateCctSharedCallRoutingGlobalDb(input: $input) {
            items {
              all
              brand
              callIntent
              callerState
              callerType
              channel
              crcSkill
              dayOfWeek
              endTime
              occupancyCheck {
                percentage
                team
              }
              percentOfCallers
              pkey
              policyType
              priority
              routingSteps {
                callerState
                teams
                time
              }
              skey
              startTime
              transferDestination
              transferMessage
              twilioSkill
              tfnRoutingGroup
              alternateTransferDestination
            }
            nextToken
          }
        }
      `,
        variables: {
          input: { batchRoutingCreateInput: input }
        }
      })
    });
    response = await fetchResponse.json();
    logger.log("Update Batch RoutingDB Response:", response);
  } catch (error) {
    logger.error("Error in Update Batch RoutingDB", error);
  }
  return response;
};

export {
  addRoutingRule,
  batchDelete,
  deleteRoutingRule,
  queryRoutingData,
  retrieveRoutingData,
  updateRoutingDB,
  batchRoutingUpdate,
  batchRoutingCreate,
  routingBatchDelete,
  routingBatchCreate,
  routingBatchUpdate
};
