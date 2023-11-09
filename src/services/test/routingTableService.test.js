import {
  addRoutingRule,
  batchDelete,
  deleteRoutingRule,
  retrieveRoutingData,
  updateRoutingDB,
  batchRoutingUpdate,
  batchRoutingCreate,
  queryRoutingData,
  routingBatchDelete,
  routingBatchCreate,
  routingBatchUpdate
} from "../routingTableService";
const jsonRouteData =[
  {
    id: 1,
    all: "test",
    brand: "Liberty",
    callIntent: "test",
    callerState: "test",
    callerType: "test",
    channel: "test",
    dayOfWeek: "Monday",
    endTime: "2022-02-20",
    percentOfCallers: "100",
    pkey: "+12353245",
    policyType: "Liberty",
    skey: "liberty_test_test",
    startTime: "2022-02-20",
    transferDestination: "Twilo",
    transferMessage: "HOLD ON while we transfer the call",
    twilioSkill: "test",
    crcSkill: "updated",
    tfnRoutingGroup: "test"
  },
  {
    id: 1,
    all: "test",
    brand: "Liberty",
    callIntent: "test",
    callerState: "test",
    callerType: "test",
    channel: "test",
    dayOfWeek: "Monday",
    endTime: "2022-02-20",
    percentOfCallers: "100",
    pkey: "+12353245",
    policyType: "Liberty",
    skey: 1234,
    startTime: "2022-02-20",
    transferDestination: "Twilo",
    transferMessage: "HOLD ON while we transfer the call",
    twilioSkill: "test",
    crcSkill: "updated",
    tfnRoutingGroup: "test"
  }
];
describe("routingTableService",()=>{
  describe("ListRouting", ()=>{
    afterEach(()=>{
      jest.restoreAllMocks();
    });
    test("Success",async()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              listCctSharedCallRoutingGlobalDbs: {
                items: jsonRouteData,
                nextToken: undefined
              }
            }
          })
        })
      );
      const response = await retrieveRoutingData("1234-5678","test",{});
      expect(response).toBeTruthy();
    });
    test("Error",async()=>{
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
      const response = await retrieveRoutingData("1234-5678","TEST");
      expect(response).toBeTruthy();
    });
    test("CallRouting list finds error",async()=>{
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
      const listRouting = await queryRoutingData("12345","TEST","http://localhost:8082");
      expect(listRouting).toBeDefined();
    });
  });
  describe("Update Routing", ()=>{
    beforeEach(()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              listCctSharedCallRoutingGlobalDbs: {
                items: jsonRouteData,
                nextToken: undefined
              }
            }
          })
        })
      );
    });
    afterEach(()=>{
      jest.restoreAllMocks();
    });
    test("Success",async()=>{
      const item = {
        ...jsonRouteData[0]
      };
      const response = await updateRoutingDB(item,"1233-3245","http://localhost:3000");
      expect(response).toBeDefined;
    });
    test("Error",async()=>{
      const item = {
        ...jsonRouteData[0]
      };
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      const response = await updateRoutingDB(item,"1233-3245","http://localhost:3000");
      expect(response).toBeDefined;
    });
  });
  describe("Add Routing", ()=>{
    beforeEach(()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              listCctSharedCallRoutingGlobalDbs: {
                items: jsonRouteData,
                nextToken: undefined
              }
            }
          })
        })
      );
    });
    afterEach(()=>{
      jest.restoreAllMocks();
    });
    test("Success",async()=>{
      const item = {
        ...jsonRouteData[0]
      };
      const response = await addRoutingRule(item,"1233-3245","http://localhost:3000");
      expect(response).toBeDefined;
    });
    test("Error",async()=>{
      const item = {
        ...jsonRouteData[0]
      };
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      const response = await addRoutingRule(item,"1233-3245","http://localhost:3000");
      expect(response).toBeDefined;
    });
  });
  describe("Delete Routing", ()=>{
    beforeEach(()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              listCctSharedCallRoutingGlobalDbs: {
                items: jsonRouteData,
                nextToken: undefined
              }
            }
          })
        })
      );
    });
    afterEach(()=>{
      jest.restoreAllMocks();
    });
    test("Success",async()=>{
      const item = {
        ...jsonRouteData[0]
      };
      const response = await deleteRoutingRule(item,"1233-3245","http://localhost:3000");
      expect(response).toBeDefined;
    });
    test("Error",async()=>{
      const item = {
        ...jsonRouteData[0]
      };
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      const response = await deleteRoutingRule(item,"1233-3245","http://localhost:3000");
      expect(response).toBeDefined;
    });
  });
  const batchDeleteItems = [ {
    pkey: "pkey1",
    "skey": "skey1",
    "id": 1
  },{
    pkey: "pkey2",
    "skey": "skey2",
    "id": 2
  }];
  const batchUpdateItems =[
    {
      pkey: "pkey1",
      skey: "skey1",
      brand: "Liberty",
      channel: "safeco",
      callIntent: "call",
      dayOfWeek: "Monday",
      callerState: "callerstate",
      callerType: "CT",
      percentOfCallers: "10",
      transferMessage: "message",
      policyType: "polcy",
      startTime: "2022-02-20",
      endTime: "2022-02-20"
    },
    {
      pkey: "pkey2",
      skey: "skey2",
      brand: "Liberty",
      channel: "safeco",
      callIntent: "call",
      dayOfWeek: "Monday",
      callerState: "callerstate",
      callerType: "CT",
      percentOfCallers: "10",
      transferMessage: "message",
      policyType: "policy",
      startTime: "2022-02-20",
      endTime: "2022-02-20"
    }
  ];
  const batchDeleteResponse = {
    data: {
      listCctSharedCallRoutingGlobalDbs: {
        items: batchDeleteItems,
        nextToken: undefined
      }
    }
  };

  const batchUpdateResponse = {
    data: {
      listCctSharedCallRoutingGlobalDbs: {
        items: batchUpdateItems,
        nextToken: undefined
      }
    }
  };

  const batchCreateResponse = {
    data: {
      listCctSharedCallRoutingGlobalDbs: {
        items: jsonRouteData,
        nextToken: undefined
      }
    }
  };

  describe("Batch Create Routing", ()=>{
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
      const response = await batchRoutingCreate(jsonRouteData,"1233-3245","http://localhost:3000");
      expect(response).toBe(batchCreateResponse);
    });
    test("routing batch Create ",async()=>{
      await batchRoutingCreate(jsonRouteData,"1233-3245","http://localhost:3000");
      const response=routingBatchCreate(jsonRouteData,"3245","http://localhost:3000");
      expect(response).toBeTruthy();
    });
    test("Error with null items list",async()=>{
      await batchRoutingCreate(jsonRouteData,"1233-3245","http://localhost:3000");
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      const response = await routingBatchCreate([],"1233-3245","http://localhost:3000");
      expect(response).toBeTruthy();
    });
  });
  describe("Batch Delete Routing", ()=>{
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
      const response = await batchDelete(batchDeleteItems,"1233-3245","http://localhost:3000");
      expect(response).toBe(batchDeleteResponse);
      expect(window.fetch).toBeCalledWith("http://localhost:3000", {
        "body": "{\"query\":\"\\n        mutation DeleteMany {\\n          batchDeleteCctSharedCallRoutingGlobalDb(input: {\\n              routingKey: [{pkey:\\\"pkey1\\\",skey:\\\"skey1\\\",\\\"id\\\":1},{pkey:\\\"pkey2\\\",skey:\\\"skey2\\\",\\\"id\\\":2}]\\n            }) {\\n            items {\\n              pkey\\n              skey\\n            }\\n          }\\n        }\\n    \",\"variables\":{}}",
        "headers": {
          "Authorization": "1233-3245",
          "Content-Type": "application/json"
        },
        "method": "POST"
      });
    });
    test("batch Delete",async()=>{
      await batchDelete(batchDeleteItems,"1233-3245","http://localhost:3000");
      const response=routingBatchDelete(batchDeleteItems,"3245","http://localhost:3000");
      expect(response).toBeTruthy();
    });
    test("Error",async()=>{
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      const response = await batchDelete(batchDeleteItems,"1233-3245","http://localhost:3000");
      expect(response).toEqual(undefined);
    });
  });
  describe("Batch Update Routing", ()=>{
    beforeEach(()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(batchUpdateResponse)
        })
      );
    });
    afterEach(()=>{
      jest.restoreAllMocks();
    });
    test("Success",async()=>{
      const response = await batchRoutingUpdate(batchUpdateItems,"1233-3245","http://localhost:3000");
      expect(response).toBe(batchUpdateResponse);
      expect(window.fetch).toBeCalledWith("http://localhost:3000", {
        "body": "{\"query\":\"\\n        mutation batchUpdateCctSharedCallRoutingDb($input: CctSharedCallRoutingDbBatchUpdateInput!) {\\n          batchUpdateCctSharedCallRoutingDb(input: $input) {\\n            items {\\n              all\\n              brand\\n              callIntent\\n              callerState\\n              callerType\\n              channel\\n              crcSkill\\n              dayOfWeek\\n              endTime\\n              occupancyCheck {\\n                percentage\\n                team\\n              }\\n              percentOfCallers\\n              pkey\\n              policyType\\n              priority\\n              routingSteps {\\n                callerState\\n                teams\\n                time\\n              }\\n              skey\\n              startTime\\n              transferDestination\\n              transferMessage\\n              twilioSkill\\n              tfnRoutingGroup\\n            }\\n            nextToken\\n          }\\n        }\\n      \",\"variables\":{\"input\":{\"batchRoutingUpdateInput\":[{\"all\":\"ALL\",\"pkey\":\"pkey1\",\"skey\":\"skey1\",\"brand\":\"Liberty\",\"channel\":\"safeco\",\"callIntent\":\"call\",\"dayOfWeek\":\"Monday\",\"callerState\":\"callerstate\",\"callerType\":\"CT\",\"twilioSkill\":\"\",\"transferDestination\":\"\",\"percentOfCallers\":\"10\",\"transferMessage\":\"message\",\"policyType\":\"polcy\",\"startTime\":\"2022-02-20\",\"endTime\":\"2022-02-20\",\"crcSkill\":\"\",\"priority\":\"\",\"occupancyCheck\":[],\"routingSteps\":[],\"tfnRoutingGroup\":\"\"},{\"all\":\"ALL\",\"pkey\":\"pkey2\",\"skey\":\"skey2\",\"brand\":\"Liberty\",\"channel\":\"safeco\",\"callIntent\":\"call\",\"dayOfWeek\":\"Monday\",\"callerState\":\"callerstate\",\"callerType\":\"CT\",\"twilioSkill\":\"\",\"transferDestination\":\"\",\"percentOfCallers\":\"10\",\"transferMessage\":\"message\",\"policyType\":\"policy\",\"startTime\":\"2022-02-20\",\"endTime\":\"2022-02-20\",\"crcSkill\":\"\",\"priority\":\"\",\"occupancyCheck\":[],\"routingSteps\":[],\"tfnRoutingGroup\":\"\"}]}}}",
        "headers": {
          "Authorization": "1233-3245",
          "Content-Type": "application/json"
        },
        "method": "POST"
      });
    });
    test("Error",async()=>{
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      const response = await batchRoutingUpdate(batchUpdateItems,"1233-3245","http://localhost:3000");
      expect(response).toEqual(undefined);
    });
    test("Error null Items",async()=>{
      const response = await routingBatchUpdate([],"1233-3245","http://localhost:3000");
      expect(response).toBeTruthy();
    });
    test("routing batch Create ",async()=>{
      await batchRoutingUpdate(batchUpdateItems,"1233-3245","http://localhost:3000");
      const response=(routingBatchUpdate,batchUpdateItems,"3245","http://localhost:3000");
      expect(response).toBeTruthy();
    });
  });
});