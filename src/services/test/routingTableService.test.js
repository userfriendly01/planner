import {
  addRoutingRule,
  batchDelete,
  deleteRoutingRule,
  retrieveRoutingData,
  updateRoutingDB
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
    crcSkill: "updated"
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
    crcSkill: "updated"
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
      const response = await retrieveRoutingData("1234-5678","TEST");
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
    "skey": "skey1"
  },{
    pkey: "pkey2",
    "skey": "skey2"
  }];
  const batchDeleteResponse = {
    data: {
      listCctSharedCallRoutingGlobalDbs: {
        items: batchDeleteItems,
        nextToken: undefined
      }
    }
  };

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
    });
    test("Error",async()=>{
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      const response = await batchDelete(batchDeleteItems,"1233-3245","http://localhost:3000");
      expect(response).toEqual(undefined);
    });
  });
});