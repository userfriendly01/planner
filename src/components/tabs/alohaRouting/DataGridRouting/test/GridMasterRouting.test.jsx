import {
  clearGridMasterData,
  getGridMasterData
} from "../GridMaster";
import { waitFor } from "testUtils";

const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key];
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    },
    removeItem: function(key) {
      delete store[key];
    }
  };
})();

describe("<GridMaster />", () => {
  beforeEach(()=>{
    Object.defineProperty(window, "localStorage", {
      writable: true,
      value: localStorageMock
    });
  });
  it("stores brand and returns it", () => {
    const masterData = getGridMasterData([{
      brand: "safeco",
      pkey: "TEST",
      skey: "TEST_SKEY"
    },{
      brand: "safeco",
      pkey: "TEST1",
      skey: "TEST1_SKEY"
    }]);
    expect(masterData).toEqual({
      "channel": [undefined],
      "callerType": [undefined],
      "callerState": [undefined],
      "transferDestination": [undefined],
      "twilioSkill": [undefined],
      "callIntent": [undefined],
      "policyType": [undefined],
      "brand": ["safeco"]
    });
  });
  it("ignores foo and does not return it", () => {
    const masterData = getGridMasterData([{ foo: "bar" }]);
    expect(masterData.foo).toEqual(undefined);
  });
  it("handles error and returns nothing", () => {
    const masterData2 = getGridMasterData("this is an unexpected data format");
    expect(masterData2).toEqual({});  //or empty object, if this test runs first, async
  });
  it("handles null and returns 'cleared' masterData", () => {
    const masterData2 = getGridMasterData([null]);
    expect(masterData2).toEqual({});
  });

  it("handles clearGridMasterData", () => {
    getGridMasterData([{ brand: "safeco" }]);
    clearGridMasterData();
    const masterData = getGridMasterData([{ channel: "sales" }]);
    expect(masterData.brand).toEqual([undefined]);
  });
  it("simulate error scenario", ()=>{
    jest.spyOn(JSON, "stringify").mockImplementation(()=>{
      throw new Error();
    });
    const masterData = getGridMasterData([{ brand: "safeco" }]);
    waitFor(()=>{
      expect(masterData).toEqual({});
    });
  });

});
