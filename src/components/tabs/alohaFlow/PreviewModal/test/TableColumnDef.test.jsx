import { TableGridColumnDef } from "../TableColumnDef";
import {
  render, setupMockedComponents
} from "testUtils";
import {
  Tooltip, Switch, Chip
} from "@mui/material";

jest.mock("@mui/material",()=>({
  Tooltip: jest.fn(),
  Switch: jest.fn(),
  Chip: jest.fn()
}));

const validFlowData = {
  id: 1,
  pkey: "12345",
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
    transferDestination: "123456789"
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
  transferCode: "test transferCode",
  type: "DID",
  whisper: "test whisper",
  tfnRoutingGroup: "Core"
};

describe("<TableGridColumnDef />", () => {

  it("has 34 columns", () => {
    expect(TableGridColumnDef.length).toBe(34);
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

    it("transferDestination", () => {
      expect(TableGridColumnDef[8].valueGetter({ row: { content: { transferDestination: "123" }}})).toBe("123");
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
    it("predictiveCaller", () => {
      expect(TableGridColumnDef[32].valueGetter({ row: { predictiveCaller: true }})).toBe(true);
      expect(TableGridColumnDef[32].valueGetter({ row: {}})).toEqual(false);
    });
    it("callFlowName", () => {
      expect(TableGridColumnDef[33].valueGetter({ row: { callFlowName: "Self Service" }})).toBe("Self Service");
      expect(TableGridColumnDef[33].valueGetter({ row: {}})).toEqual("");
    });
    it("callFlowType", () => {
      expect(TableGridColumnDef[34].valueGetter({ row: { callFlowType: "LSC" }})).toBe("LSC");
      expect(TableGridColumnDef[34].valueGetter({ row: {}})).toEqual("");
    });
    it("nextActionId", () => {
      expect(TableGridColumnDef[35].valueGetter({ row: { nextActionId: "next333" }})).toBe("next333");
      expect(TableGridColumnDef[35].valueGetter({ row: {}})).toEqual("");
    });
    it("nextActionType", () => {
      expect(TableGridColumnDef[35].valueGetter({ row: { nextActionType: "MENU" }})).toBe("MENU");
      expect(TableGridColumnDef[35].valueGetter({ row: {}})).toEqual("");
    });
  });
  describe("renderCell", ()=>{
    beforeEach(()=>{
      jest.clearAllMocks();
      setupMockedComponents({
        Tooltip,
        Switch,
        Chip
      });
    });
    it("Dialed Description", ()=>{
      const renderedCell = render(TableGridColumnDef[1].renderCell({ row: { dialedDescription: "Test Dialed Description" }}));
      expect(renderedCell.findByDisplayValue("Test Dialed Description")).toBeTruthy();
    });
    it("callFlowTemplate", ()=>{
      const renderedCell = render(TableGridColumnDef[2].renderCell({ row: { callFlowTemplate: "Test Call Flow Template" }}));
      expect(renderedCell.findByDisplayValue("Test Call Flow Template")).toBeTruthy();
    });
    it("brand", ()=>{
      const renderedCell = render(TableGridColumnDef[4].renderCell({ row: { brand: "Test Brand" }}));
      expect(renderedCell.findByDisplayValue("Test Brand")).toBeTruthy();
    });
    it("greetingMessages", ()=>{
      const renderedCell = render(TableGridColumnDef[10].renderCell({ row: { greetingMessages: "Test Greeting" }}));
      expect(renderedCell.findByDisplayValue("Test Greeting")).toBeTruthy();
    });
    it("accountManager", ()=>{
      const renderedCell = render(TableGridColumnDef[16].renderCell({ row: { accountManager: "Test Account Manager" }}));
      expect(renderedCell.findByDisplayValue("Test Account Manager")).toBeTruthy();
    });
    it("internetPlacement", ()=>{
      const renderedCell = render(TableGridColumnDef[19].renderCell({ row: { internetPlacement: "Test Internet Placement" }}));
      expect(renderedCell.findByDisplayValue("Test Internet Placement")).toBeTruthy();
    });
    it("callDetails1", ()=>{
      const renderedCell = render(TableGridColumnDef[20].renderCell({ row: { callDetails1: "Test Call Details1" }}));
      expect(renderedCell.findByDisplayValue("Test Call Details1")).toBeTruthy();
    });
    it("callDetails2", ()=>{
      const renderedCell = render(TableGridColumnDef[21].renderCell({ row: { callDetails2: "Test Call Details2" }}));
      expect(renderedCell.findByDisplayValue("Test Call Details2")).toBeTruthy();
    });
    it("callTypeDescription", ()=>{
      const renderedCell = render(TableGridColumnDef[22].renderCell({ row: { callTypeDescription: "Test Call Type Description" }}));
      expect(renderedCell.findByDisplayValue("Test Call Type Description")).toBeTruthy();
    });
    it("officeNumbers", ()=>{
      const renderedCell = render(TableGridColumnDef[30].renderCell({ row: { content: { officeNumbers: ["#9999"]}}}));
      expect(renderedCell.findByDisplayValue("#9999")).toBeTruthy();
    });
    it("tfnRoutingGroup", ()=>{
      const renderedCell = render(TableGridColumnDef[31].renderCell({ row: { tfnRoutingGroup: "Core" }}));
      expect(renderedCell.findByDisplayValue("Core")).toBeTruthy();
    });
    it("predictiveCaller", ()=>{
      const renderedCell = render(TableGridColumnDef[32].renderCell({ row: { predictiveCaller: true }}));
      expect(renderedCell.container).toBeInTheDocument();
    });
    it("callFlowName", ()=>{
      const renderedCell = render(TableGridColumnDef[33].renderCell({ row: { callFlowName: "LSC" }}));
      expect(renderedCell.container).toBeInTheDocument();
    });
    it("callFlowType", ()=>{
      const renderedCell = render(TableGridColumnDef[34].renderCell({ row: { callFlowType: "Self Service" }}));
      expect(renderedCell.container).toBeInTheDocument();
    });
    it("nextActionId", ()=>{
      const renderedCell = render(TableGridColumnDef[35].renderCell({ row: { nextActionId: "Self Service" }}));
      expect(renderedCell.container).toBeInTheDocument();
    });
    it("nextActionType", ()=>{
      const renderedCell = render(TableGridColumnDef[36].renderCell({ row: { nextActionType: "Self Service" }}));
      expect(renderedCell.container).toBeInTheDocument();
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
    it("transferDestination", ()=>{
      expect(TableGridColumnDef[8].valueSetter({
        row: { ...validFlowData },
        value: "TEST_TN"
      }).content.transferDestination).toBe("TEST_TN");
      expect(TableGridColumnDef[8].valueSetter({ row: {}}).content.transferDestination).toBe(undefined);
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
    it("officeNumbers", ()=>{
      expect(TableGridColumnDef[30].valueSetter({
        row: { ...validFlowData },
        value: ["9999"]
      }).content.officeNumbers).toEqual(["9999"]);
      expect(TableGridColumnDef[30].valueSetter({ row: {}}).content.officeNumbers).toEqual([]);
    });
  });

});
