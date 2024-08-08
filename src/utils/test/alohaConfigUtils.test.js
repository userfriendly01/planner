import {
  EXPORT_FILE_PREFIX,
  ErrorDuplicateRecord,
  cleanErrorMessage,
  downloadCSV,
  readWriteAccess
} from "../alohaConfigUtils";
import { useAdminState } from "context/appContext";
import {
  initialTestState, adGroupPermissionMapping
} from "testUtils";

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn()
}));

const createSampleTestRoutingDataList = numberOfData =>{
  const dataList = [];
  for (let num=1; num<=numberOfData; num++) {
    const routingData = {
      id: num,
      all: "ALL",
      brand: `TestBrand${num}`,
      callIntent: `TestCallIntent${num}`,
      callerState: `TestCallState${num}`,
      callerType: `TestCallType${num}`,
      channel: `TestChannel${num}`,
      dayOfWeek: "ALL",
      endTime: "12:00:00 PM",
      percentOfCallers: "10",
      pkey: "testcallintent",
      policyType: `TestPolicyType${num}`,
      skey: `TestBrand${num}_TestChannel${num}_${num}`,
      startTime: "05:00:00 PM",
      transferDestination: `1234567${num}`,
      transferMessage: `Test Transfer Message ${num}`,
      twilioSkill: `Test Twilio Skill${num}`,
      crcSkill: null
    };
    dataList.push(routingData);
  }
  return dataList;
};
const createSampleTestCallFlowDataList = numberOfData =>{
  const dataList = [];
  for (let num=1; num<=numberOfData; num++) {
    const callFlowData = {
      pkey: "pkey1",
      accountManager: "am1",
      affinityVDN: "avdn1",
      agentId: "agent",
      brand: "br",
      callDetails1: "cd1",
      callDetails2: "cd2",
      callFlowName: "cfn",
      callFlowTemplate: "cft",
      callFlowType: "cft",
      callTypeDescription: "cdd",
      channel: "ch",
      content: {
        callFlowRoute: "cfr",
        callIntent: "ci",
        callerType: "ct",
        dataRequests: ["data"],
        greetingMessages: "hi, bye.",
        languageOffer: "Spanish",
        officeNumbers: ["012","0345"],
        transferDestination: "td"
      },
      createTime: "2024-08-08T13:13:15.749Z",
      dialedDescription: "dd",
      internetPlacement: "ip",
      lineOfBusiness: "lob",
      marketingChannel: "mc",
      nextActionId: "naid",
      nextActionType: "nat",
      phoneNumberType: "ptt",
      predictiveCaller: false,
      rangeIndicator: "ri",
      requestID: "rid",
      tfnRoutingGroup: "trg",
      transferCode: "tc",
      userDestination: "ud",
      whisper: "w",
      id: 0
    };
    dataList.push(callFlowData);
  }
  return dataList;
};

describe("alohaConfigUtils.js", ()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
  });
  test("Simulate Download the Routing Data",()=>{
    const link = {
      click: jest.fn()
    };
    jest.spyOn(document, "createElement").mockImplementation(() => link);
    const routingDataList = createSampleTestRoutingDataList(1);
    downloadCSV(EXPORT_FILE_PREFIX.ROUTING, routingDataList);
    expect(link.download).toContain(EXPORT_FILE_PREFIX.ROUTING);
    const href = "data:text/csv;charset%3Dutf-8,all,pkey,skey,brand,callerState,callerType,callIntent,channel,dayOfWeek,transferDestination,transferMessage,twilioSkill,percentOfCallers,policyType,startTime,endTime,crcSkill,priority,alternateTransferDestination,tfnRoutingGroup,occupancyCheck,routingSteps,id%0AALL,%22testcallintent%22,TestBrand1_TestChannel1_1,TestBrand1,TestCallState1,TestCallType1,TestCallIntent1,TestChannel1,ALL,12345671,Test%20Transfer%20Message%201,Test%20Twilio%20Skill1,10,TestPolicyType1,05:00:00%20PM,12:00:00%20PM,,,,,,,1%0A";
    expect(link.href).toBe(href);
  });

  test("Simulate Download the Call Flow Data",()=>{
    const link = {
      click: jest.fn()
    };
    jest.spyOn(document, "createElement").mockImplementation(() => link);
    const routingDataList = createSampleTestCallFlowDataList(1);
    downloadCSV(EXPORT_FILE_PREFIX.FLOW, routingDataList);
    expect(link.download).toContain(EXPORT_FILE_PREFIX.FLOW);
    const href = "data:text/csv;charset%3Dutf-8,dialedPhoneNumber,accountManager,affinityVDN,agentId,brand,callDetails1,callDetails2,callFlowName,callFlowTemplate,callFlowType,callTypeDescription,channel,callFlowRoute,callIntent,callerType,dataRequests,greetingMessages,languageOffer,officeNumbers,transferDestination,createTime,dialedDescription,employeeId,internetPlacement,lineOfBusiness,marketingChannel,nextActionId,nextActionType,phoneNumberType,predictiveCaller,rangeIndicator,requestID,tfnRoutingGroup,transferCode,userDestination,whisper,id%0A%22pkey1%22,am1,avdn1,agent,br,cd1,cd2,cfn,cft,cft,cdd,ch,cfr,ci,ct,data,%22hi,%20bye.%22,Spanish,%22012,0345%22,td,2024-08-08T13:13:15.749Z,dd,,ip,lob,mc,naid,nat,ptt,false,ri,rid,trg,tc,ud,w,0%0A";
    expect(link.href).toBe(href);
  });

  test("Simulate read-write of routing data",()=>{
    const flag = readWriteAccess(adGroupPermissionMapping, "RouteReadWrite");
    expect(flag).toBe(true);
  });

  test("Simulate Download With Empty Routing Data",()=>{
    const link = {
      click: jest.fn()
    };
    jest.spyOn(document, "createElement").mockImplementation(() => link);
    const routingDataList = createSampleTestRoutingDataList(0);
    downloadCSV(EXPORT_FILE_PREFIX.ROUTING, routingDataList);
    expect(link.download).toBeNull;
  });
  test("Simulate cleanErrorMessage", ()=>{
    const duplicateError = [{
      message: "The conditional request failed (Service: DynamoDb, Status Code: 400, Request ID: HMR08U7OR4C9Q33EIKEGJBC5TRVV4KQNSO5AEMVJF66Q9ASUAAJG)",
      errorType: "DynamoDB:ConditionalCheckFailedException"

    }];
    const someOtherError = "Failure";
    const otherError = [{
      message: someOtherError,
      errorType: "Boop"

    }];
    expect(cleanErrorMessage(duplicateError)).toBe(ErrorDuplicateRecord);
    expect(cleanErrorMessage(otherError)).toBe(someOtherError);
  });

});