import {
  checkGreetingMessageRegExp , getAdvanceFilter
} from "../alohaFlowUtils";

describe("alohaFlowUtils.ts", ()=>{
  describe("checkGreetingMessageRegExp",()=>{
    describe("English",()=>{
      it("Valid", ()=>{
        const value = "Thank you for calling your LM Insurance Agency.  This call may be monitored or recorded.";
        expect(checkGreetingMessageRegExp(value)).toBeFalsy();
      });
      it("Invalid", ()=>{
        const value = "Thank you for calling your LM Insurance Agency.  This call may be monitored & recorded.";
        expect(checkGreetingMessageRegExp(value)).toBeTruthy();
      });
    });
    describe("Spanish", ()=>{
      it("Valid", ()=>{
        const value = "Thank you for calling Liberty Mutual Insurance. <lang xml:lang=\"es-US\"><phoneme alphabet=\"x-sampa\" ph='pA.t@ Esp.A.\"njol'>para español</phoneme>, oprima nueve</lang>. This call may be monitored or recorded.";
        expect(checkGreetingMessageRegExp(value)).toBeFalsy();
      });
      it("Invalid", ()=>{
        const value = "Thank you for calling Liberty Mutual Insurance. <lang xml:lang=\"es-US\"><phoneme alphabet=\"x-sampa\" ph='pA.t@± Esp.A.\"njol'>para español</phoneme>, oprima nueve</lang>. This call may be monitored or recorded.";
        expect(checkGreetingMessageRegExp(value)).toBeTruthy();
      });
    });

  });
  describe("getAdvanceFilter", ()=>{
    beforeEach(()=>{
      const storageValue = JSON.stringify({
        brand: ["Liberty Mutual", "Safeco"],
        channel: ["Sales", "Claims"],
        callerState: "",
        priority: null
      });
      localStorage.setItem("TEST_STORAGE_FLOW_UTILS",storageValue);
    });
    it("Success", ()=>{
      const storageValue = getAdvanceFilter("TEST_STORAGE_FLOW_UTILS");
      expect(storageValue["brand"].length).toBe(2);
    });
    it("Invalid key Name", ()=>{
      const storageValue = getAdvanceFilter("UNKNOWN");
      expect(storageValue).toEqual({});
    });
    it("Exception while json parse", ()=>{
      jest.spyOn(JSON, "parse").mockImplementation(()=>{
        throw new Error();
      });
      const storageValue = getAdvanceFilter("TEST_STORAGE_FLOW_UTILS");
      expect(storageValue).toEqual({});
    });
  });

});