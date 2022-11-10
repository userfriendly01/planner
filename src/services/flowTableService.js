/* eslint-disable no-console */

import { getGraphQLEndpoint } from "../utils";

/**
 * This is the function use to query the appsync API to get the data from DB
 * @param {*} accessToken OAuth tokent to use while calling graphql query
 * @param {*} nextToken Token for next set of data
 * @returns list of data and nextToken if any
 */
async function queryFlowData(accessToken, nextToken = null) {
  let result = {};
  try {
    const response = await fetch(getGraphQLEndpoint(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: `
            query listCctSharedCallFlowDbs {
              listCctSharedCallFlowDbs(limit: 10000, nextToken: ${nextToken ? JSON.stringify(nextToken) : nextToken}) {
                nextToken
                items {
                  pkey
                  agentId
                  brand
                  callFlowTemplate
                  channel
                  content {
                    callerType
                    callFlowRoute
                    dataRequests
                    greetingMessages
                    languageOffer
                    transferNumber
                  }
                  createTime
                  dialedDescription
                  employeeId
                  DRC {
                    accountManager
                    affinityVDN
                    keycode
                    transferCode
                    internetPlacement
                    internetType
                    campaignType
                    lineOfBusiness
                    marketingChannel
                    whisper
                    requestID
                  }
                  userDestination
                }
              }
            }
        `,
        variables: {}
      })
    });
    result = await response.json();
  } catch (error) {
    console.error("Error in queryFlowData", error);
  }
  return result;
}

/**
 * This is the function to use to call queryFlowData function multiple time
 * until nextToken become null
 * @param {*} accessToken OAuth Access Token
 * @returns {flowData} list of data contain all the result present in DB
 */
async function retrieveFlowData(accessToken) {
  let flowData = [];
  let isFirstTime = true;
  let result = {};
  try {
    while (isFirstTime || result.data?.listCctSharedCallFlowDbs.nextToken) {
      // eslint-disable-next-line no-shadow
      result = await queryFlowData(accessToken, result.data?.listCctSharedCallFlowDbs.nextToken);
      const listItems = result.data?.listCctSharedCallFlowDbs?.items || [];
      const tempFlowData = listItems.map(elem => ({
        ...elem,
        id: elem && elem.skey && parseInt(elem.skey.split("__")[2], 10)
      })) || [];
      flowData = flowData.concat(tempFlowData);
      isFirstTime = false;
    }
  } catch (error) {
    console.error("Error in retrieveFlowData", error);
  }
  return flowData;
}

async function updateFlowDB(item, accessToken) {
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
          mutation updateCctSharedCallFlowDb {
            updateCctSharedCallFlowDb(input: {
                pkey: "${item.pkey}",
                agentId: "${item.agentId || ""}",
                brand: "${item.brand}",
                callFlowTemplate: "${item.callFlowTemplate || ""}",
                channel: "${item.channel}",
                content: {
                  callFlowRoute: "${item.agentId || ""}",
                  callerType: "${item.content?.callerType || ""}",
                  greetingMessages: ${JSON.stringify(item.content?.greetingMessages)},
                  transferNumber: "${item.content?.transferNumber || ""}",
                  languageOffer: "${item.content?.languageOffer || ""}",
                  dataRequests: ${JSON.stringify(item.content?.dataRequests)},
                },
                createTime: "${item.createTime}",
                dialedDescription: "${item.dialedDescription}",
                employeeId: "${item.employeeId || ""}",
                DRC: {
                  accountManager: "${item.DRC?.accountManager || ""}",
                  affinityVDN: "${item.DRC?.affinityVDN || ""}",
                  keycode: "${item.DRC?.keycode || ""}",
                  transferCode: "${item.DRC?.transferCode || ""}",
                  internetPlacement: "${item.DRC?.internetPlacement || ""}",
                  internetType: "${item.DRC?.internetType || ""}",
                  campaignType: "${item.DRC?.campaignType || ""}",
                  lineOfBusiness: "${item.DRC?.lineOfBusiness || ""}",
                  marketingChannel: "${item.DRC?.marketingChannel || ""}",
                  whisper: "${item.DRC?.whisper || ""}",
                  requestID: "${item.DRC?.requestID || ""}",
                },
               userDestination: "${item.userDestination}"
              }) {
              pkey
              agentId
              brand
              callFlowTemplate
              channel
              content {
                callerType
                callFlowRoute
                dataRequests
                greetingMessages
                languageOffer
                transferNumber
              }
              createTime
              dialedDescription
              employeeId
              DRC {
                accountManager
                affinityVDN
                keycode
                transferCode
                internetPlacement
                internetType
                campaignType
                lineOfBusiness
                marketingChannel
                whisper
                requestID
              }
             userDestination
      }
          }
      `,
        variables: {
        }
      })
    });
    response = await fetchResponse.json();
  } catch (error) {
    console.error("Error in updateFlowDB", error);
  }
  return response;
}

async function addFlowRule(item, accessToken) {
  let response;
  const curTime = new Date().toISOString();
  const dataRequests = item.dataRequests.value
    ?.split(",")
    ?.map(a => a.trim())
    ?.filter(a => a.length > 0)
    || [];

  try {
    const fetchResponse = await fetch(getGraphQLEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken
      },
      body: JSON.stringify({
        query: `
          mutation AddFlowRule {
            createCctSharedCallFlowDb(
              input: {
                  pkey: "${item.pkey.value}"
                  content: {
                      callFlowRoute: "${item.callFlowRoute.value || ""}",
                      callerType: "${item.callerType.value || ""}",
                      greetingMessages: "${item.greetingMessages.value || ""}",
                      transferNumber: "${item.transferNumber.value || ""}",
                      languageOffer: "${item.languageOffer.value || ""}",
                      dataRequests: ${JSON.stringify(dataRequests)},
                    },
                  createTime: "${curTime}",
                  agentId: "${item.agentId.value || ""}",
                  brand: "${item.brand.value}",
                  callFlowTemplate: "${item.callFlowTemplate.value || ""}",
                  channel: "${item.channel.value}",
                  dialedDescription: "${item.dialedDescription.value}",
                  employeeId: "${item.employeeId.value || ""}",
                  DRC: {
                    accountManager: "${item.accountManager?.value || ""}",
                    affinityVDN: "${item.affinityVDN?.value || ""}",
                    keycode: "${item.keycode?.value || ""}",
                    transferCode: "${item.transferCode?.value || ""}",
                    internetPlacement: "${item.internetPlacement?.value || ""}",
                    internetType: "${item.internetType?.value || ""}",
                    campaignType: "${item.campaignType?.value || ""}",
                    lineOfBusiness: "${item.lineOfBusiness?.value || ""}",
                    marketingChannel: "${item.marketingChannel?.value || ""}",
                    whisper: "${item.whisper?.value || ""}",
                    requestID: "${item.requestID?.value || ""}"
                  }
              }
          ) {
              agentId
              brand
              callFlowTemplate
              channel
              content  {
                callerType
                callFlowRoute
                dataRequests
                greetingMessages
                languageOffer
                transferNumber
              }
              createTime
              dialedDescription
              employeeId
              pkey
              DRC {
                accountManager
                affinityVDN
                keycode
                transferCode
                internetPlacement
                internetType
                campaignType
                lineOfBusiness
                marketingChannel
                whisper
                requestID
              }
            }
          }
        `,
        variables: {
        }
      })
    });
    response = await fetchResponse.json();
    console.log("Add Flow Rule Response:", response);
  } catch (error) {
    console.error("Error in Adding Flow Rule", error);
  }
  return response;
}

async function deleteFlowRule(item, accessToken) {
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
          mutation deleteCctSharedCallFlowDb {
            deleteCctSharedCallFlowDb(input: {
                pkey: "${item.pkey}"
              }) {
              pkey
              agentId
              brand
              callFlowTemplate
              channel
              content {
                callerType
                callFlowRoute
                dataRequests
                greetingMessages
                languageOffer
                transferNumber
              }
              createTime
              dialedDescription
              employeeId
              DRC {
                accountManager
                affinityVDN
                keycode
                transferCode
                internetPlacement
                internetType
                campaignType
                lineOfBusiness
                marketingChannel
                whisper
                requestID
              }
            }
          }
      `,
        variables: {
        }
      })
    });
    response = await fetchResponse.json();
    console.log("Delete Flow Rule Response:", response);
  } catch (error) {
    console.error("Error in Deleting Flow Rule", error);
  }
  return response;
}

export {
  addFlowRule,
  deleteFlowRule,
  retrieveFlowData,
  updateFlowDB
};
