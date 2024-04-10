import {
  clearGridMasterData,
  getGridMasterData,
  getValueFromKeyPath
} from "../GridMaster";

let masterData;

describe("<GridMaster />", () => {
  describe("getValueFromKeyPath", () => {
    describe("null element", () => {
      it("should return null", () => {
        expect(getValueFromKeyPath(null, "hi")).toEqual(null);
      });
    });
    describe("masterDataItemsFromContent includes the key", () => {
      const content = {
        callerType: "customer",
        languageOffer: "Spanish"
      };
      it("should return masterDataItemsFromContent callerType customer", () => {
        expect(getValueFromKeyPath({
          content
        }, "callerType")).toEqual(content.callerType);
      });
      it("should return masterDataItemsFromContent undefined from invalid content", () => {
        const invalidContent = {
          key: "value"
        };
        expect(getValueFromKeyPath(invalidContent, "callerType")).toEqual(undefined);
      });
      it("should return languageOffer customer", () => {
        expect(getValueFromKeyPath({
          ...content
        }, "languageOffer")).toEqual(content.languageOffer);
      });
    });
  });
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
