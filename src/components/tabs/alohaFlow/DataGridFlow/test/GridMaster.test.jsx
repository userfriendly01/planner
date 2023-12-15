import {
  clearGridMasterData,
  getGridMasterData
} from "../GridMaster";

let masterData;

describe("<GridMaster />", () => {
  it("stores brand and returns it", () => {
    masterData = getGridMasterData([{ brand: "safeco" }]);
    expect(masterData).toEqual({
      "brand": ["safeco"],
      "callFlowRoute": [],
      "callFlowTemplate": [],
      "callerType": [],
      "channel": [],
      "dataRequests": [],
      "pkey": []
    });
  });
  it("ignores foo and does not return it", () => {
    masterData = getGridMasterData([{ foo: "bar" }]);
    expect(masterData.foo).toEqual(undefined);
  });
  it("handles error and returns nothing", () => {
    const masterData2 = getGridMasterData("this is an unexpected data format");
    expect(masterData2).toEqual({});  //or empty object, if this test runs first, async
  });
  it("handles null and returns 'cleared' masterData", () => {
    const masterData2 = getGridMasterData([null]);
    expect(masterData2).toEqual({
      "brand": ["safeco"],
      "callFlowRoute": [],
      "callFlowTemplate": [],
      "callerType": [],
      "channel": [],
      "dataRequests": [],
      "pkey": []
    });
  });

  it("handles clearGridMasterData", () => {
    let masterData2 = getGridMasterData([{ brand: "safeco" }]);
    clearGridMasterData();
    masterData2 = getGridMasterData([{ channel: "sales" }]);
    expect(masterData2.brand).toEqual([]);
  });

});
