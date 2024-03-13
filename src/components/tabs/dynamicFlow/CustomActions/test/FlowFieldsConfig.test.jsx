import { flowFields } from "../FlowFieldsConfig";


const validFlowData = {
  actionId: "LSC1GREETING",
  actionType: "ANNOUNCEMENT",
  allowBargeIn: false,
  callFlowName: "LSC",
  finishOnKey: "#",
  maxDigits: "3",
  minDigits: "1",
  nextActionId: "LSC1MENU",
  nextActionType: "MENU",
  options: [{
    callerContextAttributes: {
      reasonForReturning: "transfer"
    },
    digit: "1",
    nextActionType: "TRANSFER"
  }, {
    digit: "other",
    nextActionId: "LSC1INVALID",
    nextActionType: "ANNOUNCEMENT"
  }],
  repeat: {
    callerContextAttributes: {
      "reasonForReturning": "hangup"
    }
  },
  speech: "Hello there!",
  timeout: "23"
};

describe("FlowFieldsConfig", ()=>{
  describe("valueSetter", ()=>{
    it("actionId", ()=>{
      const updatedFlowData = flowFields[0].valueSetter(validFlowData, { actionId: "1" });
      expect(updatedFlowData.actionId).toBe("1");
    });
    it("actionType", ()=>{
      const updatedFlowData = flowFields[1].valueSetter(validFlowData, { actionType: "2" });
      expect(updatedFlowData.actionType).toBe("2");
    });
    it("allowBargeIn", ()=>{
      const updatedFlowData = flowFields[2].valueSetter(validFlowData, { allowBargeIn: true });
      expect(updatedFlowData.allowBargeIn).toBe(true);
    });
    it("callFlowName", ()=>{
      const updatedFlowData = flowFields[3].valueSetter(validFlowData, { callFlowName: "3" });
      expect(updatedFlowData.callFlowName).toBe("3");
    });
    it("finishOnKey", ()=>{
      const updatedFlowData = flowFields[4].valueSetter(validFlowData, { finishOnKey: "#" });
      expect(updatedFlowData.finishOnKey).toBe("#");
    });
    it("maxDigits", ()=>{
      const updatedFlowData = flowFields[5].valueSetter(validFlowData, { maxDigits: "4" });
      expect(updatedFlowData.maxDigits).toBe("4");
    });
    it("minDigits", ()=>{
      const updatedFlowData = flowFields[5].valueSetter(validFlowData, { minDigits: "4" });
      expect(updatedFlowData.minDigits).toBe("4");
    });
    it("nextActionId", ()=>{
      const updatedFlowData = flowFields[8].valueSetter(validFlowData, { nextActionId: "5" });
      expect(updatedFlowData.nextActionId).toBe("5");
    });
    it("nextActionType", ()=>{
      const updatedFlowData = flowFields[8].valueSetter(validFlowData, { nextActionType: "6" });
      expect(updatedFlowData.nextActionType).toBe("6");
    });
    it("options", ()=>{
      const updatedFlowData = flowFields[8].valueSetter(validFlowData, { options: "7" });
      expect(updatedFlowData.options).toBe("7");
    });
    it("speech", ()=>{
      const updatedFlowData = flowFields[8].valueSetter(validFlowData, { speech: "8" });
      expect(updatedFlowData.speech).toBe("8");
    });
    it("repeat", ()=>{
      const updatedFlowData = flowFields[8].valueSetter(validFlowData, { repeat: "9" });
      expect(updatedFlowData.repeat).toBe("9");
    });
    it("timeout", ()=>{
      const updatedFlowData = flowFields[8].valueSetter(validFlowData, { timeout: "10" });
      expect(updatedFlowData.timeout).toBe("10");
    });
  });
  describe("valueGetter", ()=>{
    it("actionId", ()=>{
      const validData = flowFields[0].valueGetter(validFlowData);
      const invalidData = flowFields[0].valueGetter({});
      expect(validData).toEqual(validFlowData.actionId);
      expect(invalidData).toEqual("");
    });
    it("actionType", ()=>{
      const validData = flowFields[1].valueGetter(validFlowData);
      const invalidData = flowFields[1].valueGetter({});
      expect(validData).toEqual(validFlowData.actionType);
      expect(invalidData).toEqual("");
    });
    it.skip("allowBargeIn", ()=>{
      const validData = flowFields[2].valueGetter(validFlowData);
      const invalidData = flowFields[2].valueGetter({});
      expect(validData).toEqual(validFlowData.allowBargeIn);
      expect(invalidData).toEqual("");
    });
    it("callFlowName", ()=>{
      const validData = flowFields[3].valueGetter(validFlowData);
      const invalidData = flowFields[3].valueGetter({});
      expect(validData).toEqual(validFlowData.callFlowName);
      expect(invalidData).toEqual("");
    });
    it("finishOnKey", ()=>{
      const validData = flowFields[4].valueGetter(validFlowData);
      const invalidData = flowFields[4].valueGetter({});
      expect(validData).toEqual(validFlowData.finishOnKey);
      expect(invalidData).toEqual("");
    });
    it("maxDigits", ()=>{
      const validData = flowFields[5].valueGetter(validFlowData);
      const invalidData = flowFields[5].valueGetter({});
      expect(validData).toEqual(validFlowData.maxDigits);
      expect(invalidData).toEqual("");
    });
    it("minDigits", ()=>{
      const validData = flowFields[6].valueGetter(validFlowData);
      const invalidData = flowFields[6].valueGetter({});
      expect(validData).toEqual(validFlowData.minDigits);
      expect(invalidData).toEqual("");
    });
  });
});
