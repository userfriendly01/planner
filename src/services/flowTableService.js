/* eslint-disable no-console */

import { logger } from "utils";

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
                  predictiveCaller
                  rangeIndicator
                  requestID
                  selfServiceIndicator
                  tfnRoutingGroup
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
    logger.error("Error in queryFlowData", { error }, false);
  }
  return result;
}
/**
 * This is the function use to query the appsync API to get the data from DB
 * @param {String} accessToken OAuth tokent to use while calling graphql query
 * @param {String} graphQlApiUrl Endpoint URL
 * @returns list of data and nextToken if any
 */
export async function queryLSCDynamicFlowData(accessToken, graphQlApiUrl) {
  let result = {};
  try {
    const response = await fetch(graphQlApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: `query MyQuery {
  getCallFlowConfig(callFlowName: "LSC") {
    items {
      ... on Menu {
        allowBargeIn
        finishOnKey
        actionId
        actionType
        callFlowName
        createTime
        maxDigits
        minDigits
        nextActionId
        nextActionType
        repeat {
          callerContextAttributes
          loop
          nextActionId
          nextActionType
        }
        speech
        timeout
        updateTime
      }
      ... on MenuOptions {
        __typename
        actionId
        actionType
        callFlowName
        createTime
        updateTime
        options {
          callerContextAttributes
          digit
          nextActionId
          nextActionType
        }
      }
      ... on Announcement {
        nextActionId
        actionId
        actionType
        callFlowName
        createTime
        nextActionType
        speech
        updateTime
      }
    }
  }
}`,
        variables: {}
      })
    });
    result = await response.json();
  } catch (error) {
    logger.error("Error in queryFlowData", { error }, false);
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
    logger.error("Error in retrieveFlowData", { error }, false);
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
    type: item.type?.value || "",
    tfnRoutingGroup: item.tfnRoutingGroup?.value || "",
    predictiveCaller: item.predictiveCaller?.value || false,
    selfServiceIndicator: item.selfServiceIndicator?.value || false
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
    updateTime: new Date().toISOString(),
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
    type: item.type || "",
    tfnRoutingGroup: item.tfnRoutingGroup || "",
    predictiveCaller: item.predictiveCaller || false,
    selfServiceIndicator: item.selfServiceIndicator || false
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
              predictiveCaller
              whisper
              requestID
              selfServiceIndicator
              userDestination
              rangeIndicator
              tfnRoutingGroup
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
    logger.error("Error in updateFlowDB", { error }, false);
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
              predictiveCaller
              whisper
              requestID
              selfServiceIndicator
              userDestination
              rangeIndicator
              tfnRoutingGroup
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
    logger.log("Add Flow Rule Response:", response);
  } catch (error) {
    logger.error("Error in Adding Flow Rule", { error }, false);
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
              predictiveCaller
              whisper
              requestID
              selfServiceIndicator
              rangeIndicator
              tfnRoutingGroup
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
    logger.log("Delete Flow Rule Response:", response);
  } catch (error) {
    logger.error("Error in Deleting Flow Rule", { error }, false);
  }
  return response;
}
async function batchDeleteItems(items,accessToken,graphQlApiUrl){
  var flowDeleteArray=[];
  const size=24;
  const response = {
    "success": [],
    "flag": false,
    "failure": []
  };
  while (items.length > 0){
    flowDeleteArray.push(items.splice(0, size));
  }
  for(const flowValue of flowDeleteArray){
    const successResponse=response.success;
    const failureResponse= response.failure;
    const flowRespKeys = flowValue.map(x=>({ "pkey": x }));
    await flowBatchDelete(flowValue,accessToken,graphQlApiUrl).then(resp=>{
      if(!resp?.errors){
        response.success = successResponse.concat(flowRespKeys);
      }
      else{
        console.error("error while deleting the records", resp.errors);
        response.failure = failureResponse.concat(flowRespKeys);
        response.flag = true;
      }
    });
  }
  return response;
}


async function flowBatchDelete(items, accessToken, graphQlApiUrl){
  let response;
  try{
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
    response = await fetchResponse.json();
    logger.log("Batch Delete Flow Rule Response:", response);
  } catch (error) {
    logger.error("Error in Flow Batch Delete", { error }, false);
  }
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
      flag: true,
      success: [],
      failure: [],
      errors: [
        "Please Select Something to Edit"
      ]
    };
  }
  const flowUpdateArray=[];
  const size = 25;
  const response = {
    success: [],
    flag: false,
    failure: []
  };
  while(items.length>0){
    flowUpdateArray.push(items.splice(0,size));
  }
  flowUpdateArray.map(async flowUpdate =>{
    const flowUpdateBatchRunResponse = await updateFlowBatchRun(flowUpdate, accessToken, graphQlApiUrl);
    if(!flowUpdateBatchRunResponse?.errors){
      response.success = response.success.concat(flowUpdate);
    }
    else{
      response.failure = response.failure.concat(flowUpdate);
      response.flag = true;
    }

  });
  logger.info("Update Batch Flow DB Response:", { response });
  return response;
};

const updateFlowBatchRun = async(items, accessToken, graphQlApiUrl) =>{
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
      updateTime: new Date().toISOString(),
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
      predictiveCaller: item.predictiveCaller || false,
      selfServiceIndicator: item.selfServiceIndicator || false,
      whisper: item.whisper || "",
      requestID: item.requestID || "",
      userDestination: item.userDestination || "",
      rangeIndicator: item.rangeIndicator || "",
      tfnRoutingGroup: item.tfnRoutingGroup || "",
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
              predictiveCaller
              rangeIndicator
              requestID
              selfServiceIndicator
              tollFreeNumber
              tfnRoutingGroup
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
    return await fetchResponse.json();
  } catch (error) {
    logger.error("Error in Update Batch Flow DB", { error });
    return { errors: [{ message: error }]};
  }
};

const batchFlowCreate = async(items, accessToken, graphQlApiUrl) =>{
  const flowCreateArray=[];
  const size = 25;
  const response = {
    success: [],
    flag: false,
    failure: [],
    alertMsg: ""
  };
  if(items.length === 0){
    response.flag=true,
    response.alertMsg = "Please Select Something to Add";
  }
  while(items.length>0){
    flowCreateArray.push(items.splice(0,size));
  }
  flowCreateArray.map(async flowCreate =>{
    const flowUpdateBatchRunResponse = await createFlowRunItem(flowCreate, accessToken, graphQlApiUrl);
    if(!flowUpdateBatchRunResponse?.errors){
      response.success = response.success.concat(flowCreate);
    }
    else{
      response.failure = response.failure.concat(flowCreate);
      response.flag = true;
      response.alertMsg = "Error Occured while creating Records";
    }
  });
  logger.info("Create Batch Flow DB Response:", { response });
  return response;
};

const batchDynamicFlowCreate = async(items, accessToken, graphQlApiUrl) =>{
  const dynamicFlowCreateArray=[];
  const size = 25;
  const response = {
    success: [],
    flag: false,
    failure: [],
    alertMsg: ""
  };
  if(items.length === 0){
    response.flag=true,
    response.alertMsg = "Please Select Something to Add";
  }
  while(items.length>0){
    dynamicFlowCreateArray.push(items.splice(0,size));
  }
  dynamicFlowCreateArray.map(async dynamicFlowCreate =>{
    const dynamicFlowUpdateBatchRunResponse = await createDynamicFlowRunItem(dynamicFlowCreate, accessToken, graphQlApiUrl);
    if(!dynamicFlowUpdateBatchRunResponse?.errors){
      response.success = response.success.concat(dynamicFlowCreate);
    }
    else{
      response.failure = response.failure.concat(dynamicFlowCreate);
      response.flag = true;
      response.alertMsg = "Error Occurred while creating dynamic flowRecords";
    }
  });
  logger.info("Create Batch Dynamic Flow DB Response:", { response });
  return response;
};

/**
 * This is the Function to batch create the Flow Object to the DB
 * @param {flowData} items List of Flow object that need to update
 * @param {String} accessToken token to use while calling graphql query
 * @param {String} graphQlApiUrl Endpoint URL
 * @returns
 */
const createDynamicFlowRunItem = async(items, accessToken, graphQlApiUrl) =>{
  let response;
  const announcements = [];
  const menus = [];
  const menuOptions = [];
  const options =[];
  let callFlowName = "";

  items.map(item=>{
    if(item.actionType === "ANNOUNCEMENT")
    {
      announcements.push({
        nextActionId: item.nextActionId,
        actionId: item.actionId,
        actionType: item.actionType,
        callFlowName: item.callFlowName,
        createTime: new Date().getTime(),
        nextActionType: item.nextActionType,
        speech: item.speech,
        updateTime: new Date().getTime()
      });
    }

    if(item.actionType === "MENU")
    {
      menus.push({
        allowBargeIn: item.allowBargeIn,
        finishOnKey: item.finishOnKey,
        actionId: item.actionId,
        actionType: item.actionType,
        callFlowName: item.callFlowName,
        createTime: new Date().getTime(),
        maxDigits: item.maxDigits,
        minDigits: item.minDigits,
        nextActionId: item.nextActionId,
        nextActionType: item.nextActionType,
        repeat: {
          callerContextAttributes: JSON.stringify(item.repeat.callerContextAttributes),
          loop: item.repeat.loop,
          nextActionId: item.repeat.nextActionId,
          nextActionType: item.repeat.nextActionType
        },
        speech: item.speech,
        timeout: item.timeout,
        updateTime: new Date().getTime()
      }
      );
    }

    if(item.actionType === "MENUOPTIONS") {
      menuOptions.push({
        actionId: item.actionId,
        actionType: item.actionType,
        callFlowName: item.callFlowName,
        createTime: new Date().getTime(),
        updateTime: new Date().getTime(),
        options: options.push({
          callerContextAttributes: JSON.stringify(item.options.callerContextAttributes),
          digit: item.options.digit,
          nextActionId: item.options.nextActionId,
          nextActionType: item.options.nextActionType
        })
      });
    }
    callFlowName = item.callFlowName;
    return {
      callFlowName: callFlowName,
      announcements: announcements,
      menus: menus,
      menuOptions: menuOptions
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
        mutation createCallFlowConfig($input: CallFlowConfigInput! ) {
          createCallFlowConfig(input: $input) {
              callFlowName
            }
          }
      `,
        variables: {
          input: {
            callFlowName: callFlowName,
            announcements: announcements,
            menus: menus,
            menuOptions: menuOptions
          }
        }
      })
    });
    response = await fetchResponse.json();
    logger.log("Create Batch Dynamic Flow DB Response:", response);
  } catch (error) {
    logger.error("Error in Create Batch Dynamic Flow DB", error);
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
const createFlowRunItem = async(items, accessToken, graphQlApiUrl) =>{
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
      type: item.type || "",
      predictiveCaller: item.predictiveCaller || false,
      selfServiceIndicator: item.selfServiceIndicator || false
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
              predictiveCaller
              rangeIndicator
              requestID
              selfServiceIndicator
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
    logger.log("Create Batch Flow DB Response:", response);
  } catch (error) {
    logger.error("Error in Create Batch Flow DB", error);
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
  batchFlowCreate,
  batchDynamicFlowCreate
};
