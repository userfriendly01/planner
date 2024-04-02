/* eslint-disable no-console */
import { env } from "globals";
import { logger } from "utils";

/**
 * This is the function use to query the appsync API to get the data from DB
 * @param {String} accessToken OAuth tokent to use while calling graphql query
 * @param {String} nextToken Token for next set of data
 * @returns list of data and nextToken if any
 */
async function queryFlowData(accessToken, nextToken = null) {
  let result = {
    errors: []
  };
  try {
    const response = await fetch(env.GRAPH_API_URL, {
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
    result.errors.push("Error in queryFlowData " + error.message);
    logger.error("Error in queryFlowData", { error }, false);
  }
  return result;
}
/**
 * This is the function use to query the appsync API to get the data from DB
 * @param {String} accessToken OAuth tokent to use while calling graphql query
 * @returns list of data and nextToken if any
 */
async function queryDynamicFlowData(accessToken) {
  let result = {};
  try {
    const response = await fetch(env.GRAPH_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: `query MyQuery {
  getCallFlowConfig {
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
    logger.error("Error in queryLSCDynamicFlowData", { error }, false);
  }
  return result;
}

/**
 * This is the function to use to call queryFlowData function multiple time
 * until nextToken become null
 * @param {String} accessToken OAuth Access Token
 * @param {Number} counter - counter for the row ID
 * @param {String} nextToken - the page token to grab the next batch/page of records
 * @param {object} rowInsert - the insert function used in this function that will insert the completed row into the component
 * @param {object} flowData - the accumulated flow records in the table
 * @param {object} queryFunction - the query function used in this function that will retrieve the records
 * @returns {object} the counter and the flowData
 */
async function retrieveFlowData(accessToken, counter = 1, nextToken = null, rowInsert, flowData = [], queryFunction = queryFlowData) {
  let result = {};
  let errors = false;
  const resultSet = queryFunction === queryFlowData ? "listCctSharedCallFlowDbs" : "listPhoneNumbers";

  try {
    let firstLoop = true;
    while (nextToken || counter === 1 || firstLoop) {
      firstLoop = false;
      result = await queryFunction(accessToken, nextToken);

      if (result.errors && result.errors.length !==0) {
        errors = true;
      }

      let listItems = [];

      if (result.data) {
        listItems = result.data[resultSet]?.items || [];
      }

      if (listItems.length !== 0) {

        listItems.forEach(item => {
          if(item) {
            const itemCopy = queryFunction === queryFlowData ? item : createFlowFromAction(item);
            flowData.push({
              ...itemCopy,
              id: counter++
            });
          }
        });

        rowInsert(flowData);
      } else if (counter === 1){
        // If there was a handled error in queryFlowData, and there were 
        // no results returned at all, then break out of the loop
        break;
      }
      nextToken = result.data?.listCctSharedCallFlowDbs?.nextToken;
    }
  } catch (error) {
    errors = true;
    logger.error("Error in retrieveFlowData", { error }, false);
  }
  return {
    counter,
    errors,
    flowData
  };

}

function createFlowFromAction (item) {
  let convertedCreateTime = "";
  if(item.createTime && typeof item.createTime === "number") {
    const jsEpoch = item.createTime < 9999999999 ? item.createTime * 1000 : item.createTime;

    convertedCreateTime = new Date(jsEpoch).toISOString();
  }
  return {
    pkey: item.phoneNumber,
    agentId: item.agentId,
    brand: item.brand,
    callFlowName: item.callFlowName ?? "",
    callFlowTemplate: item.callFlowTemplate ?? "",
    callFlowType: item.callFlowType ?? "",
    callTypeDescription: item.callTypeDescription ?? "",
    channel: item.channel,
    content: {
      callFlowRoute: item.callFlowRoute ?? "",
      callIntent: item.callIntent ?? "",
      callerType: item.callerType ?? "",
      dataRequests: item.dataRequests ?? "",
      greetingMessages: item.greetingMessages ?? "",
      languageOffer: item.languageOffer ?? "",
      officeNumbers: item.officeNumbers ?? "",
      transferDestination: item.transferDestination ?? ""
    },
    createTime: convertedCreateTime,
    dialedDescription: item.dialedDescription,
    ...item.employeeId && {
      employeeId: item.employeeId
    },
    internetPlacement: item.internetPlacement ?? "",
    lineOfBusiness: item.lineOfBusiness ?? "",
    marketingChannel: item.marketingChannel ?? "",
    nextActionId: item.nextActionId ?? "",
    nextActionType: item.nextActionType ?? "",
    phoneNumberType: item.phoneNumberType ?? "",
    predictiveCaller: item.predictiveCaller ?? false,
    rangeIndicator: item.rangeIndicator ?? "",
    requestID: item.requestID ?? "",
    selfServiceIndicator: item.callFlowType ?? false,
    tfnRoutingGroup: item.tfnRoutingGroup ?? "",
    tollFreeNumber: item.tollFreeNumber ?? "",
    transferCode: item.transferCode ?? "",
    userDestination: item.userDestination ?? "",
    whisper: item.whisper ?? ""
  };
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
    type: item.phoneNumberType?.value || "",
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
    type: item.phoneNumberType || "",
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
 * @returns
 */
async function updateFlowDB(item, accessToken) {
  let response;
  const input = updateFlowInput(item);
  try {
    const fetchResponse = await fetch(env.GRAPH_API_URL, {
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
 * @param {String} curTime the current time, for the db record's create time
 * @param {Array} dataRequests list of data requests.
 * @returns
 */
async function addFlowRule(item, accessToken, curTime = new Date().toISOString(), dataRequests=[]) {
  let response;
  const input = addFlowInput(item, dataRequests, curTime);
  try {
    const fetchResponse = await fetch(env.GRAPH_API_URL, {
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
  } catch (error) {
    logger.error("Error in Adding Flow Rule", { error }, false);
  }
  return response;
}

/**
 * This is the Function to delete the Flow Object from the DB
 * @param {flowData} item Flow object that need to delete
 * @param {String} accessToken token to use while calling graphql query
 * @returns
 */
async function deleteFlowRule(item, accessToken) {
  let response;
  const input = {
    pkey: item.pkey
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
  } catch (error) {
    logger.error("Error in Deleting Flow Rule", { error }, false);
  }
  return response;
}
async function batchDeleteItems(items, accessToken){
  var flowDeleteArray=[];
  const size=24;
  const response = {
    "errors": [],
    "success": [],
    "flag": false,
    "failure": []
  };

  const itemsCopy = [...items];
  while (itemsCopy.length > 0){
    flowDeleteArray.push(itemsCopy.splice(0, size));
  }
  for(const flowValue of flowDeleteArray){
    const flowRespKeys = flowValue.map(x=>({ "pkey": x }));
    const resp = await flowBatchDelete(flowRespKeys,accessToken);

    resp?.errors?.forEach( y => response?.errors?.push(y));
    resp?.success?.forEach( y => response?.success?.push(y));
    resp?.failure?.forEach(y => response?.failure?.push(y));

    if(resp?.errors){
      console.error("%c %s %o", "color:yellow; background-color:black;", "Error while deleting the records", resp.errors);
      response.flag = true;
    }
  }
  return response;
}


async function flowBatchDelete(items, accessToken){
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

    const fetchResponse = await fetch(env.GRAPH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken
      },
      body
    });
    response = await fetchResponse.json();
  } catch (error) {
    logger.error("Error in Flow Batch Delete", { error }, false);
  }
  return response;
}

/**
 * This is the Function to batch update the Flow Object to the DB
 * @param {flowData} items List of Flow object that need to update
 * @param {String} accessToken token to use while calling graphql query
 * @returns {Object} flag, success rows and failure rows
 */
const batchFlowUpdate = async(items, accessToken) =>{
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

  const itemsCopy = [...items];
  while(itemsCopy.length>0){
    flowUpdateArray.push(itemsCopy.splice(0,size));
  }
  const allResults = await Promise.all(
    flowUpdateArray.map(
      async flowUpdate => {
        return {
          records: flowUpdate,
          result: await updateFlowBatchRun(flowUpdate, accessToken)
        };
      }
    )
  );

  const response = buildResponse(allResults);

  logger.info("Update Batch Flow DB Response:", { response });
  return response;
};

const updateFlowBatchRun = async(items, accessToken) =>{
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
      type: item.phoneNumberType || ""
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
    const response = await fetchResponse.json();

    return response;
  } catch (error) {
    logger.error("Error in Update Batch Flow DB", { error });
    return { errors: [{ message: error }]};
  }
};

const batchFlowCreate = async(items, accessToken) =>{
  const flowCreateArray=[];
  const size = 25;

  if(items.length === 0){
    return {
      alertMsg: "Please select something to add",
      errors: [],
      failure: [],
      flag: true,
      success: []
    };
  }
  const itemsCopy = [...items];
  while(itemsCopy.length>0){
    flowCreateArray.push(itemsCopy.splice(0,size));
  }

  const allResults = await Promise.all(
    flowCreateArray.map(
      async flowCreate => {
        return {
          records: flowCreate,
          result: await createFlowRunItem(flowCreate, accessToken)
        };
      }
    )
  );
  const response = buildResponse(allResults);

  logger.info("Create Batch Flow DB Response:", { response });
  return response;
};

const batchDynamicFlowCreate = async(items, accessToken) =>{
  const dynamicFlowCreateArray=[];
  const size = 25;

  if(items.length === 0){
    return {
      alertMsg: "Please select something to add",
      errors: [],
      failure: [],
      flag: true,
      success: []
    };
  }
  const itemsCopy = [...items];
  while(itemsCopy.length>0){
    dynamicFlowCreateArray.push(itemsCopy.splice(0,size));
  }

  const allResults = await Promise.all(
    dynamicFlowCreateArray.map(
      async dynamicFlowCreate => {
        return {
          records: dynamicFlowCreate,
          result: await createDynamicFlowRunItem(dynamicFlowCreate, accessToken)
        };
      }
    )
  );

  const response = buildResponse(allResults);

  logger.info("Create Dynamic Batch Flow DB Response:", { response });

  return response;
};

/**
 * Consolidate all of the command responses in a batch into 1 response object
 * @param {any} allResults - a set results from all of the operations 
 * @returns {any} a consolidated response object
 */
const buildResponse = allResults => {
  const response = {
    alertMsg: "",
    errors: [],
    failure: [],
    flag: false,
    success: []
  };

  allResults.forEach(x=>{
    x.result?.errors?.forEach( y => response?.errors?.push(y));
    if(x.result?.errors && x.result.errors.length !== 0) {
      x.records.forEach(z => response.failure.push(z));
    } else {
      x.records?.forEach(z => response.success.push(z));
    }
  });

  if(response.failure.length !== 0) {
    response.flag = true;
    response.alertMsg = "Errors occurred processing flow records";
  }

  return response;
};

/**
 * This is the Function to batch create the Flow Object to the DB
 * @param {flowData} items List of Flow object that need to update
 * @param {String} accessToken token to use while calling graphql query
 * @returns
 */
const createDynamicFlowRunItem = async(items, accessToken) =>{
  let response;
  const announcements = [];
  const menus = [];
  const menuOptions = [];
  let callFlowName = "";
  items.map(item=>{
    if(item.actionType === "ANNOUNCEMENT")
    {
      announcements.push({
        nextActionId: item.nextActionId,
        actionId: item.actionId,
        actionType: item.actionType,
        callFlowName: item.callFlowName,
        createTime: Math.floor(new Date().getTime()/1000),
        nextActionType: item.nextActionType,
        speech: item.speech,
        updateTime: Math.floor(new Date().getTime()/1000)
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
        createTime: Math.floor(new Date().getTime()/1000),
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
        updateTime: Math.floor(new Date().getTime()/1000)
      }
      );
    }

    if(item.actionType === "MENUOPTIONS") {
      menuOptions.push({
        actionId: item.actionId,
        actionType: item.actionType,
        callFlowName: item.callFlowName,
        createTime: Math.floor(new Date().getTime()/1000),
        updateTime: Math.floor(new Date().getTime()/1000),
        options:
          item.options.map(option => {
            return {
              callerContextAttributes: JSON.stringify(option.callerContextAttributes),
              digit: option.digit,
              nextActionId: option.nextActionId,
              nextActionType: option.nextActionType
            };
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
    const fetchResponse = await fetch(env.GRAPH_API_URL, {
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

  } catch (error) {
    logger.error("Error in Create Batch Dynamic Flow DB", error);
  }
  return response;
};

/**
 * This is the Function to batch create the Flow Object to the DB
 * @param {flowData} items List of Flow object that need to update
 * @param {String} accessToken token to use while calling graphql query
 * @returns
 */
const createFlowRunItem = async(items, accessToken) =>{
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
      type: item.phoneNumberType || "",
      predictiveCaller: item.predictiveCaller || false,
      selfServiceIndicator: item.selfServiceIndicator || false
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
  } catch (error) {
    logger.error("Error in Create Batch Flow DB", error);
  }
  return response;
};
/**
 * This is the function use to query the appsync API to get the data from DB
 * @param {String} accessToken OAuth tokent to use while calling graphql query
 * @param {String} nextToken Token for next set of data
 * @returns list of data and nextToken if any
 */
async function queryDynamicPhoneData(accessToken, nextToken = null) {
  let result = nextToken ? undefined : {};

  try {
    const response = await fetch(env.GRAPH_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: `
            query listPhoneNumbers {
              listPhoneNumbers(limit: 10000) {
                nextToken
                items {
                      brand
                      callFlowName
                      callFlowRoute
                      callFlowTemplate
                      callFlowType
                      callIntent
                      callTypeDescription
                      callerType
                      channel
                      createTime
                      dataRequests
                      dialedDescription
                      employeeId
                      greetingMessages
                      internetPlacement
                      languageOffer
                      lineOfBusiness
                      marketingChannel
                      nextActionId
                      nextActionType
                      officeNumbers
                      phoneNumber
                      phoneNumberType
                      predictiveCaller
                      rangeIndicator
                      requestID
                      tfnRoutingGroup
                      tollFreeNumber
                      transferCode
                      transferDestination
                      updateTime
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
    logger.error("Error in query Dynamic Flow Data", { error }, false);
    return {
      errors: [error.message]
    };
  }
  return result;
}
/**
 * This is the function to use to call queryFlowData function multiple time
 * until nextToken become null
 * @param {String} accessToken OAuth Access Token
 * @returns {flowData} list of data contain all the result present in DB
 */
async function retrieveDynamicFlowData(accessToken, counter = 1, nextToken = null, rowInsert, flowData = []) {
  return retrieveFlowData(accessToken, counter, nextToken, rowInsert, flowData, queryDynamicPhoneData);
}

function updateDynamicFlowInput(item){
  const updateTime = Math.floor(new Date().getTime()/1000);
  const input = {
    brand: item.brand,
    callFlowName: item.callFlowName,
    callFlowRoute: item.content?.callFlowRoute,
    callFlowTemplate: item.callFlowName,
    callFlowType: item.callFlowType,
    callIntent: item.content?.callIntent,
    callTypeDescription: item.callTypeDescription,
    callerType: item.content?.callerType,
    channel: item.channel,
    createTime: item.createTime ?? updateTime,
    dataRequests: item.content?.dataRequests,
    dialedDescription: item.dialedDescription,
    employeeId: item.employeeId,
    greetingMessages: item.content?.greetingMessages,
    internetPlacement: item.internetPlacement,
    languageOffer: item.content?.languageOffer,
    lineOfBusiness: item.lineOfBusiness,
    marketingChannel: item.marketingChannel,
    nextActionId: item.nextActionId,
    nextActionType: item.nextActionType,
    officeNumbers: item.content?.officeNumbers,
    phoneNumber: item.pkey,
    phoneNumberType: item.phoneNumberType,
    predictiveCaller: item.predictiveCaller,
    rangeIndicator: item.rangeIndicator,
    requestID: item.requestID,
    tfnRoutingGroup: item.tfnRoutingGroup,
    tollFreeNumber: item.tollFreeNumber,
    transferCode: item.transferCode,
    transferDestination: item.content?.transferDestination,
    updateTime,
    whisper: item.whisper
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
 * @returns
 */
async function updateDynamicFlowDB(item, accessToken) {
  let response;
  const input = updateDynamicFlowInput(item);
  try {
    const fetchResponse = await fetch(env.GRAPH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken
      },
      body: JSON.stringify({
        query: `
          mutation updatePhoneNumber($input:PhoneNumberInput!) {
            updatePhoneNumber(input:$input) {
                    phoneNumber
            }
          }
      `,
        variables: {
          input
        }
      })
    });

    response = await fetchResponse.json();
    logger.log("Update Dynamic Flow Rule Response:", response);

  } catch (error) {
    logger.error("Error in update Dynamic Flow DB", { error }, false);
  }
  return response;
}

//TODO why is employeeId in input, then checked again?  Should we remove it from initial def?
function addDynamicFlowInput (item, dataRequestsPassed, currentTimePassed){
  const input = {
    brand: item.brand.value,
    callFlowName: item.callFlowName?.value,
    callFlowRoute: item.callFlowRoute?.value,
    callFlowTemplate: item.callFlowName?.value,
    callFlowType: item.callFlowType?.value,
    callIntent: item.callIntent?.value,
    callTypeDescription: item.callTypeDescription?.value,
    callerType: item.callerType?.value,
    channel: item.channel.value,
    createTime: currentTimePassed,
    dataRequests: dataRequestsPassed,
    dialedDescription: item.dialedDescription.value,
    employeeId: item.employeeId?.value,
    greetingMessages: item.greetingMessages?.value,
    internetPlacement: item.internetPlacement?.value,
    languageOffer: item.languageOffer?.value,
    lineOfBusiness: item.lineOfBusiness?.value,
    marketingChannel: item.marketingChannel?.value,
    nextActionId: item.nextActionId?.value,
    nextActionType: item.nextActionType?.value,
    officeNumbers: item.officeNumbers?.value,
    phoneNumber: item.pkey?.value,
    phoneNumberType: item.phoneNumberType?.value,
    predictiveCaller: item.predictiveCaller?.value,
    rangeIndicator: item.rangeIndicator?.value,
    requestID: item.requestID?.value,
    tfnRoutingGroup: item.tfnRoutingGroup?.value,
    tollFreeNumber: item.tollFreeNumber?.value,
    transferCode: item.transferCode?.value,
    transferDestination: item.transferDestination?.value,
    updateTime: currentTimePassed,
    whisper: item.whisper?.value
  };
  if(item.employeeId?.value){
    input.employeeId = item.employeeId.value;
  }
  return input;
}
/**
 * This is the Function to add the Flow Object to the DB
 * @param {flowData} item Flow object that need to add
 * @param {String} accessToken token to use while calling graphql query
 * @param {Number} curTime the current time, for the db record's create time
 * @returns
 */
async function addDynamicFlowRule(item, accessToken, curTime = Math.floor(new Date().getTime()/1000), dataRequests=[]) {
  let response;
  const input = addDynamicFlowInput(item, dataRequests, curTime);
  try {
    const fetchResponse = await fetch(env.GRAPH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken
      },
      body: JSON.stringify({
        query: `
          mutation AddDynamicFlowRule ($input:PhoneNumberInput! ){
            createPhoneNumber(input:$input) {
              phoneNumber
              phoneNumberType
            }
          }
        `,
        variables: {
          input
        }
      })
    });
    response = await fetchResponse.json();

    logger.log("Add Dynamic Flow Rule Response:", response);
  } catch (error) {
    logger.error("Error in Adding Dynamic Flow Rule", { error }, false);
  }
  return response;
}
/**
 * This is the Function to delete the Flow Object from the DB
 * @param {flowData} item Flow object that need to delete
 * @param {String} accessToken token to use while calling graphql query
 * @returns
 */
async function deleteDynamicFlowRule(item, accessToken) {
  let response;
  const input = {
    phoneNumber: item.pkey,
    callFlowName: item.callFlowName
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
          mutation deletePhoneNumber($input:PhoneNumberDeleteInput!) {
            deletePhoneNumber(input:$input){
              pkey
              skey
            }
          }
      `,
        variables: {
          input
        }
      })
    });
    response = await fetchResponse.json();
    logger.log("Delete Dynamic Flow Rule Response:", response);
  } catch (error) {
    logger.error("Error in Deleting Dynamic Flow Rule", { error }, false);
  }
  return response;
}
async function batchDynamicDeleteItems(items,accessToken){
  var flowDeleteArray=[];
  const size=24;

  const itemsCopy = [...items];
  while (itemsCopy.length > 0){
    flowDeleteArray.push(itemsCopy.splice(0, size));
  }

  const allResults = await Promise.all(
    flowDeleteArray.map(
      async flowValue => {
        return {
          records: flowValue,
          result: await flowDynamicBatchDelete(flowValue, accessToken)
        };
      }
    )
  );
  const response = buildResponse(allResults);

  logger.info("Delete Batch Flow DB Response:", { response });
  return response;
}
async function flowDynamicBatchDelete(items, accessToken){
  const input = items.map(item=>{
    return {
      callFlowName: item.callFlowName,
      phoneNumber: item.phoneNumber
    };
  });

  let response;
  try{ //TODO fix input parameter
    const body = JSON.stringify({
      query: `
      mutation batchDeletePhoneNumber(input: PhoneNumberDeleteBatchInput!) {
        batchDeletePhoneNumber(input: $input) {
          items {
              phoneNumber
              callFlowName
          }
        }
      }
    `,
      variables: {
        input: { batchDeletePhoneNumberInput: input }
      }
    }).replace(/\\"pkey\\":/g, "pkey:");

    const fetchResponse = await fetch(env.GRAPH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken
      },
      body
    });
    response = await fetchResponse.json();
    logger.log("Batch Delete Dynamic Flow Rule Response:", response);

  } catch (error) {
    logger.error("Error in Dynamic Flow Batch Delete", { error }, false);
  }
  return response;
}
/**
 * This is the Function to batch update the Flow Object to the DB
 * @param {flowData} items List of Flow object that need to update
 * @param {String} accessToken token to use while calling graphql query
 * @returns
 */
const batchDynamicFlowUpdate = async(items, accessToken) =>{
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
  const dynamicFlowUpdateArray=[];
  const size = 25;

  const itemsCopy = [...items];
  while(itemsCopy.length>0){
    dynamicFlowUpdateArray.push(itemsCopy.splice(0,size));
  }
  const allResults = await Promise.all(
    dynamicFlowUpdateArray.map(
      async flowUpdate => {
        return {
          records: flowUpdate,
          result: await updateDynamicFlowBatchRun(flowUpdate, accessToken)
        };
      }
    )
  );

  const response = buildResponse(allResults);

  logger.info("Update Batch Dynamic Flow DB Response:", { response });

  return response;
};
const updateDynamicFlowBatchRun = async(items, accessToken) =>{
  const input = items.map(item=>{
    return {
      brand: item.brand,
      callFlowName: item.callFlowName,
      callFlowRoute: item.content?.callFlowRoute,
      callFlowTemplate: item.callFlowName,
      callFlowType: item.callFlowType,
      callIntent: item.content?.callIntent,
      callTypeDescription: item.callTypeDescription,
      callerType: item.content?.callerType,
      channel: item.channel,
      createTime: item.createTime,
      dataRequests: item.content?.dataRequests,
      dialedDescription: item.dialedDescription,
      employeeId: item.employeeId,
      greetingMessages: item.content?.greetingMessages,
      internetPlacement: item.internetPlacement,
      languageOffer: item.content?.languageOffer,
      lineOfBusiness: item.lineOfBusiness,
      marketingChannel: item.marketingChannel,
      nextActionId: item.nextActionId,
      nextActionType: item.nextActionType,
      officeNumbers: item.content?.officeNumbers,
      phoneNumber: item.pkey,
      phoneNumberType: item.phoneNumberType,
      predictiveCaller: item.predictiveCaller,
      rangeIndicator: item.rangeIndicator,
      requestID: item.requestID,
      tfnRoutingGroup: item.tfnRoutingGroup,
      tollFreeNumber: item.tollFreeNumber,
      transferCode: item.transferCode,
      transferDestination: item.content?.transferDestination,
      updateTime: Math.floor(new Date().getTime()/1000),
      whisper: item.whisper
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
        mutation batchCreatePhoneNumber($input: PhoneNumberCreateBatchInput!) {
          batchCreatePhoneNumber(input: $input) {
            items {
                phoneNumber
                callFlowName
                createTime
                updateTime
                nextActionType
                nextActionId
                callFlowTemplate
                dialedDescription
                phoneNumberType
                tfnRoutingGroup
                brand
                dataRequests
                greetingMessages
                languageOffer
                transferDestination
                callerType
                callFlowRoute
                callIntent
                callFlowType
                channel
                predictiveCaller
                employeeId
                callTypeDescription
                internetPlacement
                lineOfBusiness
                marketingChannel
                rangeIndicator
                requestID
                tollFreeNumber
                transferCode
                whisper
                officeNumbers
            }
          }
        }
      `,
        variables: {
          input: { batchPhoneNumberInput: input }
        }
      })
    });

    return await fetchResponse.json();
  } catch (error) {
    logger.error("Error in Update Batch Flow DB", { error });
    return { errors: [{ message: error }]};
  }
};

export {
  addDynamicFlowRule,
  addFlowRule,
  batchDeleteItems,
  batchDynamicDeleteItems,
  batchDynamicFlowCreate,
  batchDynamicFlowUpdate,
  batchFlowCreate,
  batchFlowUpdate,
  deleteDynamicFlowRule,
  deleteFlowRule,
  flowBatchDelete,
  flowDynamicBatchDelete,
  queryDynamicFlowData,
  queryDynamicPhoneData,
  queryFlowData,
  retrieveDynamicFlowData,
  retrieveFlowData,
  updateDynamicFlowDB,
  updateFlowDB
};