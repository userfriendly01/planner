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
    it("allowBargeIn default", ()=>{
      const updatedFlowData = flowFields[2].valueSetter(validFlowData, { });
      expect(updatedFlowData.allowBargeIn).toBe(validFlowData.allowBargeIn);
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
      const updatedFlowData = flowFields[7].valueSetter(validFlowData, { nextActionId: "5" });
      expect(updatedFlowData.nextActionId).toBe("5");
    });
    it("nextActionId default", ()=>{
      const updatedFlowData = flowFields[7].valueSetter(validFlowData, { });
      expect(updatedFlowData.nextActionId).toBe(validFlowData.nextActionId);
    });
    it("nextActionType", ()=>{
      const updatedFlowData = flowFields[8].valueSetter(validFlowData, { nextActionType: "6" });
      expect(updatedFlowData.nextActionType).toBe("6");
    });
    it("nextActionType default", ()=>{
      const updatedFlowData = flowFields[8].valueSetter(validFlowData, {  });
      expect(updatedFlowData.nextActionType).toBe(validFlowData.nextActionType);
    });
    it("options", ()=>{
      const updatedFlowData = flowFields[9].valueSetter(validFlowData, { options: "7" });
      expect(updatedFlowData.options).toBe("7");
    });
    it("options default", ()=>{
      const updatedFlowData = flowFields[9].valueSetter(validFlowData, { });
      expect(updatedFlowData.options).toBe(validFlowData.options);
    });
    it("repeat", ()=>{
      const updatedFlowData = flowFields[10].valueSetter(validFlowData, { repeat: "9" });
      expect(updatedFlowData.repeat).toBe("9");
    });
    it("repeat default", ()=>{
      const updatedFlowData = flowFields[10].valueSetter(validFlowData, { });
      expect(updatedFlowData.repeat).toBe(validFlowData.repeat);
    });
    it("speech", ()=>{
      const updatedFlowData = flowFields[11].valueSetter(validFlowData, { speech: "8" });
      expect(updatedFlowData.speech).toBe("8");
    });
    it("speech default", ()=>{
      const updatedFlowData = flowFields[11].valueSetter(validFlowData, { });
      expect(updatedFlowData.speech).toBe("Hello there!");
    });
    it("timeout", ()=>{
      const updatedFlowData = flowFields[12].valueSetter(validFlowData, { timeout: "10" });
      expect(updatedFlowData.timeout).toBe("10");
    });
    it("timeout default", ()=>{
      const updatedFlowData = flowFields[12].valueSetter(validFlowData, { });
      expect(updatedFlowData.timeout).toBe("23");
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
    it("allowBargeIn", ()=>{
      const validData = flowFields[2].valueGetter(validFlowData);
      const invalidData = flowFields[2].valueGetter({});
      expect(validData).toEqual(validFlowData.allowBargeIn);
      expect(invalidData).toEqual(false);
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
      expect(invalidData).toEqual(0);
    });
    it("minDigits", ()=>{
      const validData = flowFields[6].valueGetter(validFlowData);
      const invalidData = flowFields[6].valueGetter({});
      expect(validData).toEqual(validFlowData.minDigits);
      expect(invalidData).toEqual(0);
    });
    it("nextActionId", ()=>{
      const validData = flowFields[7].valueGetter(validFlowData);
      const invalidData = flowFields[7].valueGetter({});
      expect(validData).toEqual(validFlowData.nextActionId);
      expect(invalidData).toEqual("");
    });
    it("nextActionType", ()=>{
      const validData = flowFields[8].valueGetter(validFlowData);
      const invalidData = flowFields[8].valueGetter({});
      expect(validData).toEqual(validFlowData.nextActionType);
      expect(invalidData).toEqual("");
    });
    it("options", ()=>{
      const validData = flowFields[9].valueGetter(validFlowData);
      const invalidData = flowFields[9].valueGetter({});
      expect(validData).toEqual(validFlowData.options);
      expect(invalidData).toEqual([]);
    });
    it("repeat", ()=>{
      const validData = flowFields[10].valueGetter(validFlowData);
      const invalidData = flowFields[10].valueGetter({});
      expect(validData).toEqual(validFlowData.repeat);
      expect(invalidData).toEqual({});
    });
    it("speech", ()=>{
      const validData = flowFields[11].valueGetter(validFlowData);
      const invalidData = flowFields[11].valueGetter({});
      expect(validData).toEqual(validFlowData.speech);
      expect(invalidData).toEqual("");
    });
    it("timeout", ()=>{
      const validData = flowFields[12].valueGetter(validFlowData);
      const invalidData = flowFields[12].valueGetter({});
      expect(validData).toEqual(validFlowData.timeout);
      expect(invalidData).toEqual(0);
    });
  });
});
