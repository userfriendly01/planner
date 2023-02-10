import  {
  retrieveFlowData,addFlowRule, deleteFlowRule
}  from "../flowTableService";


const jsonFlowData = {
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
      fetch.mockClear();
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
    afterEach(()=>{
      fetch.mockClear();
    });
    test("CallFlow list",async()=>{
      const jsonFlowData = [
        {
          id: 1,
          pkey: "12345",
          agentId: "123455",
          brand: "LM",
          callFlowTemplate: "temp",
          channel: "Test1 Channel",
          createTime: "2022-24-08",
          dialedDescription: "test",
          employeeId: "n1234567",
          userDestination: "dest",
          skey: "1234_brand_brr"
        }
        ,{
          id: 2,
          pkey: "12345",
          agentId: "123455",
          brand: "LM",
          callFlowTemplate: "temp",
          channel: "Test1 Channel",
          createTime: "2022-24-08",
          dialedDescription: "test",
          employeeId: "n1234567",
          userDestination: "dest",
          skey: 12345
        }
      ];
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
      const listFlow = await retrieveFlowData("1234-5678","TEST");
      expect(listFlow).toBeCalled;
    });
    test("pass null in list",async()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: []
          })
        })
      );
      const listFlow = await retrieveFlowData("1234-5678","TEST");
      expect(listFlow).toBeCalled;
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
      const listFlow = await retrieveFlowData("1234-5678","TEST");
      expect(listFlow).toBeCalled;

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
        pkey: 1
      };
      jest.spyOn(JSON, "stringify").mockImplementation(()=>{
        throw new Error();
      });
      const delFlow = await deleteFlowRule(item,"1233-3245","http://localhost:3000");
      expect(delFlow).toBeDefined;
    });
  });
});