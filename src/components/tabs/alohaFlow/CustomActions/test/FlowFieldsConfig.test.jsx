import { flowFields } from "../FlowFieldsConfig";


const validFlowData = {
  id: 1,
  pkey: "12345",
  agentId: "123455",
  brand: "LM",
  callFlowTemplate: "test callFlowTemplate",
  channel: "Test1 Channel",
  createTime: "2022-24-08",
  dialedDescription: "test dialedDescription",
  employeeId: "n1234567",
  userDestination: "test userDestination",
  content: {
    callerType: "test callerType",
    callFlowRoute: "test callFlowRoute",
    dataRequests: ["test1", "test2"],
    greetingMessages: "Hello Test Message",
    languageOffer: "English",
    transferNumber: "123456789"
  },
  accountManager: "test accountManager",
  affinityVDN: "test affinityVDN",
  callDetails2: "test callDetails2",
  internetPlacement: "test internetPlacement",
  callDetails1: "test callDetails1",
  callTypeDescription: "test callTypeDescription",
  lineOfBusiness: "test lineOfBusiness",
  marketingChannel: "test marketingChannel",
  requestID: "test requestID",
  rangeIndicator: "test rangeIndicator",
  tollFreeNumber: "test tollFreeNumber",
  transferCode: "test transferCode",
  type: "DID",
  whisper: "test whisper"
};

const invalidFLowData = {
  id: 1,
  pkey: "98765",
  agentId: "987654321",
  brand: "LM"
};

const DIDFlowData = {
  type: { value: "DID" }
};

describe("FlowFieldsConfig", ()=>{
  describe("valueSetter", ()=>{
    it("pkey", ()=>{
      const updatedFlowData = flowFields[0].valueSetter(validFlowData, { pkey: "99999999" });
      expect(updatedFlowData.pkey).toBe("99999999");
    });
    it("dialedDescription", ()=>{
      const updatedFlowData = flowFields[1].valueSetter(validFlowData, { dialedDescription: "99999999" });
      expect(updatedFlowData.dialedDescription).toBe("99999999");
    });
    it("callFlowTemplate", ()=>{
      const updatedFlowData = flowFields[2].valueSetter(validFlowData, { callFlowTemplate: "99999999" });
      expect(updatedFlowData.callFlowTemplate).toBe("99999999");
    });
    it("channel", ()=>{
      const updatedFlowData = flowFields[3].valueSetter(validFlowData, { channel: "99999999" });
      expect(updatedFlowData.channel).toBe("99999999");
    });
    it("brand", ()=>{
      const updatedFlowData = flowFields[4].valueSetter(validFlowData, { brand: "99999999" });
      expect(updatedFlowData.brand).toBe("99999999");
    });
    it("languageOffer", ()=>{
      const updatedFlowData = flowFields[5].valueSetter(validFlowData, { languageOffer: "99999999" });
      const updatedFlowDataWithInvalidData = flowFields[5].valueSetter(invalidFLowData, { languageOffer: "99999999" });
      expect(updatedFlowData.content.languageOffer).toBe("99999999");
      expect(updatedFlowDataWithInvalidData.content.languageOffer).toBe("99999999");
    });
    it("dataRequests", ()=>{
      const updatedFlowData = flowFields[6].valueSetter(validFlowData, { dataRequests: "99999999" });
      const updatedFlowDataWithInvalidData = flowFields[6].valueSetter(invalidFLowData, { dataRequests: "99999999" });
      expect(updatedFlowData.content.dataRequests).toBe("99999999");
      expect(updatedFlowDataWithInvalidData.content.dataRequests).toBe("99999999");
    });
    it("callerType", ()=>{
      const updatedFlowData = flowFields[7].valueSetter(validFlowData, { callerType: "99999999" });
      const updatedFlowDataWithInvalidData = flowFields[7].valueSetter(invalidFLowData, { callerType: "99999999" });
      expect(updatedFlowData.content.callerType).toBe("99999999");
      expect(updatedFlowDataWithInvalidData.content.callerType).toBe("99999999");
    });
    it("transferNumber", ()=>{
      const updatedFlowData = flowFields[8].valueSetter(validFlowData, { transferNumber: "99999999" });
      const updatedFlowDataWithInvalidData = flowFields[8].valueSetter(invalidFLowData, { transferNumber: "99999999" });
      expect(updatedFlowData.content.transferNumber).toBe("99999999");
      expect(updatedFlowDataWithInvalidData.content.transferNumber).toBe("99999999");
    });
    it("callFlowRoute", ()=>{
      const updatedFlowData = flowFields[9].valueSetter(validFlowData, { callFlowRoute: "99999999" });
      const updatedFlowDataWithInvalidData = flowFields[9].valueSetter(invalidFLowData, { callFlowRoute: "99999999" });
      expect(updatedFlowData.content.callFlowRoute).toBe("99999999");
      expect(updatedFlowDataWithInvalidData.content.callFlowRoute).toBe("99999999");
    });
    it("greetingMessages", ()=>{
      const updatedFlowData = flowFields[10].valueSetter(validFlowData, { greetingMessages: "99999999" });
      const updatedFlowDataWithInvalidData = flowFields[10].valueSetter(invalidFLowData, { greetingMessages: "99999999" });
      expect(updatedFlowData.content.greetingMessages).toBe("99999999");
      expect(updatedFlowDataWithInvalidData.content.greetingMessages).toBe("99999999");
    });
    it("agentId", ()=>{
      const updatedFlowData = flowFields[11].valueSetter(validFlowData, { agentId: "99999999" });
      expect(updatedFlowData.agentId).toBe("99999999");
    });
    it("employeeId", ()=>{
      const updatedFlowData = flowFields[12].valueSetter(validFlowData, { employeeId: "99999999" });
      expect(updatedFlowData.employeeId).toBe("99999999");
    });
    it("accountManager", ()=>{
      const updatedFlowData = flowFields[13].valueSetter(validFlowData, { accountManager: "99999999" });
      expect(updatedFlowData.accountManager).toBe("99999999");
    });
    it("affinityVDN", ()=>{
      const updatedFlowData = flowFields[14].valueSetter(validFlowData, { affinityVDN: "99999999" });
      expect(updatedFlowData.affinityVDN).toBe("99999999");
    });
    it("callTypeDescription", ()=>{
      const updatedFlowData = flowFields[15].valueSetter(validFlowData, { callTypeDescription: "99999999" });
      expect(updatedFlowData.callTypeDescription).toBe("99999999");
    });
    it("transferCode", ()=>{
      const updatedFlowData = flowFields[16].valueSetter(validFlowData, { transferCode: "99999999" });
      expect(updatedFlowData.transferCode).toBe("99999999");
    });
    it("internetPlacement", ()=>{
      const updatedFlowData = flowFields[17].valueSetter(validFlowData, { internetPlacement: "99999999" });
      expect(updatedFlowData.internetPlacement).toBe("99999999");
    });
    it("callDetails1", ()=>{
      const updatedFlowData = flowFields[18].valueSetter(validFlowData, { callDetails1: "99999999" });
      expect(updatedFlowData.callDetails1).toBe("99999999");
    });
    it("callDetails2", ()=>{
      const updatedFlowData = flowFields[19].valueSetter(validFlowData, { callDetails2: "99999999" });
      expect(updatedFlowData.callDetails2).toBe("99999999");
    });
    it("lineOfBusiness", ()=>{
      const updatedFlowData = flowFields[20].valueSetter(validFlowData, { lineOfBusiness: "99999999" });
      expect(updatedFlowData.lineOfBusiness).toBe("99999999");
    });
    it("marketingChannel", ()=>{
      const updatedFlowData = flowFields[21].valueSetter(validFlowData, { marketingChannel: "99999999" });
      expect(updatedFlowData.marketingChannel).toBe("99999999");
    });
    it("whisper", ()=>{
      const updatedFlowData = flowFields[22].valueSetter(validFlowData, { whisper: "99999999" });
      expect(updatedFlowData.whisper).toBe("99999999");
    });
    it("requestID", ()=>{
      const updatedFlowData = flowFields[23].valueSetter(validFlowData, { requestID: "99999999" });
      expect(updatedFlowData.requestID).toBe("99999999");
    });
    it("userDestination", ()=>{
      const updatedFlowData = flowFields[24].valueSetter(validFlowData, { userDestination: "99999999" });
      expect(updatedFlowData.userDestination).toBe("99999999");
    });
    it("rangeIndicator", ()=>{
      const updatedFlowData = flowFields[25].valueSetter(validFlowData, { rangeIndicator: "99999999" });
      expect(updatedFlowData.rangeIndicator).toBe("99999999");
    });
    it("type", ()=>{
      const updatedFlowData = flowFields[26].valueSetter(validFlowData, { type: "99999999" });
      expect(updatedFlowData.type).toBe("99999999");
    });
  });
  describe("valueGetter", ()=>{
    it("pkey", ()=>{
      const validPKey = flowFields[0].valueGetter(validFlowData);
      const invalidPKey = flowFields[0].valueGetter({});
      expect(validPKey).toBe("12345");
      expect(invalidPKey).toBe("");
    });
    it("dialedDescription", ()=>{
      const validPKey = flowFields[1].valueGetter(validFlowData);
      const invalidPKey = flowFields[1].valueGetter({});
      expect(validPKey).toBe("test dialedDescription");
      expect(invalidPKey).toBe("");
    });
    it("callFlowTemplate", ()=>{
      const validPKey = flowFields[2].valueGetter(validFlowData);
      const invalidPKey = flowFields[2].valueGetter({});
      expect(validPKey).toBe("test callFlowTemplate");
      expect(invalidPKey).toBe("");
    });
    it("channel", ()=>{
      const validPKey = flowFields[3].valueGetter(validFlowData);
      const invalidPKey = flowFields[3].valueGetter({});
      expect(validPKey).toBe("Test1 Channel");
      expect(invalidPKey).toBe("");
    });
    it("brand", ()=>{
      const validPKey = flowFields[4].valueGetter(validFlowData);
      const invalidPKey = flowFields[4].valueGetter({});
      expect(validPKey).toBe("LM");
      expect(invalidPKey).toBe("");
    });
    it("languageOffer", ()=>{
      const validPKey = flowFields[5].valueGetter(validFlowData);
      const invalidPKey = flowFields[5].valueGetter({});
      expect(validPKey).toBe("English");
      expect(invalidPKey).toBe("");
    });
    it("dataRequests", ()=>{
      const validPKey = flowFields[6].valueGetter(validFlowData);
      const invalidPKey = flowFields[6].valueGetter({});
      expect(validPKey).toBe("test1,test2");
      expect(invalidPKey).toBe("");
    });
    it("callerType", ()=>{
      const validPKey = flowFields[7].valueGetter(validFlowData);
      const invalidPKey = flowFields[7].valueGetter({});
      expect(validPKey).toBe("test callerType");
      expect(invalidPKey).toBe("");
    });
    it("transferNumber", ()=>{
      const validPKey = flowFields[8].valueGetter(validFlowData);
      const invalidPKey = flowFields[8].valueGetter({});
      expect(validPKey).toBe("123456789");
      expect(invalidPKey).toBe("");
    });
    it("callFlowRoute", ()=>{
      const validPKey = flowFields[9].valueGetter(validFlowData);
      const invalidPKey = flowFields[9].valueGetter({});
      expect(validPKey).toBe("test callFlowRoute");
      expect(invalidPKey).toBe("");
    });
    it("greetingMessages", ()=>{
      const validPKey = flowFields[10].valueGetter(validFlowData);
      const invalidPKey = flowFields[10].valueGetter({});
      expect(validPKey).toBe("Hello Test Message");
      expect(invalidPKey).toBe("");
    });
    it("agentId", ()=>{
      const validPKey = flowFields[11].valueGetter(validFlowData);
      const invalidPKey = flowFields[11].valueGetter({});
      expect(validPKey).toBe("123455");
      expect(invalidPKey).toBe("");
    });
    it("employeeId", ()=>{
      const validPKey = flowFields[12].valueGetter(validFlowData);
      const invalidPKey = flowFields[12].valueGetter({});
      expect(validPKey).toBe("n1234567");
      expect(invalidPKey).toBe("");
    });
    it("accountManager", ()=>{
      const validPKey = flowFields[13].valueGetter(validFlowData);
      const invalidPKey = flowFields[13].valueGetter({});
      expect(validPKey).toBe("test accountManager");
      expect(invalidPKey).toBe("");
    });
    it("affinityVDN", ()=>{
      const validPKey = flowFields[14].valueGetter(validFlowData);
      const invalidPKey = flowFields[14].valueGetter({});
      expect(validPKey).toBe("test affinityVDN");
      expect(invalidPKey).toBe("");
    });
    it("callTypeDescription", ()=>{
      const validPKey = flowFields[15].valueGetter(validFlowData);
      const invalidPKey = flowFields[15].valueGetter({});
      expect(validPKey).toBe("test callTypeDescription");
      expect(invalidPKey).toBe("");
    });
    it("transferCode", ()=>{
      const validPKey = flowFields[16].valueGetter(validFlowData);
      const invalidPKey = flowFields[16].valueGetter({});
      expect(validPKey).toBe("test transferCode");
      expect(invalidPKey).toBe("");
    });
    it("internetPlacement", ()=>{
      const validPKey = flowFields[17].valueGetter(validFlowData);
      const invalidPKey = flowFields[17].valueGetter({});
      expect(validPKey).toBe("test internetPlacement");
      expect(invalidPKey).toBe("");
    });
    it("callDetails1", ()=>{
      const validPKey = flowFields[18].valueGetter(validFlowData);
      const invalidPKey = flowFields[18].valueGetter({});
      expect(validPKey).toBe("test callDetails1");
      expect(invalidPKey).toBe("");
    });
    it("callDetails2", ()=>{
      const validPKey = flowFields[19].valueGetter(validFlowData);
      const invalidPKey = flowFields[19].valueGetter({});
      expect(validPKey).toBe("test callDetails2");
      expect(invalidPKey).toBe("");
    });
    it("lineOfBusiness", ()=>{
      const validPKey = flowFields[20].valueGetter(validFlowData);
      const invalidPKey = flowFields[20].valueGetter({});
      expect(validPKey).toBe("test lineOfBusiness");
      expect(invalidPKey).toBe("");
    });
    it("marketingChannel", ()=>{
      const validPKey = flowFields[21].valueGetter(validFlowData);
      const invalidPKey = flowFields[21].valueGetter({});
      expect(validPKey).toBe("test marketingChannel");
      expect(invalidPKey).toBe("");
    });
    it("tollFreeNumber", ()=>{
      const validPKey = flowFields[22].valueGetter(validFlowData);
      const invalidPKey = flowFields[22].valueGetter({});
      expect(validPKey).toBe("test tollFreeNumber");
      expect(invalidPKey).toBe("");
    });
    it("whisper", ()=>{
      const validPKey = flowFields[23].valueGetter(validFlowData);
      const invalidPKey = flowFields[23].valueGetter({});
      expect(validPKey).toBe("test whisper");
      expect(invalidPKey).toBe("");
    });
    it("requestID", ()=>{
      const validPKey = flowFields[24].valueGetter(validFlowData);
      const invalidPKey = flowFields[24].valueGetter({});
      expect(validPKey).toBe("test requestID");
      expect(invalidPKey).toBe("");
    });
    it("userDestination", ()=>{
      const validPKey = flowFields[25].valueGetter(validFlowData);
      const invalidPKey = flowFields[25].valueGetter({});
      expect(validPKey).toBe("test userDestination");
      expect(invalidPKey).toBe("");
    });
    it("rangeIndicator", ()=>{
      const validPKey = flowFields[26].valueGetter(validFlowData);
      const invalidPKey = flowFields[26].valueGetter({});
      expect(validPKey).toBe("test rangeIndicator");
      expect(invalidPKey).toBe("");
    });
    it("type", ()=>{
      const validPKey = flowFields[27].valueGetter(validFlowData);
      const invalidPKey = flowFields[27].valueGetter({});
      expect(validPKey).toBe("DID");
      expect(invalidPKey).toBe("");
    });
    describe("dynamicFieldConditionCheck",()=>{
      it("userDestination",()=>{
        const isFiledIncluded = flowFields[25].dynamicFieldConditionCheck(DIDFlowData);
        expect(isFiledIncluded).toBeTruthy();
      });
    });
  });
});