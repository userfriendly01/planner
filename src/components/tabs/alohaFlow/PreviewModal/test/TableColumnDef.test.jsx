import { TableGridColumnDef } from "../TableColumnDef";
import { render } from "testUtils";

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

describe("<TableGridColumnDef />", () => {

  it("has 30 columns", () => {
    expect(TableGridColumnDef.length).toBe(31);
  });

  describe("valueGetter", ()=>{
    it("languageOffer", () => {
      expect(TableGridColumnDef[5].valueGetter({ row: { content: { languageOffer: "en-US" }}})).toBe("en-US");
      expect(TableGridColumnDef[5].valueGetter({ row: {}})).toBe("");
    });

    it("dataRequests", () => {
      expect(TableGridColumnDef[6].valueGetter({ row: { content: { dataRequests: "Classify" }}})).toBe("Classify");
      expect(TableGridColumnDef[6].valueGetter({ row: {}})).toBe("");
    });

    it("callerType", () => {
      expect(TableGridColumnDef[7].valueGetter({ row: { content: { callerType: "Customer" }}})).toBe("Customer");
      expect(TableGridColumnDef[7].valueGetter({ row: {}})).toBe("");
    });

    it("transferNumber", () => {
      expect(TableGridColumnDef[8].valueGetter({ row: { content: { transferNumber: "123" }}})).toBe("123");
      expect(TableGridColumnDef[8].valueGetter({ row: {}})).toBe("");
    });

    it("callFlowRoute", () => {
      expect(TableGridColumnDef[9].valueGetter({ row: { content: { callFlowRoute: "999" }}})).toBe("999");
      expect(TableGridColumnDef[9].valueGetter({ row: {}})).toBe("");
    });

    it("greetingMessages", () => {
      expect(TableGridColumnDef[10].valueGetter({ row: { content: { greetingMessages: "hi" }}})).toBe("hi");
      expect(TableGridColumnDef[10].valueGetter({ row: {}})).toBe("");
    });
    it("callIntent", () => {
      expect(TableGridColumnDef[29].valueGetter({ row: { content: { callIntent: "TEST_CALL_INTENT" }}})).toBe("TEST_CALL_INTENT");
      expect(TableGridColumnDef[29].valueGetter({ row: {}})).toBe("");
    });
    it("officeNumbers", () => {
      expect(TableGridColumnDef[30].valueGetter({ row: { content: { officeNumbers: ["#9999"]}}})).toEqual(["#9999"]);
      expect(TableGridColumnDef[30].valueGetter({ row: {}})).toEqual([]);
    });
  });
  describe("renderCell", ()=>{
    it("Dialed Description", ()=>{
      const renderedCell = render(TableGridColumnDef[1].renderCell({ row: { dialedDescription: "Test Dialed Description" }}));
      expect(renderedCell.findByDisplayValue("Test Dialed Description")).toBeTruthy();
    });
    it("callFlowTemplate", ()=>{
      const renderedCell = render(TableGridColumnDef[2].renderCell({ row: { dialedDescription: "Test Call Flow Template" }}));
      expect(renderedCell.findByDisplayValue("Test Call Flow Template")).toBeTruthy();
    });
    it("brand", ()=>{
      const renderedCell = render(TableGridColumnDef[4].renderCell({ row: { dialedDescription: "Test Brand" }}));
      expect(renderedCell.findByDisplayValue("Test Brand")).toBeTruthy();
    });
    it("greetingMessages", ()=>{
      const renderedCell = render(TableGridColumnDef[10].renderCell({ row: { dialedDescription: "Test Greeting" }}));
      expect(renderedCell.findByDisplayValue("Test Greeting")).toBeTruthy();
    });
    it("accountManager", ()=>{
      const renderedCell = render(TableGridColumnDef[16].renderCell({ row: { dialedDescription: "Test Account Manager" }}));
      expect(renderedCell.findByDisplayValue("Test Account Manager")).toBeTruthy();
    });
    it("internetPlacement", ()=>{
      const renderedCell = render(TableGridColumnDef[19].renderCell({ row: { dialedDescription: "Test Internet Placement" }}));
      expect(renderedCell.findByDisplayValue("Test Internet Placement")).toBeTruthy();
    });
    it("callDetails1", ()=>{
      const renderedCell = render(TableGridColumnDef[20].renderCell({ row: { dialedDescription: "Test Call Details1" }}));
      expect(renderedCell.findByDisplayValue("Test Call Details1")).toBeTruthy();
    });
    it("callDetails2", ()=>{
      const renderedCell = render(TableGridColumnDef[21].renderCell({ row: { dialedDescription: "Test Call Details2" }}));
      expect(renderedCell.findByDisplayValue("Test Call Details1")).toBeTruthy();
    });
    it("callTypeDescription", ()=>{
      const renderedCell = render(TableGridColumnDef[22].renderCell({ row: { dialedDescription: "Test Call Type Description" }}));
      expect(renderedCell.findByDisplayValue("Test Call Type Description")).toBeTruthy();
    });
    it("officeNumbers", ()=>{
      const renderedCell = render(TableGridColumnDef[30].renderCell({ row: { officeNumbers: ["#9999"]}}));
      expect(renderedCell.findByDisplayValue("#9999")).toBeTruthy();
    });
  });
  describe("valueSetter", ()=>{
    it("languageOffer", ()=>{
      expect(TableGridColumnDef[5].valueSetter({
        row: { ...validFlowData },
        value: "TEST_LANG"
      }).content.languageOffer).toBe("TEST_LANG");
      expect(TableGridColumnDef[5].valueSetter({ row: {}}).content.languageOffer).toBe(undefined);
    });
    it("dataRequests", ()=>{
      expect(TableGridColumnDef[6].valueSetter({
        row: { ...validFlowData },
        value: "TEST_DR"
      }).content.dataRequests).toBe("TEST_DR");
      expect(TableGridColumnDef[6].valueSetter({ row: {}}).content.dataRequests).toBe(undefined);
    });
    it("callerType", ()=>{
      expect(TableGridColumnDef[7].valueSetter({
        row: { ...validFlowData },
        value: "TEST_CT"
      }).content.callerType).toBe("TEST_CT");
      expect(TableGridColumnDef[7].valueSetter({ row: {}}).content.callerType).toBe(undefined);
    });
    it("transferNumber", ()=>{
      expect(TableGridColumnDef[8].valueSetter({
        row: { ...validFlowData },
        value: "TEST_TN"
      }).content.transferNumber).toBe("TEST_TN");
      expect(TableGridColumnDef[8].valueSetter({ row: {}}).content.transferNumber).toBe(undefined);
    });
    it("callFlowRoute", ()=>{
      expect(TableGridColumnDef[9].valueSetter({
        row: { ...validFlowData },
        value: "TEST_CFR"
      }).content.callFlowRoute).toBe("TEST_CFR");
      expect(TableGridColumnDef[9].valueSetter({ row: {}}).content.callFlowRoute).toBe(undefined);
    });
    it("greetingMessages", ()=>{
      expect(TableGridColumnDef[10].valueSetter({
        row: { ...validFlowData },
        value: "TEST_GM"
      }).content.greetingMessages).toBe("TEST_GM");
      expect(TableGridColumnDef[10].valueSetter({ row: {}}).content.greetingMessages).toBe(undefined);
    });
    it("callIntent", ()=>{
      expect(TableGridColumnDef[29].valueSetter({
        row: { ...validFlowData },
        value: "TEST_CI"
      }).content.callIntent).toBe("TEST_CI");
      expect(TableGridColumnDef[29].valueSetter({ row: {}}).content.callIntent).toBe(undefined);
    });
  });

});
