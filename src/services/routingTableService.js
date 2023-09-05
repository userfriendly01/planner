/* eslint-disable no-console */

import { logger } from "utils";

/**
 * This is the function use to query the appsync API to get the data from DB
 * @param {String} accessToken token to use while calling graphql query
 * @param {String} nextToken Token for next set of data
 * @param {String} graphQlApiUrl GraphQL Endpoint for Query and Mutation
 * @returns list of data and nextToken if any
 */
async function queryRoutingData(accessToken, nextToken = null, graphQlApiUrl) {
  let result = {};
  try {
    const response = await fetch(graphQlApiUrl, {
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
 * @param {*} graphQlApiUrl GraphQL Endpoint for Query and Mutation
 * @returns {routingData} list of data contain all the result present in DB
 */
async function retrieveRoutingData(accessToken, graphQlApiUrl,firstChunkData) {
  let routingData = [];
  let isFirstTime = true;
  let result = firstChunkData;
  let listItems = firstChunkData?.data?.listCctSharedCallRoutingGlobalDbs?.items || [];
  try {
    while (isFirstTime || result.data?.listCctSharedCallRoutingGlobalDbs.nextToken) {
      if(!isFirstTime || Object.keys(firstChunkData).length === 0){
        result = await queryRoutingData(accessToken, result.data?.listCctSharedCallRoutingGlobalDbs
          .nextToken, graphQlApiUrl);
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
 * @param {String} graphQlApiUrl Endpoint URL 
 * @returns 
 */
async function updateRoutingDB(item, accessToken, graphQlApiUrl) {
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
    routingSteps: item?.routingSteps || []
  };
  try {
    const fetchResponse = await fetch(graphQlApiUrl, {
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
 * @param {String} graphQlApiUrl Endpoint URL 
 * @returns 
 */
async function addRoutingRule(item, accessToken, graphQlApiUrl) {
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
    routingSteps: item.routingSteps?.value || []
  };
  try {
    const fetchResponse = await fetch(graphQlApiUrl, {
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
 * @param {String} graphQlApiUrl Endpoint URL 
 * @returns 
 */
async function deleteRoutingRule(item, accessToken, graphQlApiUrl) {
  let response;
  try {
    const fetchResponse = await fetch(graphQlApiUrl, {
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

/**
 * This is the Function to delete the Routing Object ]to the DB
 * @param {routingData[]} item Routing object that need to delete
 * @param {String} accessToken token to use while calling graphql query 
 * @param {String} graphQlApiUrl Endpoint URL 
 * @returns 
 */
async function batchDelete(items, accessToken, graphQlApiUrl) {
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

    const fetchResponse = await fetch(graphQlApiUrl, {
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


/**
 * This is the Function to batch update the Routing Object to the DB
 * @param {routingData} items List of Routing object that need to update
 * @param {String} accessToken token to use while calling graphql query 
 * @param {String} graphQlApiUrl Endpoint URL 
 * @returns 
 */
const batchRoutingUpdate = async(items, accessToken, graphQlApiUrl) =>{
  if(items.length === 0){
    return {
      errors: [
        "Please Select Something to Edit"
      ]
    };
  }
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
      routingSteps: item?.routingSteps || []
    };
  });
  try {
    const fetchResponse = await fetch(graphQlApiUrl, {
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
    console.log("Update Batch RoutingDB Response:", response);
  } catch (error) {
    console.error("Error in Update Batch RoutingDB", error);
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
  batchRoutingUpdate
};
