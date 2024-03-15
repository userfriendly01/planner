import { act } from "@testing-library/react";
import  {
  retrieveFlowData,addFlowRule, deleteFlowRule, updateFlowDB, flowBatchDelete, queryFlowData, batchDeleteItems, batchFlowUpdate, batchFlowCreate, batchDynamicFlowCreate
}  from "../flowTableService";

const jsonFlowData = {
  pkey: { value: "12345" },
  agentId: { value: "123455" },
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
    test("CallFlow list finds 1",async()=>{
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
      const listFlow = await retrieveFlowData("12345","",{});
      expect(listFlow).toEqual(jsonFlowData);
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
      const listFlow = await retrieveFlowData("12345","",{});
      expect(listFlow).toEqual(jsonFlowData);
    });
    test("CallFlow list finds error",async()=>{
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
      const listFlow = await queryFlowData("12345","TEST","http://localhost:8082");
      expect(listFlow).toBeDefined;
    });
    test("CallFlow list not found",async()=>{
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
      const listFlow = await retrieveFlowData("1234-5678","TEST",jsonFlowData);
      expect(listFlow).toEqual([]);
    });
    test("pass null in list",async()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: []
          })
        })
      );
      const listFlow = await retrieveFlowData("1234-5678","TEST",jsonFlowData);
      expect(listFlow).toEqual([]);
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
      const listFlow = await retrieveFlowData("1234-5678","TEST",jsonFlowData);
      expect(listFlow).toEqual([]);

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
        failure: [],
        flag: false,
        success: []
      };
      const response = await batchFlowUpdate([{ ...jsonFlowData }],"1233-3245","http://localhost:3000");
      expect(response).toEqual(batchUpdateResponse);
      expect(window.fetch).toBeCalledWith("http://localhost:3000", {
        "body": "{\"query\":\"\\n        mutation batchUpdateCctSharedCallFlowDb($input: CctSharedCallFlowDbBatchUpdateInput!) {\\n          batchUpdateCctSharedCallFlowDb(input: $input) {\\n            items {\\n              accountManager\\n              affinityVDN\\n              agentId\\n              brand\\n              callDetails1\\n              callDetails2\\n              callFlowTemplate\\n              callTypeDescription\\n              channel\\n              content {\\n                callFlowRoute\\n                callIntent\\n                callerType\\n                dataRequests\\n                greetingMessages\\n                languageOffer\\n                transferNumber\\n              }\\n              createTime\\n              dialedDescription\\n              employeeId\\n              internetPlacement\\n              lineOfBusiness\\n              marketingChannel\\n              pkey\\n              predictiveCaller\\n              rangeIndicator\\n              requestID\\n              selfServiceIndicator\\n              tollFreeNumber\\n              tfnRoutingGroup\\n              transferCode\\n              type\\n              userDestination\\n              whisper\\n            }\\n          }\\n        }\\n      \",\"variables\":{\"input\":{\"batchFlowUpdateInput\":[{\"pkey\":{\"value\":\"12345\"},\"agentId\":{\"value\":\"123455\"},\"brand\":{\"value\":\"LM\"},\"callFlowTemplate\":{\"value\":\"temp\"},\"channel\":{\"value\":\"Test1 Channel\"},\"content\":{\"callIntent\":\"\",\"callFlowRoute\":\"\",\"callerType\":\"\",\"greetingMessages\":\"\",\"transferNumber\":\"\",\"languageOffer\":\"\"},\"createTime\":{\"value\":\"2022-24-08\"},\"updateTime\":\"2024-01-30T05:00:00.000Z\",\"dialedDescription\":{\"value\":\"test\"},\"accountManager\":\"\",\"affinityVDN\":\"\",\"callTypeDescription\":\"\",\"transferCode\":\"\",\"internetPlacement\":\"\",\"callDetails1\":\"\",\"callDetails2\":\"\",\"tollFreeNumber\":\"\",\"lineOfBusiness\":\"\",\"marketingChannel\":\"\",\"predictiveCaller\":false,\"selfServiceIndicator\":false,\"whisper\":\"\",\"requestID\":\"\",\"userDestination\":{\"value\":\"dest\"},\"rangeIndicator\":\"\",\"tfnRoutingGroup\":\"\",\"type\":\"\"}]}}}",
        "headers": {
          "Authorization": "1233-3245",
          "Content-Type": "application/json"
        },
        "method": "POST"
      });
    });
    test("Error",async()=>{
      const batchUpdateResponse = {
        failure: [{ ...jsonFlowData }],
        flag: true,
        success: []
      };
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      const response = await batchFlowUpdate([{ ...jsonFlowData }],"1233-3245","http://localhost:3000");
      expect(response).toEqual(batchUpdateResponse);
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
      failure: [],
      flag: false,
      success: [],
      alertMsg: ""
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
        failure: [],
        flag: false,
        success: [],
        alertMsg: ""
      };
      const response = await batchFlowCreate([{ ...jsonFlowData }],"1233-3245","http://localhost:3000");
      expect(response).toEqual(batchCreateResponse);
      expect(window.fetch).toBeCalledWith("http://localhost:3000", {
        "body": "{\"query\":\"\\n        mutation batchCreateCctSharedCallFlowDb($input: CctSharedCallFlowDbBatchCreateInput!) {\\n          batchCreateCctSharedCallFlowDb(input: $input) {\\n            items {\\n              accountManager\\n              affinityVDN\\n              agentId\\n              brand\\n              callDetails1\\n              callDetails2\\n              callFlowTemplate\\n              callTypeDescription\\n              channel\\n              content {\\n                callFlowRoute\\n                callIntent\\n                callerType\\n                dataRequests\\n                greetingMessages\\n                languageOffer\\n                transferNumber\\n              }\\n              createTime\\n              dialedDescription\\n              employeeId\\n              internetPlacement\\n              lineOfBusiness\\n              marketingChannel\\n              pkey\\n              predictiveCaller\\n              rangeIndicator\\n              requestID\\n              selfServiceIndicator\\n              tollFreeNumber\\n              transferCode\\n              type\\n              userDestination\\n              whisper\\n            }\\n          }\\n        }\\n      \",\"variables\":{\"input\":{\"batchFlowCreateInput\":[{\"pkey\":{\"value\":\"12345\"},\"agentId\":{\"value\":\"123455\"},\"brand\":{\"value\":\"LM\"},\"callFlowTemplate\":{\"value\":\"temp\"},\"channel\":{\"value\":\"Test1 Channel\"},\"content\":{\"callIntent\":\"\",\"callFlowRoute\":\"\",\"callerType\":\"\",\"greetingMessages\":\"\",\"transferNumber\":\"\",\"languageOffer\":\"\"},\"createTime\":{\"value\":\"2022-24-08\"},\"dialedDescription\":{\"value\":\"test\"},\"accountManager\":\"\",\"affinityVDN\":\"\",\"callTypeDescription\":\"\",\"transferCode\":\"\",\"internetPlacement\":\"\",\"callDetails1\":\"\",\"callDetails2\":\"\",\"tollFreeNumber\":\"\",\"lineOfBusiness\":\"\",\"marketingChannel\":\"\",\"whisper\":\"\",\"requestID\":\"\",\"userDestination\":{\"value\":\"dest\"},\"rangeIndicator\":\"\",\"type\":\"\",\"predictiveCaller\":false,\"selfServiceIndicator\":false}]}}}",
        "headers": {
          "Authorization": "1233-3245",
          "Content-Type": "application/json"
        },
        "method": "POST"
      });
    });
    test("empty records insertion",async()=>{
      const response = await batchFlowCreate([],"1233-3245","http://localhost:3000");
      expect(response.alertMsg).toEqual("Please Select Something to Add");
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
      const batchDynamicCreateResponse = {
        failure: [],
        flag: false,
        success: [],
        alertMsg: ""
      };
      const response = await batchDynamicFlowCreate([{ ...jsonFlowData }],"1233-3245","http://localhost:3000");
      expect(response).toEqual(batchDynamicCreateResponse);
      expect(window.fetch).toBeCalledWith("http://localhost:3000", {
         "body": "{\"query\":\"\n        mutation createCallFlowConfig($input: CallFlowConfigInput! ) {\n          createCallFlowConfig(input: $input) {\n              callFlowName\n            }\n          }\n      \",\"variables\":{\"input\":{\"callFlowName\":\"LSC\",\"announcements\":[{\"nextActionId\":\"LSC1MENU\",\"actionId\":\"LSC1INVALID\",\"actionType\":\"ANNOUNCEMENT\",\"callFlowName\":\"LSC\",\"createTime\":1710520287652,\"nextActionType\":\"MENU\",\"speech\":\"Invalid choice\",\"updateTime\":1710520287652}],\"menus\":[{\"allowBargeIn\":\"TRUE\",\"actionId\":\"LSC1MENU\",\"actionType\":\"MENU\",\"callFlowName\":\"LSC\",\"createTime\":1710520287652,\"maxDigits\":\"1\",\"minDigits\":\"1\",\"nextActionId\":\"LSC1MENUOPTIONS\",\"nextActionType\":\"MENUOPTIONS\",\"repeat\":{\"callerContextAttributes\":\"{\"reasonForReturning\":\"hangup\"}\",\"loop\":3,\"nextActionId\":\"LSC1MENUOPTIONS\",\"nextActionType\":\"MENUOPTIONS\"},\"speech\":\"Press 1 to speak to representative\",\"timeout\":\"10\",\"updateTime\":1710520287652}],\"menuOptions\":[{\"actionId\":\"LSC1MENUOPTIONS\",\"actionType\":\"MENUOPTIONS\",\"callFlowName\":\"LSC\",\"createTime\":1710520287652,\"updateTime\":1710520287652,\"options\":[{\"callerContextAttributes\":\"{\"reasonForReturning\":\"transfer\"}\",\"digit\":\"1\",\"nextActionType\":\"TRANSFER\"},{\"digit\":\"other\",\"nextActionId\":\"LSC1INVALID\",\"nextActionType\":\"ANNOUNCEMENT\"}]}]}}}",

      "headers": {
          "Authorization": "1233-3245",
          "Content-Type": "application/json"
        },
        "method": "POST"
      });
    });
    test("empty records insertion",async()=>{
      const response = await batchDynamicFlowCreate([],"1233-3245","http://localhost:3000");
      expect(response.alertMsg).toEqual("Please Select Something to Add");
    });
  });
});
