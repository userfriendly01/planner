/* eslint-disable no-console */

/**
 * This is the function use to query the appsync API to get the data from DB
 * @param {String} accessToken OAuth tokent to use while calling graphql query
 * @param {String} nextToken Token for next set of data
 * @param {String} graphQlApiUrl Endpoint URL
 * @returns list of data and nextToken if any
 */
async function queryFlowData(accessToken, nextToken = null, graphQlApiUrl) {
  let result = {};
  try {
    const response = await fetch(graphQlApiUrl, {
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
                  accountManager
                  affinityVDN
                  agentId
                  brand
                  callDetails1
                  callDetails2
                  callFlowTemplate
                  callTypeDescription
                  channel
                  content {
                    callIntent
                    callerType
                    callFlowRoute
                    dataRequests
                    greetingMessages
                    languageOffer
                    transferNumber
                    officeNumbers
                  }
                  createTime
                  dialedDescription
                  employeeId
                  internetPlacement
                  lineOfBusiness
                  marketingChannel
                  pkey
                  rangeIndicator
                  requestID
                  tollFreeNumber
                  transferCode
                  type
                  userDestination
                  whisper
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
 * @param {String} accessToken OAuth Access Token
 * @param {String} graphQlApiUrl Endpoint URL
 * @returns {flowData} list of data contain all the result present in DB
 */
async function retrieveFlowData(accessToken, graphQlApiUrl,firstChunkData) {
  const flowData = [];
  let isFirstTime = true;
  let result = firstChunkData;
  let counter = firstChunkData?.data?.listCctSharedCallFlowDbs?.items?.length+1 || 1;
  let listItems = firstChunkData?.data?.listCctSharedCallFlowDbs?.items || [];
  try {
    while (isFirstTime || result.data?.listCctSharedCallFlowDbs.nextToken) {
      if(!isFirstTime || Object.keys(firstChunkData).length === 0){
        result = await queryFlowData(accessToken, result.data?.listCctSharedCallFlowDbs.nextToken, graphQlApiUrl);
        listItems = result.data?.listCctSharedCallFlowDbs?.items || [];
      }
      listItems.forEach(item => {
        if(item) {
          flowData.push({
            ...item,
            id: counter++
          });
        }
      });
      isFirstTime = false;
    }
  } catch (error) {
    console.error("Error in retrieveFlowData", error);
  }
  return flowData;
}

function addFlowInput (item, dataRequestsPassed, currentTimePassed){
  const input = {
    pkey: item.pkey.value,
    content: {
      callIntent: item.callIntent?.value,
      callFlowRoute: item.callFlowRoute?.value,
      callerType: item.callerType?.value,
      greetingMessages: item.greetingMessages?.value,
      transferNumber: item.transferNumber?.value,
      languageOffer: item.languageOffer?.value,
      dataRequests: dataRequestsPassed,
      officeNumbers: item.officeNumbers?.value
    },
    createTime: currentTimePassed,
    agentId: item.agentId?.value || "",
    brand: item.brand.value,
    callFlowTemplate: item.callFlowTemplate?.value || "",
    channel: item.channel.value,
    dialedDescription: item.dialedDescription.value,
    accountManager: item.accountManager?.value || "",
    affinityVDN: item.affinityVDN?.value || "",
    callTypeDescription: item.callTypeDescription?.value || "",
    transferCode: item.transferCode?.value || "",
    internetPlacement: item.internetPlacement?.value || "",
    callDetails1: item.callDetails1?.value || "",
    callDetails2: item.callDetails2?.value || "",
    tollFreeNumber: item.tollFreeNumber?.value || "",
    lineOfBusiness: item.lineOfBusiness?.value || "",
    marketingChannel: item.marketingChannel?.value || "",
    whisper: item.whisper?.value || "",
    requestID: item.requestID?.value || "",
    userDestination: item.userDestination?.value||"",
    rangeIndicator: item.rangeIndicator?.value || "",
    type: item.type?.value || ""
  };
  if(item.employeeId?.value){
    input.employeeId = item.employeeId.value;
  }
  return input;
}

function updateFlowInput(item){
  const input = {
    pkey: item.pkey,
    agentId: item.agentId || "",
    brand: item.brand,
    callFlowTemplate: item.callFlowTemplate || "",
    channel: item.channel,
    content: {
      callIntent: item.content?.callIntent || "",
      callFlowRoute: item.content?.callFlowRoute || "",
      callerType: item.content?.callerType || "",
      greetingMessages: item.content?.greetingMessages || "",
      transferNumber: item.content?.transferNumber || "",
      languageOffer: item.content?.languageOffer || "",
      dataRequests: item.content?.dataRequests,
      officeNumbers: item.content?.officeNumbers
    },
    createTime: item.createTime,
    dialedDescription: item.dialedDescription,
    accountManager: item.accountManager || "",
    affinityVDN: item.affinityVDN || "",
    callTypeDescription: item.callTypeDescription || "",
    transferCode: item.transferCode || "",
    internetPlacement: item.internetPlacement || "",
    callDetails1: item.callDetails1 || "",
    callDetails2: item.callDetails2 || "",
    tollFreeNumber: item.tollFreeNumber || "",
    lineOfBusiness: item.lineOfBusiness || "",
    marketingChannel: item.marketingChannel || "",
    whisper: item.whisper || "",
    requestID: item.requestID || "",
    userDestination: item.userDestination || "",
    rangeIndicator: item.rangeIndicator || "",
    type: item.type || ""
  };
  if(item.employeeId){
    input.employeeId = item.employeeId;
  }
  return input;
}


/**
 * This is the Function to update the Flow Object ]to the DB
 * @param {flowData} item Flow object that need to update
 * @param {String} accessToken token to use while calling graphql query
 * @param {String} graphQlApiUrl Endpoint URL
 * @returns
 */
async function updateFlowDB(item, accessToken, graphQlApiUrl) {
  let response;
  const input = updateFlowInput(item);
  try {
    const fetchResponse = await fetch(graphQlApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken
      },
      body: JSON.stringify({
        query: `
          mutation updateCctSharedCallFlowDb($input:CctSharedCallFlowDbInputMod!) {
            updateCctSharedCallFlowDb(input:$input) {
              pkey
              agentId
              brand
              callFlowTemplate
              channel
              content {
                callIntent
                callerType
                callFlowRoute
                dataRequests
                greetingMessages
                languageOffer
                transferNumber
                officeNumbers
              }
              createTime
              dialedDescription
              employeeId
              accountManager
              affinityVDN
              callTypeDescription
              transferCode
              internetPlacement
              callDetails1
              callDetails2
              tollFreeNumber
              lineOfBusiness
              marketingChannel
              whisper
              requestID
              userDestination
              rangeIndicator
              type
      }
          }
      `,
        variables: {
          input
        }
      })
    });

    response = await fetchResponse.json();
  } catch (error) {
    console.error("Error in updateFlowDB", error);
  }
  return response;
}

/**
 * This is the Function to add the Flow Object ]to the DB
 * @param {flowData} item Flow object that need to add
 * @param {String} accessToken token to use while calling graphql query
 * @param {String} graphQlApiUrl Endpoint URL
 * @param {String} curTime the current time, for the db record's create time
 * @returns
 */
async function addFlowRule(item, accessToken, graphQlApiUrl, curTime = new Date().toISOString(), dataRequests=[]) {
  let response;
  const input = addFlowInput(item, dataRequests, curTime);
  try {
    const fetchResponse = await fetch(graphQlApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken
      },
      body: JSON.stringify({
        query: `
          mutation AddFlowRule ($input:CctSharedCallFlowDbInput! ){
            createCctSharedCallFlowDb(input:$input) {
              agentId
              brand
              callFlowTemplate
              channel
              content  {
                callIntent
                callerType
                callFlowRoute
                dataRequests
                greetingMessages
                languageOffer
                transferNumber
                officeNumbers
              }
              createTime
              dialedDescription
              employeeId
              pkey
              accountManager
              affinityVDN
              callTypeDescription
              transferCode
              internetPlacement
              callDetails1
              callDetails2
              tollFreeNumber
              lineOfBusiness
              marketingChannel
              whisper
              requestID
              userDestination
              rangeIndicator
              type
            }
          }
        `,
        variables: {
          input
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

/**
 * This is the Function to delete the Flow Object from the DB
 * @param {flowData} item Flow object that need to delete
 * @param {String} accessToken token to use while calling graphql query
 * @param {String} graphQlApiUrl Endpoint URL
 * @returns
 */
async function deleteFlowRule(item, accessToken, graphQlApiUrl) {
  let response;
  const input = {
    pkey: item.pkey
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
          mutation deleteCctSharedCallFlowDb($input:CctSharedCallFlowDbDelInput!) {
            deleteCctSharedCallFlowDb(input:$input ){
              pkey
              agentId
              brand
              callFlowTemplate
              channel
              content {
                callIntent
                callerType
                callFlowRoute
                dataRequests
                greetingMessages
                languageOffer
                transferNumber
                officeNumbers
              }
              createTime
              dialedDescription
              employeeId
              accountManager
              affinityVDN
              callTypeDescription
              transferCode
              internetPlacement
              callDetails1
              callDetails2
              tollFreeNumber
              lineOfBusiness
              marketingChannel
              whisper
              requestID
              rangeIndicator
              type
            }
          }
      `,
        variables: {
          input
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
async function batchDeleteItems(items,accessToken,graphQlApiUrl){
  var flowDeleteArray=[];
  const size=3;
  let response =[];
  while (items.length > 0){
    flowDeleteArray.push(items.splice(0, size));
  }

  for(let i=0; i<flowDeleteArray.length; i++){
    response = {
      "success": [],
      "failure": [],
      "flag": false
    };
    const listObj={};
    try{

      if(i===0){
        await flowBatchDelete(flowDeleteArray[i],accessToken,graphQlApiUrl);
      }
      else{
        response=await flowBatchDelete1(flowDeleteArray[i],accessToken,graphQlApiUrl);
      }
      response.success.push(flowDeleteArray[i].forEach(x=>listObj.key=x));

    }
    catch(error){
      console.error("error while deleting the records", error);
      response.failure.push(flowDeleteArray[i].forEach(x=>listObj.key=x));
    }
  }
  return response;
}

async function flowBatchDelete(items, accessToken, graphQlApiUrl){
  const body = JSON.stringify({
    query: `
        mutation DeleteManyFlow {
          batchDeleteCctSharedCallFlowDb(input: {
            pkey: ${JSON.stringify(items)}
            }) {
            items {
              pkey
            }
          }
        }
    `,
    variables: {
    }
  }).replace(/\\"pkey\\":/g, "pkey:");

  const fetchResponse = await fetch(graphQlApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken
    },
    body
  });
  const response = await fetchResponse.json();
  console.log("Batch Delete Flow Rule Response:", response);
  return response;
}
async function flowBatchDelete1(items, accessToken, graphQlApiUrl){
  const body = JSON.stringify({
    query: `
        mutation DeleteManyFlow1 {
          batchDeleteCctSharedCallFlowDb1(input: {
            pkey: ${JSON.stringify(items)}
            }) {
            items {
              pkey
            }
          }
        }
    `,
    variables: {
    }
  }).replace(/\\"pkey\\":/g, "pkey:");

  const fetchResponse = await fetch(graphQlApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken
    },
    body
  });
  const response = await fetchResponse.json();
  console.log("Batch Delete Flow Rule Response:", response);
  return response;
}

/**
 * This is the Function to batch update the Flow Object to the DB
 * @param {flowData} items List of Flow object that need to update
 * @param {String} accessToken token to use while calling graphql query 
 * @param {String} graphQlApiUrl Endpoint URL 
 * @returns 
 */
const batchFlowUpdate = async(items, accessToken, graphQlApiUrl) =>{
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
      pkey: item.pkey,
      agentId: item.agentId || "",
      brand: item.brand,
      callFlowTemplate: item.callFlowTemplate || "",
      channel: item.channel,
      content: {
        callIntent: item.content?.callIntent || "",
        callFlowRoute: item.content?.callFlowRoute || "",
        callerType: item.content?.callerType || "",
        greetingMessages: item.content?.greetingMessages || "",
        transferNumber: item.content?.transferNumber || "",
        languageOffer: item.content?.languageOffer || "",
        dataRequests: item.content?.dataRequests
      },
      createTime: item.createTime,
      dialedDescription: item.dialedDescription,
      accountManager: item.accountManager || "",
      affinityVDN: item.affinityVDN || "",
      callTypeDescription: item.callTypeDescription || "",
      transferCode: item.transferCode || "",
      internetPlacement: item.internetPlacement || "",
      callDetails1: item.callDetails1 || "",
      callDetails2: item.callDetails2 || "",
      tollFreeNumber: item.tollFreeNumber || "",
      lineOfBusiness: item.lineOfBusiness || "",
      marketingChannel: item.marketingChannel || "",
      whisper: item.whisper || "",
      requestID: item.requestID || "",
      userDestination: item.userDestination || "",
      rangeIndicator: item.rangeIndicator || "",
      type: item.type || ""
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
        mutation batchUpdateCctSharedCallFlowDb($input: CctSharedCallFlowDbBatchUpdateInput!) {
          batchUpdateCctSharedCallFlowDb(input: $input) {
            items {
              accountManager
              affinityVDN
              agentId
              brand
              callDetails1
              callDetails2
              callFlowTemplate
              callTypeDescription
              channel
              content {
                callFlowRoute
                callIntent
                callerType
                dataRequests
                greetingMessages
                languageOffer
                transferNumber
              }
              createTime
              dialedDescription
              employeeId
              internetPlacement
              lineOfBusiness
              marketingChannel
              pkey
              rangeIndicator
              requestID
              tollFreeNumber
              transferCode
              type
              userDestination
              whisper
            }
          }
        }
      `,
        variables: {
          input: { batchFlowUpdateInput: input }
        }
      })
    });
    response = await fetchResponse.json();
    console.log("Update Batch Flow DB Response:", response);
  } catch (error) {
    console.error("Error in Update Batch Flow DB", error);
  }
  return response;
};

/**
 * This is the Function to batch create the Flow Object to the DB
 * @param {flowData} items List of Flow object that need to update
 * @param {String} accessToken token to use while calling graphql query 
 * @param {String} graphQlApiUrl Endpoint URL 
 * @returns 
 */
const batchFlowCreate = async(items, accessToken, graphQlApiUrl) =>{
  if(items.length === 0){
    return {
      errors: [
        "Please Select Something to Add"
      ]
    };
  }
  let response;
  const input = items.map(item=>{
    return {
      pkey: item.pkey,
      agentId: item.agentId || "",
      brand: item.brand,
      callFlowTemplate: item.callFlowTemplate || "",
      channel: item.channel,
      content: {
        callIntent: item.content?.callIntent || "",
        callFlowRoute: item.content?.callFlowRoute || "",
        callerType: item.content?.callerType || "",
        greetingMessages: item.content?.greetingMessages || "",
        transferNumber: item.content?.transferNumber || "",
        languageOffer: item.content?.languageOffer || "",
        dataRequests: item.content?.dataRequests
      },
      createTime: item.createTime,
      dialedDescription: item.dialedDescription,
      accountManager: item.accountManager || "",
      affinityVDN: item.affinityVDN || "",
      callTypeDescription: item.callTypeDescription || "",
      transferCode: item.transferCode || "",
      internetPlacement: item.internetPlacement || "",
      callDetails1: item.callDetails1 || "",
      callDetails2: item.callDetails2 || "",
      tollFreeNumber: item.tollFreeNumber || "",
      lineOfBusiness: item.lineOfBusiness || "",
      marketingChannel: item.marketingChannel || "",
      whisper: item.whisper || "",
      requestID: item.requestID || "",
      userDestination: item.userDestination || "",
      rangeIndicator: item.rangeIndicator || "",
      type: item.type || ""
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
        mutation batchCreateCctSharedCallFlowDb($input: CctSharedCallFlowDbBatchCreateInput!) {
          batchCreateCctSharedCallFlowDb(input: $input) {
            items {
              accountManager
              affinityVDN
              agentId
              brand
              callDetails1
              callDetails2
              callFlowTemplate
              callTypeDescription
              channel
              content {
                callFlowRoute
                callIntent
                callerType
                dataRequests
                greetingMessages
                languageOffer
                transferNumber
              }
              createTime
              dialedDescription
              employeeId
              internetPlacement
              lineOfBusiness
              marketingChannel
              pkey
              rangeIndicator
              requestID
              tollFreeNumber
              transferCode
              type
              userDestination
              whisper
            }
          }
        }
      `,
        variables: {
          input: { batchFlowCreateInput: input }
        }
      })
    });
    response = await fetchResponse.json();
    console.log("Create Batch Flow DB Response:", response);
  } catch (error) {
    console.error("Error in Create Batch Flow DB", error);
  }
  return response;
};

export {
  addFlowRule,
  deleteFlowRule,
  retrieveFlowData,
  updateFlowDB,
  queryFlowData,
  flowBatchDelete,
  batchFlowUpdate,
  batchDeleteItems,
  batchFlowCreate
};
