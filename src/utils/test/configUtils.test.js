import {
  ErrorDuplicateRecord,
  cleanErrorMessage,
  downloadCSV, getGraphQLEndpoint,
  readWriteAccess
} from "utils";
import { useAdminState } from "context";
import {
  initialTestState, adGroupPermissionMapping
} from "testUtils";

jest.mock("context", () => ({
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

describe("configUtils.js", ()=>{
  const routingPrefix = "TEST_ROUTING";
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
    downloadCSV(routingPrefix, routingDataList);
    expect(link.download).toContain("TEST_ROUTING");
    const href = "data:text/csv;charset%3Dutf-8,id%7Call%7Cbrand%7CcallIntent%7CcallerState%7CcallerType%7Cchannel%7CdayOfWeek%7CendTime%7CpercentOfCallers%7Cpkey%7CpolicyType%7Cskey%7CstartTime%7CtransferDestination%7CtransferMessage%7CtwilioSkill%7CcrcSkill%0A1%7CALL%7CTestBrand1%7CTestCallIntent1%7CTestCallState1%7CTestCallType1%7CTestChannel1%7CALL%7C12:00:00%20PM%7C10%7Ctestcallintent%7CTestPolicyType1%7CTestBrand1_TestChannel1_1%7C05:00:00%20PM%7C12345671%7CTest%20Transfer%20Message%201%7CTest%20Twilio%20Skill1%7C%0A";
    expect(link.href).toBe(href);
  });

  test("Simulate read-write of routing data",()=>{
    const flag = readWriteAccess(adGroupPermissionMapping,"aloha-route");
    expect(flag).toBe(false);
  });

  test("Simulate Download With Empty Routing Data",()=>{
    const link = {
      click: jest.fn()
    };
    jest.spyOn(document, "createElement").mockImplementation(() => link);
    const routingDataList = createSampleTestRoutingDataList(0);
    downloadCSV(routingPrefix, routingDataList);
    expect(link.download).toBeNull;
  });
  test("Simulate getGraphQLEndpoint", ()=>{
    const env = useAdminState().userContext.pingIdentity.environment;
    const endpoint = getGraphQLEndpoint();
    const endPointURI = new Map();
    endPointURI.set("development","https://flyyckd74fauthoxf5fj23ko6m.appsync-api.us-east-1.amazonaws.com/graphql");
    endPointURI.set("test","https://molg2ylkqrhtpniyfncvue57ha.appsync-api.us-east-1.amazonaws.com/graphql");
    endPointURI.set("production", "https://23gxrcju6rfgvlzp6onvg2az5q.appsync-api.us-east-1.amazonaws.com/graphql");
    expect(endpoint).toBe(endPointURI.get(env));
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