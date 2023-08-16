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
    callIntent: "test callIntent",
    callerType: "test callerType",
    callFlowRoute: "test callFlowRoute",
    dataRequests: ["test1", "test2"],
    greetingMessages: "Hello Test Message",
    languageOffer: "English",
    transferNumber: "123456789",
    officeNumber: "#2710"
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

const drcFlowData = {
  brand: { value: "Liberty Mutual" },
  channel: { value: "Sales" },
  type: { value: "DRC" }
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
    it("type", ()=>{
      const updatedFlowData = flowFields[8].valueSetter(validFlowData, { type: "99999999" });
      expect(updatedFlowData.type).toBe("99999999");
    });
    it("transferNumber", ()=>{
      const updatedFlowData = flowFields[9].valueSetter(validFlowData, { transferNumber: "99999999" });
      const updatedFlowDataWithInvalidData = flowFields[9].valueSetter(invalidFLowData, { transferNumber: "99999999" });
      expect(updatedFlowData.content.transferNumber).toBe("99999999");
      expect(updatedFlowDataWithInvalidData.content.transferNumber).toBe("99999999");
    });
    it("callFlowRoute", ()=>{
      const updatedFlowData = flowFields[10].valueSetter(validFlowData, { callFlowRoute: "99999999" });
      const updatedFlowDataWithInvalidData = flowFields[10].valueSetter(invalidFLowData, { callFlowRoute: "99999999" });
      expect(updatedFlowData.content.callFlowRoute).toBe("99999999");
      expect(updatedFlowDataWithInvalidData.content.callFlowRoute).toBe("99999999");
    });
    it("greetingMessages", ()=>{
      const updatedFlowData = flowFields[11].valueSetter(validFlowData, { greetingMessages: "99999999" });
      const updatedFlowDataWithInvalidData = flowFields[11].valueSetter(invalidFLowData, { greetingMessages: "99999999" });
      expect(updatedFlowData.content.greetingMessages).toBe("99999999");
      expect(updatedFlowDataWithInvalidData.content.greetingMessages).toBe("99999999");
    });
    it("agentId", ()=>{
      const updatedFlowData = flowFields[12].valueSetter(validFlowData, { agentId: "99999999" });
      expect(updatedFlowData.agentId).toBe("99999999");
    });
    it("employeeId", ()=>{
      const updatedFlowData = flowFields[13].valueSetter(validFlowData, { employeeId: "99999999" });
      expect(updatedFlowData.employeeId).toBe("99999999");
    });
    it("accountManager", ()=>{
      const updatedFlowData = flowFields[14].valueSetter(validFlowData, { accountManager: "99999999" });
      expect(updatedFlowData.accountManager).toBe("99999999");
    });
    it("affinityVDN", ()=>{
      const updatedFlowData = flowFields[15].valueSetter(validFlowData, { affinityVDN: "99999999" });
      expect(updatedFlowData.affinityVDN).toBe("99999999");
    });
    it("callTypeDescription", ()=>{
      const updatedFlowData = flowFields[16].valueSetter(validFlowData, { callTypeDescription: "99999999" });
      expect(updatedFlowData.callTypeDescription).toBe("99999999");
    });
    it("transferCode", ()=>{
      const updatedFlowData = flowFields[17].valueSetter(validFlowData, { transferCode: "99999999" });
      expect(updatedFlowData.transferCode).toBe("99999999");
    });
    it("internetPlacement", ()=>{
      const updatedFlowData = flowFields[18].valueSetter(validFlowData, { internetPlacement: "99999999" });
      expect(updatedFlowData.internetPlacement).toBe("99999999");
    });
    it("callDetails1", ()=>{
      const updatedFlowData = flowFields[19].valueSetter(validFlowData, { callDetails1: "99999999" });
      expect(updatedFlowData.callDetails1).toBe("99999999");
    });
    it("callDetails2", ()=>{
      const updatedFlowData = flowFields[20].valueSetter(validFlowData, { callDetails2: "99999999" });
      expect(updatedFlowData.callDetails2).toBe("99999999");
    });
    it("lineOfBusiness", ()=>{
      const updatedFlowData = flowFields[21].valueSetter(validFlowData, { lineOfBusiness: "99999999" });
      expect(updatedFlowData.lineOfBusiness).toBe("99999999");
    });
    it("marketingChannel", ()=>{
      const updatedFlowData = flowFields[22].valueSetter(validFlowData, { marketingChannel: "99999999" });
      expect(updatedFlowData.marketingChannel).toBe("99999999");
    });
    it("tollFreeNumber", ()=>{
      const updatedFlowData = flowFields[23].valueSetter(validFlowData, { tollFreeNumber: "99999999" });
      expect(updatedFlowData.tollFreeNumber).toBe("99999999");
    });
    it("whisper", ()=>{
      const updatedFlowData = flowFields[24].valueSetter(validFlowData, { whisper: "99999999" });
      expect(updatedFlowData.whisper).toBe("99999999");
    });
    it("requestID", ()=>{
      const updatedFlowData = flowFields[25].valueSetter(validFlowData, { requestID: "99999999" });
      expect(updatedFlowData.requestID).toBe("99999999");
    });
    it("userDestination", ()=>{
      const updatedFlowData = flowFields[26].valueSetter(validFlowData, { userDestination: "99999999" });
      expect(updatedFlowData.userDestination).toBe("99999999");
    });
    it("rangeIndicator", ()=>{
      const updatedFlowData = flowFields[27].valueSetter(validFlowData, { rangeIndicator: "99999999" });
      expect(updatedFlowData.rangeIndicator).toBe("99999999");
    });
    it("callIntent", ()=>{
      const updatedFlowData = flowFields[28].valueSetter(validFlowData, { callIntent: "99999999" });
      expect(updatedFlowData.content.callIntent).toBe("99999999");
      const updateDefaultFlowData = flowFields[28].valueSetter(invalidFLowData, { callIntent: "99999999" });
      expect(updateDefaultFlowData.content.callIntent).toBe("99999999");
    });
    it("officeNumber", ()=>{
      const updatedFlowData = flowFields[29].valueSetter(validFlowData, { officeNumber: "#9999" });
      expect(updatedFlowData.content.officeNumber).toBe("#9999");
      const updateDefaultFlowData = flowFields[29].valueSetter(invalidFLowData, { officeNumber: "#9999" });
      expect(updateDefaultFlowData.content.officeNumber).toBe("#9999");
    });
  });
  describe("valueGetter", ()=>{
    it("pkey", ()=>{
      const validData = flowFields[0].valueGetter(validFlowData);
      const invalidData = flowFields[0].valueGetter({});
      expect(validData).toBe("12345");
      expect(invalidData).toBe("");
    });
    it("dialedDescription", ()=>{
      const validData = flowFields[1].valueGetter(validFlowData);
      const invalidData = flowFields[1].valueGetter({});
      expect(validData).toBe("test dialedDescription");
      expect(invalidData).toBe("");
    });
    it("callFlowTemplate", ()=>{
      const validData = flowFields[2].valueGetter(validFlowData);
      const invalidData = flowFields[2].valueGetter({});
      expect(validData).toBe("test callFlowTemplate");
      expect(invalidData).toBe("");
    });
    it("channel", ()=>{
      const validData = flowFields[3].valueGetter(validFlowData);
      const invalidData = flowFields[3].valueGetter({});
      expect(validData).toBe("Test1 Channel");
      expect(invalidData).toBe("");
    });
    it("brand", ()=>{
      const validData = flowFields[4].valueGetter(validFlowData);
      const invalidData = flowFields[4].valueGetter({});
      expect(validData).toBe("LM");
      expect(invalidData).toBe("");
    });
    it("languageOffer", ()=>{
      const validData = flowFields[5].valueGetter(validFlowData);
      const invalidData = flowFields[5].valueGetter({});
      expect(validData).toBe("English");
      expect(invalidData).toBe("");
    });
    it("dataRequests", ()=>{
      const validData = flowFields[6].valueGetter(validFlowData);
      const invalidData = flowFields[6].valueGetter({});
      expect(validData).toBe("test1,test2");
      expect(invalidData).toBe("");
    });
    it("callerType", ()=>{
      const validData = flowFields[7].valueGetter(validFlowData);
      const invalidData = flowFields[7].valueGetter({});
      expect(validData).toBe("test callerType");
      expect(invalidData).toBe("");
    });
    it("type", ()=>{
      const validData = flowFields[8].valueGetter(validFlowData);
      const invalidData = flowFields[8].valueGetter({});
      expect(validData).toBe("DID");
      expect(invalidData).toBe("");
    });
    it("transferNumber", ()=>{
      const validData = flowFields[9].valueGetter(validFlowData);
      const invalidData = flowFields[9].valueGetter({});
      expect(validData).toBe("123456789");
      expect(invalidData).toBe("");
    });
    it("callFlowRoute", ()=>{
      const validData = flowFields[10].valueGetter(validFlowData);
      const invalidData = flowFields[10].valueGetter({});
      expect(validData).toBe("test callFlowRoute");
      expect(invalidData).toBe("");
    });
    it("greetingMessages", ()=>{
      const validData = flowFields[11].valueGetter(validFlowData);
      const invalidData = flowFields[11].valueGetter({});
      expect(validData).toBe("Hello Test Message");
      expect(invalidData).toBe("");
    });
    it("agentId", ()=>{
      const validData = flowFields[12].valueGetter(validFlowData);
      const invalidData = flowFields[12].valueGetter({});
      expect(validData).toBe("123455");
      expect(invalidData).toBe("");
    });
    it("employeeId", ()=>{
      const validData = flowFields[13].valueGetter(validFlowData);
      const invalidData = flowFields[13].valueGetter({});
      expect(validData).toBe("n1234567");
      expect(invalidData).toBe("");
    });
    it("accountManager", ()=>{
      const validData = flowFields[14].valueGetter(validFlowData);
      const invalidData = flowFields[14].valueGetter({});
      expect(validData).toBe("test accountManager");
      expect(invalidData).toBe("");
    });
    it("affinityVDN", ()=>{
      const validData = flowFields[15].valueGetter(validFlowData);
      const invalidData = flowFields[15].valueGetter({});
      expect(validData).toBe("test affinityVDN");
      expect(invalidData).toBe("");
    });
    it("callTypeDescription", ()=>{
      const validData = flowFields[16].valueGetter(validFlowData);
      const invalidData = flowFields[16].valueGetter({});
      expect(validData).toBe("test callTypeDescription");
      expect(invalidData).toBe("");
    });
    it("transferCode", ()=>{
      const validData = flowFields[17].valueGetter(validFlowData);
      const invalidData = flowFields[17].valueGetter({});
      expect(validData).toBe("test transferCode");
      expect(invalidData).toBe("");
    });
    it("internetPlacement", ()=>{
      const validData = flowFields[18].valueGetter(validFlowData);
      const invalidData = flowFields[18].valueGetter({});
      expect(validData).toBe("test internetPlacement");
      expect(invalidData).toBe("");
    });
    it("callDetails1", ()=>{
      const validData = flowFields[19].valueGetter(validFlowData);
      const invalidData = flowFields[19].valueGetter({});
      expect(validData).toBe("test callDetails1");
      expect(invalidData).toBe("");
    });
    it("callDetails2", ()=>{
      const validData = flowFields[20].valueGetter(validFlowData);
      const invalidData = flowFields[20].valueGetter({});
      expect(validData).toBe("test callDetails2");
      expect(invalidData).toBe("");
    });
    it("lineOfBusiness", ()=>{
      const validData = flowFields[21].valueGetter(validFlowData);
      const invalidData = flowFields[21].valueGetter({});
      expect(validData).toBe("test lineOfBusiness");
      expect(invalidData).toBe("");
    });
    it("marketingChannel", ()=>{
      const validData = flowFields[22].valueGetter(validFlowData);
      const invalidData = flowFields[22].valueGetter({});
      expect(validData).toBe("test marketingChannel");
      expect(invalidData).toBe("");
    });
    it("tollFreeNumber", ()=>{
      const validData = flowFields[23].valueGetter(validFlowData);
      const invalidData = flowFields[23].valueGetter({});
      expect(validData).toBe("test tollFreeNumber");
      expect(invalidData).toBe("");
    });
    it("whisper", ()=>{
      const validData = flowFields[24].valueGetter(validFlowData);
      const invalidData = flowFields[24].valueGetter({});
      expect(validData).toBe("test whisper");
      expect(invalidData).toBe("");
    });
    it("requestID", ()=>{
      const validData = flowFields[25].valueGetter(validFlowData);
      const invalidData = flowFields[25].valueGetter({});
      expect(validData).toBe("test requestID");
      expect(invalidData).toBe("");
    });
    it("userDestination", ()=>{
      const validData = flowFields[26].valueGetter(validFlowData);
      const invalidData = flowFields[26].valueGetter({});
      expect(validData).toBe("test userDestination");
      expect(invalidData).toBe("");
    });
    it("rangeIndicator", ()=>{
      const validData = flowFields[27].valueGetter(validFlowData);
      const invalidData = flowFields[27].valueGetter({});
      expect(validData).toBe("test rangeIndicator");
      expect(invalidData).toBe("");
    });
    it("callIntent", ()=>{
      const validData = flowFields[28].valueGetter(validFlowData);
      const invalidData = flowFields[28].valueGetter({});
      expect(validData).toBe("test callIntent");
      expect(invalidData).toBe("");
    });
    it("officeNumber", ()=>{
      const validData = flowFields[29].valueGetter(validFlowData);
      const invalidData = flowFields[29].valueGetter({});
      expect(validData).toBe("#2710");
      expect(invalidData).toBe("");
    });
  });
  describe("dynamicFieldConditionCheck",()=>{
    it("accountManager",()=>{
      const isFiledIncluded = flowFields[14].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("affinityVDN",()=>{
      const isFiledIncluded = flowFields[15].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("transferCode",()=>{
      const isFiledIncluded = flowFields[17].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("internetPlacement",()=>{
      const isFiledIncluded = flowFields[18].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("callDetails1",()=>{
      const isFiledIncluded = flowFields[19].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("callDetails2",()=>{
      const isFiledIncluded = flowFields[20].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("lineOfBusiness",()=>{
      const isFiledIncluded = flowFields[21].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("marketingChannel",()=>{
      const isFiledIncluded = flowFields[22].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("whisper",()=>{
      const isFiledIncluded = flowFields[24].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("requestID",()=>{
      const isFiledIncluded = flowFields[25].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("rangeIndicator",()=>{
      const isFiledIncluded = flowFields[27].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("userDestination",()=>{
      const isFiledIncluded = flowFields[26].dynamicFieldConditionCheck(DIDFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
  });
});
