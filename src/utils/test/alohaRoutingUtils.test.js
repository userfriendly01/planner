import { getAdvanceFilter } from "utils/alohaRoutingUtils";

describe("alohaRoutingUtils.ts", ()=> {
  describe("getAdvanceFilter", () => {
    beforeEach(() => {
      const storageValue = JSON.stringify({
        brand: ["Liberty Mutual", "Safeco"],
        channel: ["Sales", "Claims"],
        callerState: "",
        priority: null
      });
      localStorage.setItem("TEST_STORAGE_FLOW_UTILS", storageValue);
    });
    it("Success", () => {
      const storageValue = getAdvanceFilter("TEST_STORAGE_FLOW_UTILS");
      expect(storageValue["brand"].length).toBe(2);
    });
    it("Invalid key Name", () => {
      const storageValue = getAdvanceFilter("UNKNOWN");
      expect(storageValue).toEqual({});
    });
    it("Exception while json parse", () => {
      jest.spyOn(JSON, "parse").mockImplementation(() => {
        throw new Error();
      });
      const storageValue = getAdvanceFilter("TEST_STORAGE_FLOW_UTILS");
      expect(storageValue).toEqual({});
    });
  });
});