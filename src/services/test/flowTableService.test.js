import { act } from "@testing-library/react";
import  {
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
  queryFlowData,
  retrieveDynamicFlowData,
  retrieveFlowData,
  updateDynamicFlowDB,
  updateFlowDB
}  from "../flowTableService";

const jsonDynamicFlowData = {
  brand: "LM",
  callFlowTemplate: "temp",
  channel: "Test1 Channel",
  content: {
    callFlowRoute: "test",
    callIntent: "",
    callerType: "test",
    dataRequests: "test1,test2",
    greetingMessages: "Hello Test Message",
    languageOffer: "English",
    officeNumbers: []
  },
  createTime: "2022-24-08",
  dialedDescription: "test",
  employeeId: "n1234567",
  pkey: "12345",
  transferNumber: "123456789",
  updateTime: "2024-01-30T05:00:00.000Z",
  userDestination: "dest"
};

const jsonFlowData = {
  pkey: { value: "12345" },
  brand: { value: "LM" },
  callFlowTemplate: { value: "temp" },
  channel: { value: "Test1 Channel" },
  createTime: { value: "2022-24-08" },
  updateTime: { value: "2024-01-30T05:00:00.000Z" },
  dialedDescription: { value: "test" },
  employeeId: { value: "n1234567" },
  userDestination: { value: "dest" },
  callerType: { value: "test" },
  callFlowRoute: { value: "test" },
  dataRequests: { value: "test1,test2" },
  greetingMessages: { value: "Hello Test Message" },
  languageOffer: { value: "English" },
  transferNumber: { value: "123456789" }
};
const batchDeleteItemsList = ["pkey1","pkey1","pkey3"];

const batchDeleteResponse = {
  data: {
    listCctSharedCallFlowDbs: {
      items: batchDeleteItemsList,
      nextToken: undefined
    }
  }
};
const curTime = "1971-05-25T04:00:00.000Z";
const curTimeUnixEpoch = 43992000;

describe("flowTableService",()=>{
  describe("AddFlow", ()=>{
    beforeEach(()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: { items: []},
            error: []
          })
        })
      );
    });
    afterEach(()=>{
      jest.restoreAllMocks();
    });
    test("Simulate Add Flow Rule", async()=>{
      const validAddFlowData = {
        pkey: { value: "12345" },
        brand: { value: "LM" },
        callFlowTemplate: { value: "temp" },
        channel: { value: "Test1 Channel" },
        createTime: { value: "2022-24-08" },
        dialedDescription: { value: "test" },
        employeeId: { value: "n1234567" },
        userDestination: { value: "dest" },
        callerType: { value: "test" },
        callFlowRoute: { value: "test" },
        dataRequests: { value: "test1,test2" },
        greetingMessages: { value: "Hello Test Message" },
        languageOffer: { value: "English" },
        transferNumber: { value: "123456789" }
      };
      const addFlow = await addFlowRule(validAddFlowData,"TEST","TEST");
      expect(addFlow.error).toStrictEqual([]);
    });
    test("Simulate AddFlow with limited data", async()=>{
      const invalidAddFlowData = {
        pkey: { value: "12345" },
        brand: { value: "LM" },
        channel: { value: "Test1 Channel" },
        createTime: { value: "2022-24-08" },
        dialedDescription: { value: "test" },
        dataRequests: { value: undefined }
      };
      const addFlow = await addFlowRule(invalidAddFlowData,"TEST","TEST");
      expect(addFlow.error).toStrictEqual([]);
    });
    test("Simulate AddFlow with an error", async()=>{
      const invalidAddFlowData = {
        pkey: { value: "12345" },
        brand: { value: "LM" },
        channel: { value: "Test1 Channel" },
        createTime: { value: "2022-24-08" },
        dialedDescription: { value: "test" },
        dataRequests: { value: undefined }
      };
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      const addFlow = await addFlowRule(invalidAddFlowData,"TEST","TEST");
      expect(addFlow).toBeUndefined;
    });
  });
  describe("CallFlow List",()=>{
    const jsonFlowData = [
      {
        id: 1,
        pkey: "12345",
        brand: "LM",
        callFlowTemplate: "temp",
        channel: "Test1 Channel",
        createTime: "2022-24-08",
        updateTime: "2024-01-30T05:00:00.000Z",
        dialedDescription: "test",
        employeeId: "n1234567",
        userDestination: "dest"
      }
      ,{
        id: 2,
        pkey: "23456",
        brand: "LM",
        callFlowTemplate: "temp",
        channel: "Test1 Channel",
        createTime: "2022-24-08",
        updateTime: "2024-01-30T05:00:00.000Z",
        dialedDescription: "test",
        employeeId: "n1234567",
        userDestination: "dest"
      }
    ];

    beforeEach(()=>{
      jest.restoreAllMocks();
    });
    afterEach(()=>{
      jest.resetAllMocks();
    });
    test("CallFlow list finds 1",async()=>{
      const insertRows = jest.fn();
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              listCctSharedCallFlowDbs: {
                items: jsonFlowData,
                nextToken: undefined
              }
            }
          })
        })
      );
      await retrieveFlowData("12345","",1,"", insertRows);
      expect(insertRows).toHaveBeenCalledTimes(1);
      expect(insertRows).toHaveBeenCalledWith(jsonFlowData);
    });
    test("CallFlow list finds 2",async()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              listCctSharedCallFlowDbs: {
                items: jsonFlowData,
                nextToken: undefined
              }
            }
          })
        })
      );
      const listFlow = await queryFlowData("12345","TEST","http://localhost:8082");
      expect(listFlow.data.listCctSharedCallFlowDbs.items).toEqual(jsonFlowData);
    });
    test("retrieveFlowData creates the IDs and skips nulls",async()=>{
      const insertRows = jest.fn();
      const items = JSON.parse(JSON.stringify(jsonFlowData));
      items[0].id = undefined;
      items[1].id = undefined;
      items[2] = null;
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              listCctSharedCallFlowDbs: {
                items,
                nextToken: undefined
              }
            }
          })
        })
      );
      await retrieveFlowData("12345","", 1, "", insertRows, []);
      expect(insertRows).toHaveBeenCalledWith(jsonFlowData);
    });
    test("CallFlow list finds error",async()=>{
      const insertRows = jest.fn();
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: []
          })
        })
      );
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      const listFlow = await queryFlowData("12345","TEST", 1, "", insertRows, "http://localhost:8082");
      expect(listFlow).toBeDefined;
    });
    test("CallFlow list not found",async()=>{
      const insertRows = jest.fn();
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              listCctSharedCallFlowDbs: {
                items: [],
                nextToken: undefined
              }
            }
          })
        })
      );
      const listFlow = await retrieveFlowData("1234-5678","TEST", 1, "", insertRows, jsonFlowData);
      expect(insertRows).not.toHaveBeenCalled();
      expect(listFlow.errors).toBe(false);
    });
    test("pass null in list",async()=>{
      const insertRows = jest.fn();
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: []
          })
        })
      );
      const listFlow = await retrieveFlowData("1234-5678","TEST", 1, "", insertRows, jsonFlowData);
      expect(insertRows).not.toHaveBeenCalled();
      expect(listFlow.errors).toBe(false);
    });
    test("Error scenario ",async()=>{
      const insertRows = jest.fn();
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: []
          })
        })
      );
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      const listFlow = await retrieveFlowData("1234-5678","TEST", 1, "", insertRows, jsonFlowData);
      expect(insertRows).not.toHaveBeenCalled();
      expect(listFlow.errors).toBe(true);

    });
  });
  describe("Delete Flow", ()=>{
    beforeEach(()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              listCctSharedCallFlowDbs: {
                items: jsonFlowData
              }
            }
          })
        })
      );
    });
    afterEach(()=>{
      jest.restoreAllMocks();
    });
    test("Testing the Delete Flow",async()=>{
      const item = {
        pkey: 1
      };
      const delFlow = await deleteFlowRule(item,"1233-3245","http://localhost:3000");
      expect(delFlow).toBeDefined;
    });
    test("Testing the Delete FlowRule error",async()=>{
      const item = {
      };
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      const delFlow = await deleteFlowRule(item,"1233-3245","http://localhost:3000");
      expect(delFlow).toBeDefined;
    });
  });
  describe("Update Flow", ()=>{
    beforeEach(()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              listCctSharedCallFlowDbs: {
                items: jsonFlowData
              }
            }
          })
        })
      );
    });
    afterEach(()=>{
      jest.restoreAllMocks();
    });
    test("Testing the Update Flow",async()=>{
      const item = {
        pkey: 1,
        employeeId: "n123453"
      };
      const updateFlow = await updateFlowDB(item,"1233-3245","http://localhost:3000");
      expect(updateFlow).toBeTruthy();
    });
    test("Testing the Update FlowRule error",async()=>{
      const item = {
        pkey: 1
      };
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      const updateFlow = await updateFlowDB(item,"1233-3245","http://localhost:3000");
      expect(updateFlow).toBeUndefined();
    });
  });
  describe("Batch Delete Flow", ()=>{
    beforeEach(()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(batchDeleteResponse)
        })
      );
    });
    afterEach(()=>{
      jest.restoreAllMocks();
    });
    test("Success",async()=>{
      const response = await flowBatchDelete(batchDeleteItemsList,"1233-3245","http://localhost:3000");
      expect(response).toBe(batchDeleteResponse);
      expect(window.fetch).toBeCalledWith("http://localhost:3000", {
        "body": "{\"query\":\"\\n        mutation DeleteManyFlow {\\n          batchDeleteCctSharedCallFlowDb(input: {\\n            pkey: [\\\"pkey1\\\",\\\"pkey1\\\",\\\"pkey3\\\"]\\n            }) {\\n            items {\\n              pkey\\n            }\\n          }\\n        }\\n    \",\"variables\":{}}",
        "headers": {
          "Authorization": "1233-3245",
          "Content-Type": "application/json"
        },
        "method": "POST"
      });
    });
    test("batch Delete",async()=>{
      await flowBatchDelete(batchDeleteItemsList,"1233-3245","http://localhost:3000");
      const response=batchDeleteItems(batchDeleteItemsList,"3245","http://localhost:3000");
      act(()=>{
        expect(response).toBeTruthy();
      });
    });
    test("Error",async()=>{
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      const response = await flowBatchDelete(batchDeleteItemsList,"1233-3245","http://localhost:3000");
      expect(response).toEqual(undefined);
    });
    test("Batch Delete Error",async()=>{
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      await flowBatchDelete(batchDeleteItemsList,"1233-3245","http://localhost:3000");
      const response = await batchDeleteItems(batchDeleteItemsList,"3245","http://localhost:3000");
      expect(response).toBeTruthy();
    });
  });
  describe("Batch Update Flow", ()=>{
    const batchUpdateResponse = {
      failure: [],
      flag: false,
      success: []
    };
    beforeEach(()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(batchUpdateResponse)
        })
      );
      jest.useFakeTimers("modern");
      jest.setSystemTime(new Date(1706590800000));
    });
    afterEach(()=>{
      jest.restoreAllMocks();
      jest.useRealTimers();
    });
    test("Success",async()=>{
      const batchUpdateResponse = {
        alertMsg: "",
        errors: [],
        failure: [],
        flag: false,
        success: [jsonFlowData]
      };
      const response = await batchFlowUpdate([{ ...jsonFlowData }],"1233-3245","http://localhost:3000");
      expect(response).toEqual(batchUpdateResponse);
      expect(window.fetch).toBeCalledWith("http://localhost:3000", {
        "body": "{\"query\":\"\\n        mutation batchUpdateCctSharedCallFlowDb($input: CctSharedCallFlowDbBatchUpdateInput!) {\\n          batchUpdateCctSharedCallFlowDb(input: $input) {\\n            items {\\n              accountManager\\n              affinityVDN\\n              agentId\\n              brand\\n              callDetails1\\n              callDetails2\\n              callFlowTemplate\\n              callTypeDescription\\n              channel\\n              content {\\n                callFlowRoute\\n                callIntent\\n                callerType\\n                dataRequests\\n                greetingMessages\\n                languageOffer\\n                transferNumber\\n              }\\n              createTime\\n              dialedDescription\\n              employeeId\\n              internetPlacement\\n              lineOfBusiness\\n              marketingChannel\\n              pkey\\n              predictiveCaller\\n              rangeIndicator\\n              requestID\\n              selfServiceIndicator\\n              tollFreeNumber\\n              tfnRoutingGroup\\n              transferCode\\n              type\\n              userDestination\\n              whisper\\n            }\\n          }\\n        }\\n      \",\"variables\":{\"input\":{\"batchFlowUpdateInput\":[{\"pkey\":{\"value\":\"12345\"},\"agentId\":\"\",\"brand\":{\"value\":\"LM\"},\"callFlowTemplate\":{\"value\":\"temp\"},\"channel\":{\"value\":\"Test1 Channel\"},\"content\":{\"callIntent\":\"\",\"callFlowRoute\":\"\",\"callerType\":\"\",\"greetingMessages\":\"\",\"transferNumber\":\"\",\"languageOffer\":\"\"},\"createTime\":{\"value\":\"2022-24-08\"},\"updateTime\":\"2024-01-30T05:00:00.000Z\",\"dialedDescription\":{\"value\":\"test\"},\"accountManager\":\"\",\"affinityVDN\":\"\",\"callTypeDescription\":\"\",\"transferCode\":\"\",\"internetPlacement\":\"\",\"callDetails1\":\"\",\"callDetails2\":\"\",\"tollFreeNumber\":\"\",\"lineOfBusiness\":\"\",\"marketingChannel\":\"\",\"predictiveCaller\":false,\"selfServiceIndicator\":false,\"whisper\":\"\",\"requestID\":\"\",\"userDestination\":{\"value\":\"dest\"},\"rangeIndicator\":\"\",\"tfnRoutingGroup\":\"\",\"type\":\"\"}]}}}",
        "headers": {
          "Authorization": "1233-3245",
          "Content-Type": "application/json"
        },
        "method": "POST"
      });
    });
    test("Error",async()=>{
      const batchUpdateResponse = {
        "alertMsg": "Errors occurred processing flow records",
        errors: [{ ...jsonFlowData }],
        failure: [],
        flag: true,
        success: []
      };
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      const response = await batchFlowUpdate([{ ...jsonFlowData }],"1233-3245","http://localhost:3000");
      expect(response.alertMsg).toEqual(batchUpdateResponse.alertMsg);
      expect(response.flag).toEqual(batchUpdateResponse.flag);
    });
    test("Call with an Empty List", async()=>{
      const response = await batchFlowUpdate([],"1233-3245","http://localhost:3000");
      const errorResponse = {
        errors: [
          "Please Select Something to Edit"
        ],
        flag: true,
        success: [],
        failure: []
      };
      expect(response).toEqual(errorResponse);
    });
  });

  describe("Batch Create Flow", ()=>{
    const batchCreateResponse = {
      errors: [],
      failure: [],
      flag: false,
      success: []
    };
    beforeEach(()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(batchCreateResponse)
        })
      );
    });
    afterEach(()=>{
      jest.restoreAllMocks();
    });
    test("Success",async()=>{
      const batchCreateResponse = {
        alertMsg: "",
        errors: [],
        failure: [],
        flag: false,
        success: [jsonFlowData]
      };
      const response = await batchFlowCreate([{ ...jsonFlowData }],"1233-3245","http://localhost:3000");
      expect(response).toEqual(batchCreateResponse);
      expect(window.fetch).toBeCalledWith("http://localhost:3000", {
        "body": "{\"query\":\"\\n        mutation batchCreateCctSharedCallFlowDb($input: CctSharedCallFlowDbBatchCreateInput!) {\\n          batchCreateCctSharedCallFlowDb(input: $input) {\\n            items {\\n              accountManager\\n              affinityVDN\\n              agentId\\n              brand\\n              callDetails1\\n              callDetails2\\n              callFlowTemplate\\n              callTypeDescription\\n              channel\\n              content {\\n                callFlowRoute\\n                callIntent\\n                callerType\\n                dataRequests\\n                greetingMessages\\n                languageOffer\\n                transferNumber\\n              }\\n              createTime\\n              dialedDescription\\n              employeeId\\n              internetPlacement\\n              lineOfBusiness\\n              marketingChannel\\n              pkey\\n              predictiveCaller\\n              rangeIndicator\\n              requestID\\n              selfServiceIndicator\\n              tollFreeNumber\\n              transferCode\\n              type\\n              userDestination\\n              whisper\\n            }\\n          }\\n        }\\n      \",\"variables\":{\"input\":{\"batchFlowCreateInput\":[{\"pkey\":{\"value\":\"12345\"},\"agentId\":\"\",\"brand\":{\"value\":\"LM\"},\"callFlowTemplate\":{\"value\":\"temp\"},\"channel\":{\"value\":\"Test1 Channel\"},\"content\":{\"callIntent\":\"\",\"callFlowRoute\":\"\",\"callerType\":\"\",\"greetingMessages\":\"\",\"transferNumber\":\"\",\"languageOffer\":\"\"},\"createTime\":{\"value\":\"2022-24-08\"},\"dialedDescription\":{\"value\":\"test\"},\"accountManager\":\"\",\"affinityVDN\":\"\",\"callTypeDescription\":\"\",\"transferCode\":\"\",\"internetPlacement\":\"\",\"callDetails1\":\"\",\"callDetails2\":\"\",\"tollFreeNumber\":\"\",\"lineOfBusiness\":\"\",\"marketingChannel\":\"\",\"whisper\":\"\",\"requestID\":\"\",\"userDestination\":{\"value\":\"dest\"},\"rangeIndicator\":\"\",\"type\":\"\",\"predictiveCaller\":false,\"selfServiceIndicator\":false}]}}}",
        "headers": {
          "Authorization": "1233-3245",
          "Content-Type": "application/json"
        },
        "method": "POST"
      });
    });
    test("empty records insertion",async()=>{
      const response = await batchFlowCreate([],"1233-3245","http://localhost:3000");
      expect(response.alertMsg).toEqual("Please select something to add");
    });
  });
});

// Dynamic Flow Testing
describe("dynamicFlowTableService",()=> {
  describe("AddDynamicFlow", ()=>{
    beforeEach(()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: { items: []},
            error: []
          })
        })
      );
    });
    afterEach(()=>{
      jest.restoreAllMocks();
    });
    test("Simulate Add Dynamic Flow Rule", async()=>{
      const validAddDynamicFlowData = {
        pkey: { value: "12345" },
        agentId: { value: "123455" },
        brand: { value: "LM" },
        callFlowTemplate: { value: "temp" },
        channel: { value: "Test1 Channel" },
        createTime: { value: "2022-24-08" },
        dialedDescription: { value: "test" },
        employeeId: { value: "n1234567" },
        userDestination: { value: "dest" },
        callerType: { value: "test" },
        callFlowRoute: { value: "test" },
        dataRequests: { value: "test1,test2" },
        greetingMessages: { value: "Hello Test Message" },
        languageOffer: { value: "English" },
        transferNumber: { value: "123456789" }
      };
      const addDynamicFlow = await addDynamicFlowRule(validAddDynamicFlowData,"TEST","TEST");
      expect(addDynamicFlow.error).toStrictEqual([]);
    });
    test("Simulate AddDynamicFlow with limited data", async()=>{
      const invalidAddDynamicFlowData = {
        pkey: { value: "12345" },
        brand: { value: "LM" },
        channel: { value: "Test1 Channel" },
        createTime: { value: "2022-24-08" },
        dialedDescription: { value: "test" },
        dataRequests: { value: undefined }
      };
      const addDynamicFlow = await addDynamicFlowRule(invalidAddDynamicFlowData,"TEST","TEST");
      expect(addDynamicFlow.error).toStrictEqual([]);
    });
    test("Simulate AddDynamicFlow with an error", async()=>{
      const invalidAddDynamicFlowData = {
        pkey: { value: "12345" },
        brand: { value: "LM" },
        channel: { value: "Test1 Channel" },
        createTime: { value: "2022-24-08" },
        dialedDescription: { value: "test" },
        dataRequests: { value: undefined }
      };
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      const addDynamicFlow = await addDynamicFlowRule(invalidAddDynamicFlowData,"TEST","TEST");
      expect(addDynamicFlow).toBeUndefined;
    });
  });

  describe("CallDynamicFlow List",()=>{
    const jsonDynamicFlowData = [
      {
        id: 1,
        pkey: "12345",
        agentId: "123455",
        brand: "LM",
        callFlowTemplate: "temp",
        channel: "Test1 Channel",
        createTime: "2022-24-08",
        updateTime: "2024-01-30T05:00:00.000Z",
        dialedDescription: "test",
        employeeId: "n1234567",
        userDestination: "dest"
      }
      ,{
        id: 2,
        pkey: "23456",
        agentId: "123455",
        brand: "LM",
        callFlowTemplate: "temp",
        channel: "Test1 Channel",
        createTime: "2022-24-08",
        updateTime: "2024-01-30T05:00:00.000Z",
        dialedDescription: "test",
        employeeId: "n1234567",
        userDestination: "dest"
      }
    ];

    beforeEach(()=>{
      jest.restoreAllMocks();
    });
    afterEach(()=>{
      jest.resetAllMocks();
    });
    test("CallDynamicFlow list finds 1",async()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              listPhoneNumbers: {
                items: jsonDynamicFlowData,
                nextToken: undefined
              }
            }
          })
        })
      );
      const listFlow = await retrieveDynamicFlowData("12345","",1, undefined, jest.fn(), []);
      expect(listFlow).toEqual({
        counter: 3,
        errors: false,
        flowData: jsonDynamicFlowData
      });
    });
    test("CallDynamicFlow list finds 2",async()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              listPhoneNumbers: {
                items: jsonDynamicFlowData,
                nextToken: undefined
              }
            }
          })
        })
      );
      const listFlow = await queryDynamicFlowData("12345","TEST","http://localhost:8082");
      expect(listFlow.data.listPhoneNumbers.items).toEqual(jsonDynamicFlowData);
    });
    test("retrieveDynamicFlowData creates the IDs and skips nulls",async()=>{
      const dynamicItems = JSON.parse(JSON.stringify(jsonDynamicFlowData));
      dynamicItems[0].id = undefined;
      dynamicItems[1].id = undefined;
      dynamicItems[2] = null;
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              listPhoneNumbers: {
                items: dynamicItems,
                nextToken: undefined
              }
            }
          })
        })
      );
      const listDynamicFlow = await retrieveDynamicFlowData("12345","",1, null, jest.fn(), []);
      expect(listDynamicFlow).toEqual({
        counter: 3,
        errors: false,
        flowData: jsonDynamicFlowData
      });
    });
    test("CallDynamicFlow list finds error",async()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: []
          })
        })
      );
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      const listDynamicFlow = await queryDynamicFlowData("12345","TEST","http://localhost:8082");
      expect(listDynamicFlow).toBeDefined;
    });
    test("CallDynamicFlow list not found",async()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              listPhoneNumbers: {
                items: [],
                nextToken: undefined
              }
            }
          })
        })
      );
      const listDynamicFlow = await retrieveDynamicFlowData("1234-5678","TEST", 1, undefined, jest.fn(), jsonDynamicFlowData);
      expect(listDynamicFlow).toEqual({
        counter: 1,
        errors: false,
        flowData: jsonDynamicFlowData
      });
    });
    test("pass null in dyanmic list",async()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: []
          })
        })
      );
      const listDynamicFlow = await retrieveDynamicFlowData("1234-5678","TEST",  1, undefined, jest.fn(), jsonDynamicFlowData);
      expect(listDynamicFlow).toEqual({
        counter: 1,
        errors: false,
        flowData: jsonDynamicFlowData
      });
    });
    test("Error scenario ",async()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: []
          })
        })
      );
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      const counter = 1;
      const listDynamicFlow = await retrieveDynamicFlowData("1234-5678","TEST", counter, undefined, jest.fn(), jsonDynamicFlowData);
      expect(listDynamicFlow).toEqual({
        counter,
        errors: true,
        flowData: jsonDynamicFlowData
      });

    });
  });

  describe("Delete Dynamic Flow", ()=>{
    beforeEach(()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              listPhoneNumbers: {
                items: jsonFlowData
              }
            }
          })
        })
      );
    });
    afterEach(()=>{
      jest.restoreAllMocks();
    });
    test("Testing the Delete Dynamic Flow",async()=>{
      const item = {
        pkey: 1
      };
      const delDynamicFlow = await deleteDynamicFlowRule(item,"1233-3245","http://localhost:3000");
      expect(delDynamicFlow).toBeDefined;
    });
    test("Testing the Delete DynamicFlowRule error",async()=>{
      const item = {
      };
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      const delDynamicFlow = await deleteDynamicFlowRule(item,"1233-3245","http://localhost:3000");
      expect(delDynamicFlow).toBeDefined;
    });
  });

  describe("Update Dynamic Flow", ()=>{
    beforeEach(()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              listPhoneNumbers: {
                items: jsonFlowData
              }
            }
          })
        })
      );
    });
    afterEach(()=>{
      jest.restoreAllMocks();
    });
    test("Testing the Update Dynamic Flow",async()=>{
      const item = {
        pkey: 1,
        employeeId: "n123453"
      };
      const updateDynamicFlow = await updateDynamicFlowDB(item,"1233-3245","http://localhost:3000");
      expect(updateDynamicFlow).toBeTruthy();
    });
    test("Testing the Update DynamicFlowRule error",async()=>{
      const dynamicItem = {
        pkey: 1
      };
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      const updateDynamicFlow = await updateDynamicFlowDB(dynamicItem,"1233-3245","http://localhost:3000");
      expect(updateDynamicFlow).toBeUndefined();
    });
  });

  describe("Batch Delete Dyanmic Flow", ()=>{
    beforeEach(()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(batchDeleteResponse)
        })
      );
    });
    afterEach(()=>{
      jest.restoreAllMocks();
    });
    test("Success",async()=>{
      const batchDeleteDyamicItemsList = ["pkey1","pkey1","pkey3"];
      const response = await flowDynamicBatchDelete(batchDeleteDyamicItemsList,"1233-3245","http://localhost:3000");
      expect(response).toBe(batchDeleteResponse);
      expect(window.fetch).toBeCalledWith("http://localhost:3000", {
        "body": "{\"query\":\"\\n      mutation batchDeletePhoneNumber(input: PhoneNumberDeleteBatchInput!) {\\n        batchDeletePhoneNumber(input: $input) {\\n          items {\\n              phoneNumber\\n              callFlowName\\n          }\\n        }\\n      }\\n    \",\"variables\":{\"input\":{\"batchDeletePhoneNumberInput\":[{},{},{}]}}}",
        "headers": {
          "Authorization": "1233-3245",
          "Content-Type": "application/json"
        },
        "method": "POST"
      });
    });
    test("batch Dynamic Delete",async()=>{
      const batchDeleteDyamicItemsList = ["pkey1","pkey1","pkey3"];
      await flowDynamicBatchDelete(batchDeleteDyamicItemsList,"1233-3245","http://localhost:3000");
      const response=batchDynamicDeleteItems(batchDeleteDyamicItemsList,"3245","http://localhost:3000");
      act(()=>{
        expect(response).toBeTruthy();
      });
    });
    test("Dynamic Error",async()=>{
      const batchDeleteDyamicItemsList = ["pkey1","pkey1","pkey3"];
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      const response = await flowDynamicBatchDelete(batchDeleteDyamicItemsList,"1233-3245","http://localhost:3000");
      expect(response).toEqual(undefined);
    });
    test("Batch Delete Dynamic Error",async()=>{
      const batchDeleteDyamicItemsList = ["pkey1","pkey1","pkey3"];
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      await flowDynamicBatchDelete(batchDeleteItemsList,"1233-3245","http://localhost:3000");
      const response = await batchDynamicDeleteItems(batchDeleteDyamicItemsList,"3245","http://localhost:3000");
      expect(response).toBeTruthy();
    });
  });

  describe("Batch Update Dynamic Flow", ()=>{
    const batchUpdateResponse = {
      failure: [],
      flag: false,
      success: []
    };
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(new Date(curTime));
    });
    beforeEach(()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(batchUpdateResponse)
        })
      );
    });
    afterEach(()=>{
      jest.restoreAllMocks();
      jest.useRealTimers();
    });
    test("Success",async()=>{
      const batchUpdateResponse = {
        alertMsg: "",
        errors: [],
        failure: [],
        flag: false,
        success: [jsonFlowData]
      };
      const response = await batchDynamicFlowUpdate([{ ...jsonFlowData }],"1233-3245","http://localhost:3000");
      expect(response).toEqual(batchUpdateResponse);
      expect(window.fetch).toBeCalledWith("http://localhost:3000", {
        "body": "{\"query\":\"\\n        mutation batchCreatePhoneNumber($input: PhoneNumberCreateBatchInput!) {\\n          batchCreatePhoneNumber(input: $input) {\\n            items {\\n                phoneNumber\\n                callFlowName\\n                createTime\\n                updateTime\\n                nextActionType\\n                nextActionId\\n                callFlowTemplate\\n                dialedDescription\\n                phoneNumberType\\n                tfnRoutingGroup\\n                brand\\n                dataRequests\\n                greetingMessages\\n                languageOffer\\n                transferDestination\\n                callerType\\n                callFlowRoute\\n                callIntent\\n                callFlowType\\n                channel\\n                predictiveCaller\\n                employeeId\\n                callTypeDescription\\n                internetPlacement\\n                lineOfBusiness\\n                marketingChannel\\n                rangeIndicator\\n                requestID\\n                tollFreeNumber\\n                transferCode\\n                whisper\\n                officeNumbers\\n            }\\n          }\\n        }\\n      \",\"variables\":{\"input\":{\"batchPhoneNumberInput\":[{\"brand\":{\"value\":\"LM\"},\"channel\":{\"value\":\"Test1 Channel\"},\"createTime\":{\"value\":\"2022-24-08\"},\"dialedDescription\":{\"value\":\"test\"},\"employeeId\":{\"value\":\"n1234567\"},\"updateTime\":" + curTimeUnixEpoch + "}]}}}",
        "headers": {
          "Authorization": "1233-3245",
          "Content-Type": "application/json"
        },
        "method": "POST"
      });
    });
    test("Dynamic Error",async()=>{
      const batchUpdateResponse = {
        alertMsg: "Errors occurred processing flow records",
        errors: [{
          message: Error("oops")
        }],
        failure: [jsonDynamicFlowData],
        flag: true,
        success: []
      };
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error("oops");
      });
      const response = await batchDynamicFlowUpdate([{ ...jsonDynamicFlowData }],"1233-3245","http://localhost:3000");
      expect(response).toEqual(batchUpdateResponse);
    });
    test("Call with an Empty List", async()=>{
      const response = await batchDynamicFlowUpdate([],"1233-3245","http://localhost:3000");
      const errorResponse = {
        errors: [
          "Please Select Something to Edit"
        ],
        flag: true,
        success: [],
        failure: []
      };
      expect(response).toEqual(errorResponse);
    });
  });

  describe("Batch Create Dynamic Flow", ()=>{
    const batchDynamicCreateResponse = {
      failure: [],
      flag: false,
      success: [],
      alertMsg: ""
    };
    beforeEach(()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(batchDynamicCreateResponse)
        })
      );
    });
    afterEach(()=>{
      jest.restoreAllMocks();
    });
    test("Success",async()=>{
      const batchCreateResponse = {
        "alertMsg": "",
        "errors": [],
        "failure": [],
        "flag": false,
        "success": [jsonDynamicFlowData]
      };
      //TODO shouldn't the graphql mutation by createPhoneNumber
      const response = await batchDynamicFlowCreate([{ ...jsonDynamicFlowData }],"1233-3245","http://localhost:3000");
      expect(response).toEqual(batchCreateResponse);
      expect(window.fetch).toBeCalledWith("http://localhost:3000", {
        "body": "{\"query\":\"\\n        mutation createCallFlowConfig($input: CallFlowConfigInput! ) {\\n          createCallFlowConfig(input: $input) {\\n              callFlowName\\n            }\\n          }\\n      \",\"variables\":{\"input\":{\"announcements\":[],\"menus\":[],\"menuOptions\":[]}}}",
        "headers": {
          "Authorization": "1233-3245",
          "Content-Type": "application/json"
        },
        "method": "POST"
      });
    });
    test("empty records insertion",async()=>{
      const response = await batchDynamicFlowCreate([],"1233-3245","http://localhost:3000");
      expect(response.alertMsg).toEqual("Please select something to add");
    });
  });
});