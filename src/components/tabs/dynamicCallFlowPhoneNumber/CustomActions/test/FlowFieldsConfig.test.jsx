import { phoneNumberFields } from "components/tabs/dynamicCallFlowPhoneNumber/Field/PhoneNumberFieldsConfig";


const validFlowData = {
  id: 1,
  content: {
    callFlowRoute: "test callFlowRoute",
    callIntent: "test callIntent",
    callerType: "test callerType",
    dataRequests: ["test1", "test2"],
    greetingMessages: "Hello Test Message",
    languageOffer: "English",
    officeNumbers: ["#2710"],
    transferDestination: "123456789"
  },
  accountManager: "test accountManager",
  affinityVDN: "test affinityVDN",
  brand: "LM",
  callDetails1: "test callDetails1",
  callDetails2: "test callDetails2",
  callFlowName: "LSC",
  callFlowTemplate: "test callFlowTemplate",
  callFlowType: "Self Service",
  callTypeDescription: "test callTypeDescription",
  channel: "Test1 Channel",
  createTime: "2022-24-08",
  dialedDescription: "test dialedDescription",
  employeeId: "n1234567",
  internetPlacement: "test internetPlacement",
  lineOfBusiness: "test lineOfBusiness",
  marketingChannel: "test marketingChannel",
  nextActionId: "next123",
  nextActionType: "ANNOUNCEMENT",
  pkey: "12345",
  predictiveCaller: true,
  rangeIndicator: "test rangeIndicator",
  requestID: "test requestID",
  tfnRoutingGroup: "Core",
  transferCode: "test transferCode",
  phoneNumberType: "DID",
  userDestination: "test userDestination",
  whisper: "test whisper"
};

const invalidFLowData = {
  id: 1,
  pkey: "98765",
  brand: "LM"
};

const drcFlowData = {
  brand: { value: "Liberty Mutual" },
  channel: { value: "Sales" },
  phoneNumberType: { value: "DRC" }
};
const DIDFlowData = {
  phoneNumberType: { value: "DID" }
};

describe("FlowFieldsConfig", ()=>{
  describe("valueSetter", ()=>{
    it("pkey", ()=>{
      const updatedFlowData = phoneNumberFields[0].valueSetter(validFlowData, { pkey: "99999999" });
      expect(updatedFlowData.pkey).toBe("99999999");
    });
    it("dialedDescription", ()=>{
      const updatedFlowData = phoneNumberFields[1].valueSetter(validFlowData, { dialedDescription: "99999999" });
      expect(updatedFlowData.dialedDescription).toBe("99999999");
    });
    it("callFlowTemplate", ()=>{
      const updatedFlowData = phoneNumberFields[2].valueSetter(validFlowData, { callFlowTemplate: "99999999" });
      expect(updatedFlowData.callFlowTemplate).toBe("99999999");
    });
    it("channel", ()=>{
      const updatedFlowData = phoneNumberFields[3].valueSetter(validFlowData, { channel: "99999999" });
      expect(updatedFlowData.channel).toBe("99999999");
    });
    it("brand", ()=>{
      const updatedFlowData = phoneNumberFields[4].valueSetter(validFlowData, { brand: "99999999" });
      expect(updatedFlowData.brand).toBe("99999999");
    });
    it("languageOffer", ()=>{
      const updatedFlowData = phoneNumberFields[5].valueSetter(validFlowData, { languageOffer: "99999999" });
      const updatedFlowDataWithInvalidData = phoneNumberFields[5].valueSetter(invalidFLowData, { languageOffer: "99999999" });
      expect(updatedFlowData.content.languageOffer).toBe("99999999");
      expect(updatedFlowDataWithInvalidData.content.languageOffer).toBe("99999999");
    });
    it("dataRequests", ()=>{
      const updatedFlowData = phoneNumberFields[6].valueSetter(validFlowData, { dataRequests: "99999999" });
      const updatedFlowDataWithInvalidData = phoneNumberFields[6].valueSetter(invalidFLowData, { dataRequests: "99999999" });
      expect(updatedFlowData.content.dataRequests).toBe("99999999");
      expect(updatedFlowDataWithInvalidData.content.dataRequests).toBe("99999999");
    });
    it("callerType", ()=>{
      const updatedFlowData = phoneNumberFields[7].valueSetter(validFlowData, { callerType: "99999999" });
      const updatedFlowDataWithInvalidData = phoneNumberFields[7].valueSetter(invalidFLowData, { callerType: "99999999" });
      expect(updatedFlowData.content.callerType).toBe("99999999");
      expect(updatedFlowDataWithInvalidData.content.callerType).toBe("99999999");
    });
    it("phoneNumberType", ()=>{
      const updatedFlowData = phoneNumberFields[8].valueSetter(validFlowData, { phoneNumberType: "99999999" });
      expect(updatedFlowData.phoneNumberType).toBe("99999999");
    });
    it("transferDestination", ()=>{
      const updatedFlowData = phoneNumberFields[9].valueSetter(validFlowData, { transferDestination: "99999999" });
      const updatedFlowDataWithInvalidData = phoneNumberFields[9].valueSetter(invalidFLowData, { transferDestination: "99999999" });
      expect(updatedFlowData.content.transferDestination).toBe("99999999");
      expect(updatedFlowDataWithInvalidData.content.transferDestination).toBe("99999999");
    });
    it("callFlowRoute", ()=>{
      const updatedFlowData = phoneNumberFields[10].valueSetter(validFlowData, { callFlowRoute: "99999999" });
      const updatedFlowDataWithInvalidData = phoneNumberFields[10].valueSetter(invalidFLowData, { callFlowRoute: "99999999" });
      expect(updatedFlowData.content.callFlowRoute).toBe("99999999");
      expect(updatedFlowDataWithInvalidData.content.callFlowRoute).toBe("99999999");
    });
    it("greetingMessages", ()=>{
      const updatedFlowData = phoneNumberFields[11].valueSetter(validFlowData, { greetingMessages: "99999999" });
      const updatedFlowDataWithInvalidData = phoneNumberFields[11].valueSetter(invalidFLowData, { greetingMessages: "99999999" });
      expect(updatedFlowData.content.greetingMessages).toBe("99999999");
      expect(updatedFlowDataWithInvalidData.content.greetingMessages).toBe("99999999");
    });
    it("employeeId", ()=>{
      const updatedFlowData = phoneNumberFields[12].valueSetter(validFlowData, { employeeId: "99999999" });
      expect(updatedFlowData.employeeId).toBe("99999999");
    });
    it("accountManager", ()=>{
      const updatedFlowData = phoneNumberFields[13].valueSetter(validFlowData, { accountManager: "99999999" });
      expect(updatedFlowData.accountManager).toBe("99999999");
    });
    it("affinityVDN", ()=>{
      const updatedFlowData = phoneNumberFields[14].valueSetter(validFlowData, { affinityVDN: "99999999" });
      expect(updatedFlowData.affinityVDN).toBe("99999999");
    });
    it("callTypeDescription", ()=>{
      const updatedFlowData = phoneNumberFields[15].valueSetter(validFlowData, { callTypeDescription: "99999999" });
      expect(updatedFlowData.callTypeDescription).toBe("99999999");
    });
    it("transferCode", ()=>{
      const updatedFlowData = phoneNumberFields[16].valueSetter(validFlowData, { transferCode: "99999999" });
      expect(updatedFlowData.transferCode).toBe("99999999");
    });
    it("internetPlacement", ()=>{
      const updatedFlowData = phoneNumberFields[17].valueSetter(validFlowData, { internetPlacement: "99999999" });
      expect(updatedFlowData.internetPlacement).toBe("99999999");
    });
    it("callDetails1", ()=>{
      const updatedFlowData = phoneNumberFields[18].valueSetter(validFlowData, { callDetails1: "99999999" });
      expect(updatedFlowData.callDetails1).toBe("99999999");
    });
    it("callDetails2", ()=>{
      const updatedFlowData = phoneNumberFields[19].valueSetter(validFlowData, { callDetails2: "99999999" });
      expect(updatedFlowData.callDetails2).toBe("99999999");
    });
    it("lineOfBusiness", ()=>{
      const updatedFlowData = phoneNumberFields[20].valueSetter(validFlowData, { lineOfBusiness: "99999999" });
      expect(updatedFlowData.lineOfBusiness).toBe("99999999");
    });
    it("marketingChannel", ()=>{
      const updatedFlowData = phoneNumberFields[21].valueSetter(validFlowData, { marketingChannel: "99999999" });
      expect(updatedFlowData.marketingChannel).toBe("99999999");
    });
    it("whisper", ()=>{
      const updatedFlowData = phoneNumberFields[22].valueSetter(validFlowData, { whisper: "99999999" });
      expect(updatedFlowData.whisper).toBe("99999999");
    });
    it("requestID", ()=>{
      const updatedFlowData = phoneNumberFields[23].valueSetter(validFlowData, { requestID: "99999999" });
      expect(updatedFlowData.requestID).toBe("99999999");
    });
    it("userDestination", ()=>{
      const updatedFlowData = phoneNumberFields[24].valueSetter(validFlowData, { userDestination: "99999999" });
      expect(updatedFlowData.userDestination).toBe("99999999");
    });
    it("rangeIndicator", ()=>{
      const updatedFlowData = phoneNumberFields[25].valueSetter(validFlowData, { rangeIndicator: "99999999" });
      expect(updatedFlowData.rangeIndicator).toBe("99999999");
    });
    it("callIntent", ()=>{
      const updatedFlowData = phoneNumberFields[26].valueSetter(validFlowData, { callIntent: "99999999" });
      expect(updatedFlowData.content.callIntent).toBe("99999999");
      const updateDefaultFlowData = phoneNumberFields[26].valueSetter(invalidFLowData, { callIntent: "99999999" });
      expect(updateDefaultFlowData.content.callIntent).toBe("99999999");
    });
    it("officeNumbers", ()=>{
      const updatedFlowData = phoneNumberFields[27].valueSetter(validFlowData, { officeNumbers: ["#9999"]});
      expect(updatedFlowData.content.officeNumbers).toEqual(["#9999"]);
      const updateDefaultFlowData = phoneNumberFields[27].valueSetter(invalidFLowData, { officeNumbers: ["#9999"]});
      expect(updateDefaultFlowData.content.officeNumbers).toEqual(["#9999"]);
    });
    it("tfnRoutingGroup", ()=>{
      const updatedFlowData = phoneNumberFields[28].valueSetter(validFlowData, { tfnRoutingGroup: "Core" });
      expect(updatedFlowData.tfnRoutingGroup).toBe("Core");
    });
    it("predictiveCaller", ()=>{
      const updatedFlowData = phoneNumberFields[29].valueSetter(validFlowData, { predictiveCaller: false });
      expect(updatedFlowData.predictiveCaller).toBe(false);
    });
    it("callFlowType", ()=>{
      const updatedFlowData = phoneNumberFields[30].valueSetter(validFlowData, { callFlowType: "Self Service" });
      expect(updatedFlowData.callFlowType).toBe("Self Service");
    });
    it("callFlowName", ()=>{
      const updatedFlowData = phoneNumberFields[31].valueSetter(validFlowData, { callFlowName: "LSC" });
      expect(updatedFlowData.callFlowName).toBe("LSC");
    });
    it("nextActionId", ()=>{
      const updatedFlowData = phoneNumberFields[32].valueSetter(validFlowData, { nextActionId: "nextId123" });
      expect(updatedFlowData.nextActionId).toBe("nextId123");
    });
    it("nextActionType", ()=>{
      const updatedFlowData = phoneNumberFields[33].valueSetter(validFlowData, { nextActionType: "MENU" });
      expect(updatedFlowData.nextActionType).toBe("MENU");
    });
  });
  describe("valueGetter", ()=>{
    it("pkey", ()=>{
      const validData = phoneNumberFields[0].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[0].valueGetter({});
      expect(validData).toBe("12345");
      expect(invalidData).toBe("");
    });
    it("dialedDescription", ()=>{
      const validData = phoneNumberFields[1].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[1].valueGetter({});
      expect(validData).toBe("test dialedDescription");
      expect(invalidData).toBe("");
    });
    it("callFlowTemplate", ()=>{
      const validData = phoneNumberFields[2].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[2].valueGetter({});
      expect(validData).toBe("test callFlowTemplate");
      expect(invalidData).toBe("");
    });
    it("channel", ()=>{
      const validData = phoneNumberFields[3].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[3].valueGetter({});
      expect(validData).toBe("Test1 Channel");
      expect(invalidData).toBe("");
    });
    it("brand", ()=>{
      const validData = phoneNumberFields[4].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[4].valueGetter({});
      expect(validData).toBe("LM");
      expect(invalidData).toBe("");
    });
    it("languageOffer", ()=>{
      const validData = phoneNumberFields[5].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[5].valueGetter({});
      expect(validData).toBe("English");
      expect(invalidData).toBe("");
    });
    it("dataRequests", ()=>{
      const validData = phoneNumberFields[6].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[6].valueGetter({});
      expect(validData).toBe("test1,test2");
      expect(invalidData).toBe("");
    });
    it("callerType", ()=>{
      const validData = phoneNumberFields[7].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[7].valueGetter({});
      expect(validData).toBe("test callerType");
      expect(invalidData).toBe("");
    });
    it("phoneNumberType", ()=>{
      const validData = phoneNumberFields[8].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[8].valueGetter({});
      expect(validData).toBe("DID");
      expect(invalidData).toBe("");
    });
    it("transferDestination", ()=>{
      const validData = phoneNumberFields[9].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[9].valueGetter({});
      expect(validData).toBe("123456789");
      expect(invalidData).toBe("");
    });
    it("callFlowRoute", ()=>{
      const validData = phoneNumberFields[10].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[10].valueGetter({});
      expect(validData).toBe("test callFlowRoute");
      expect(invalidData).toBe("");
    });
    it("greetingMessages", ()=>{
      const validData = phoneNumberFields[11].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[11].valueGetter({});
      expect(validData).toBe("Hello Test Message");
      expect(invalidData).toBe("");
    });
    it("employeeId", ()=>{
      const validData = phoneNumberFields[12].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[12].valueGetter({});
      expect(validData).toBe("n1234567");
      expect(invalidData).toBe("");
    });
    it("accountManager", ()=>{
      const validData = phoneNumberFields[13].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[13].valueGetter({});
      expect(validData).toBe("test accountManager");
      expect(invalidData).toBe("");
    });
    it("affinityVDN", ()=>{
      const validData = phoneNumberFields[14].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[14].valueGetter({});
      expect(validData).toBe("test affinityVDN");
      expect(invalidData).toBe("");
    });
    it("callTypeDescription", ()=>{
      const validData = phoneNumberFields[15].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[15].valueGetter({});
      expect(validData).toBe("test callTypeDescription");
      expect(invalidData).toBe("");
    });
    it("transferCode", ()=>{
      const validData = phoneNumberFields[16].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[16].valueGetter({});
      expect(validData).toBe("test transferCode");
      expect(invalidData).toBe("");
    });
    it("internetPlacement", ()=>{
      const validData = phoneNumberFields[17].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[17].valueGetter({});
      expect(validData).toBe("test internetPlacement");
      expect(invalidData).toBe("");
    });
    it("callDetails1", ()=>{
      const validData = phoneNumberFields[18].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[18].valueGetter({});
      expect(validData).toBe("test callDetails1");
      expect(invalidData).toBe("");
    });
    it("callDetails2", ()=>{
      const validData = phoneNumberFields[19].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[19].valueGetter({});
      expect(validData).toBe("test callDetails2");
      expect(invalidData).toBe("");
    });
    it("lineOfBusiness", ()=>{
      const validData = phoneNumberFields[20].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[20].valueGetter({});
      expect(validData).toBe("test lineOfBusiness");
      expect(invalidData).toBe("");
    });
    it("marketingChannel", ()=>{
      const validData = phoneNumberFields[21].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[21].valueGetter({});
      expect(validData).toBe("test marketingChannel");
      expect(invalidData).toBe("");
    });
    it("whisper", ()=>{
      const validData = phoneNumberFields[22].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[22].valueGetter({});
      expect(validData).toBe("test whisper");
      expect(invalidData).toBe("");
    });
    it("requestID", ()=>{
      const validData = phoneNumberFields[23].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[23].valueGetter({});
      expect(validData).toBe("test requestID");
      expect(invalidData).toBe("");
    });
    it("userDestination", ()=>{
      const validData = phoneNumberFields[24].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[24].valueGetter({});
      expect(validData).toBe("test userDestination");
      expect(invalidData).toBe("");
    });
    it("rangeIndicator", ()=>{
      const validData = phoneNumberFields[25].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[25].valueGetter({});
      expect(validData).toBe("test rangeIndicator");
      expect(invalidData).toBe("");
    });
    it("callIntent", ()=>{
      const validData = phoneNumberFields[26].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[26].valueGetter({});
      expect(validData).toBe("test callIntent");
      expect(invalidData).toBe("");
    });
    it("officeNumbers", ()=>{
      const validData = phoneNumberFields[27].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[27].valueGetter({});
      expect(validData).toEqual(["#2710"]);
      expect(invalidData).toEqual([]);
    });
    it("tfnRoutingGroup", ()=>{
      const validData = phoneNumberFields[28].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[28].valueGetter({});
      expect(validData).toBe("Core");
      expect(invalidData).toBe("");
    });
    it("predictiveCaller", ()=>{
      const validData = phoneNumberFields[29].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[29].valueGetter({});
      expect(validData).toBe(true);
      expect(invalidData).toBe(false);
    });
    it("callFlowType", ()=>{
      const validData = phoneNumberFields[30].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[30].valueGetter({});
      expect(validData).toBe(validFlowData.callFlowType);
      expect(invalidData).toBe("");
    });
    it("callFlowName", ()=>{
      const validData = phoneNumberFields[31].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[31].valueGetter({});
      expect(validData).toBe(validFlowData.callFlowName);
      expect(invalidData).toBe("");
    });
    it("nextActionId", ()=>{
      const validData = phoneNumberFields[32].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[32].valueGetter({});
      expect(validData).toBe(validFlowData.nextActionId);
      expect(invalidData).toBe("");
    });
    it("nextActionType", ()=>{
      const validData = phoneNumberFields[33].valueGetter(validFlowData);
      const invalidData = phoneNumberFields[33].valueGetter({});
      expect(validData).toBe(validFlowData.nextActionType);
      expect(invalidData).toBe("");
    });
  });
  describe("dynamicFieldConditionCheck",()=>{
    it("accountManager",()=>{
      const isFiledIncluded = phoneNumberFields[13].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("affinityVDN",()=>{
      const isFiledIncluded = phoneNumberFields[14].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("transferCode",()=>{
      const isFiledIncluded = phoneNumberFields[16].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("internetPlacement",()=>{
      const isFiledIncluded = phoneNumberFields[17].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("callDetails1",()=>{
      const isFiledIncluded = phoneNumberFields[18].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("callDetails2",()=>{
      const isFiledIncluded = phoneNumberFields[19].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("lineOfBusiness",()=>{
      const isFiledIncluded = phoneNumberFields[20].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("marketingChannel",()=>{
      const isFiledIncluded = phoneNumberFields[21].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("whisper",()=>{
      const isFiledIncluded = phoneNumberFields[22].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("requestID",()=>{
      const isFiledIncluded = phoneNumberFields[23].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("rangeIndicator",()=>{
      const isFiledIncluded = phoneNumberFields[25].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("userDestination",()=>{
      const isFiledIncluded = phoneNumberFields[24].dynamicFieldConditionCheck(DIDFlowData);
      expect(isFiledIncluded).toBeTruthy();
    });
    it("predictiveCaller", ()=>{
      const isFiledIncluded = phoneNumberFields[29].dynamicFieldConditionCheck(drcFlowData);
      expect(isFiledIncluded).toBe(true);
    });
  });
});
