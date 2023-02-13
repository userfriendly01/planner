import { retrieveRoutingData } from "../routingTableService";
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
describe("",()=>{
  describe("ListRouting", ()=>{
    afterEach(()=>{
      jest.restoreAllMocks();
    });
    test("CallRouting List",async()=>{
      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              listCctSharedCallRoutingGlobalDbs: {
                items: jsonRouteData
              }
            }
          })
        })
      );
      const listRoute = await retrieveRoutingData("1234-5678","TEST");
      expect(listRoute).toBeCalled;
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
      const listRoute = await retrieveRoutingData("1234-5678","TEST");
      expect(listRoute).toBeCalled;
    });
  });
});