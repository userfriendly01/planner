/* eslint-disable no-console */

import { getGraphQLEndpoint } from "../utils";

/**
 * This is the function use to query the appsync API to get the data from DB
 * @param {*} accessToken token to use while calling graphql query
 * @param {*} nextToken Token for next set of data
 * @returns list of data and nextToken if any
 */
async function queryRoutingData(accessToken, nextToken = null) {
  let result = {};
  try {
    const response = await fetch(getGraphQLEndpoint(), {
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
                    }
                }
            }
        `,
        variables: {}
      })
    });
    result = await response.json();
  } catch (error) {
    console.error("Error in queryRoutingData", error);
  }
  return result;
}

/**
 * This is the function to use to call queryRoutingData function multiple time
 * until nextToken become null
 * @param {*} accessToken token to use while calling graphql query
 * @returns {routingData} list of data contain all the result present in DB
 */
async function retrieveRoutingData(accessToken) {
  let routingData = [];
  let isFirstTime = true;
  let result = {};
  try {
    while (isFirstTime || result.data?.listCctSharedCallRoutingGlobalDbs.nextToken) {
      // eslint-disable-next-line no-shadow
      result = await queryRoutingData(accessToken, result.data?.listCctSharedCallRoutingGlobalDbs
        .nextToken);
      const listItems = result.data?.listCctSharedCallRoutingGlobalDbs?.items || [];
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
    console.error("Error in retrieveRoutingData", error);
  }
  return routingData;
}

async function updateRoutingDB(item, accessToken) {
  let response;
  try {
    const fetchResponse = await fetch(getGraphQLEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken
      },
      body: JSON.stringify({
        query: `
          mutation updateCctSharedCallRoutingGlobalDb {
            updateCctSharedCallRoutingGlobalDb(input: {
                pkey: "${item.pkey}",
                skey: "${item.skey}",
                brand: "${item.brand}",
                channel: "${item.channel}",
                callIntent:"${item.callIntent}",
                dayOfWeek: "${item.dayOfWeek}",
                callerState: "${item.callerState}",
                callerType: "${item.callerType}",
                twilioSkill: "${item.twilioSkill || ""}",
                transferDestination: "${item.transferDestination || ""}",
                percentOfCallers: "${item.percentOfCallers}",
                transferMessage: "${item.transferMessage || ""}",
                policyType: "${item.policyType}",
                startTime: "${item.startTime}",
                endTime: "${item.endTime}",
                crcSkill: "${item.crcSkill || ""}",
              }) {
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
            }
          }
      `,
        variables: {
        }
      })
    });
    response = await fetchResponse.json();
    console.log("updateRoutingDB Response:", response);
  } catch (error) {
    console.error("Error in updateRoutingDB", error);
  }
  return response;
}

async function addRoutingRule(item, accessToken) {
  let response;
  try {
    const fetchResponse = await fetch(getGraphQLEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken
      },
      body: JSON.stringify({
        query: `
          mutation AddOne {
            createCctSharedCallRoutingGlobalDb(input: {
                all: "${item.all}"
                pkey: "${item.pkey}",
                skey: "${item.skey}",
                brand: "${item.brand}",
                channel: "${item.channel}",
                callIntent:"${item.callIntent}",
                dayOfWeek: "${item.dayOfWeek}",
                callerState: "${item.callerState}",
                callerType: "${item.callerType}",
                twilioSkill: "${item.twilioSkill || ""}",
                transferDestination: "${item.transferDestination || ""}",
                percentOfCallers: "${item.percentOfCallers}",
                transferMessage: "${item.transferMessage || ""}",
                policyType: "${item.policyType}",
                startTime: "${item.startTime}",
                endTime: "${item.endTime}",
                crcSkill: "${item.crcSkill || ""}",
              }) {
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
            }
          }
      `,
        variables: {
        }
      })
    });
    response = await fetchResponse.json();
    console.log("Add Routing Rule Response:", response);
  } catch (error) {
    console.error("Error in Adding Routing Rule", error);
  }
  return response;
}

async function deleteRoutingRule(item, accessToken) {
  let response;
  try {
    const fetchResponse = await fetch(getGraphQLEndpoint(), {
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
            }
          }
      `,
        variables: {
        }
      })
    });
    response = await fetchResponse.json();
    console.log("Delete Routing Rule Response:", response);
  } catch (error) {
    console.error("Error in Deleting Routing Rule", error);
  }
  return response;
}

export {
  addRoutingRule,
  deleteRoutingRule,
  retrieveRoutingData,
  updateRoutingDB
};
