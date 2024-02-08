import DynamicGridColumnDef from "../GridColumnDef";
import { render } from "testUtils";

describe("<FlowGridColumnDef />", () => {

  it("has 34 columns", () => {
    expect(DynamicGridColumnDef.length).toBe(34);
  });

  describe("valueGetter", ()=>{
    it("languageOffer", () => {
      expect(DynamicGridColumnDef[5].valueGetter({ row: { content: { languageOffer: "en-US" }}})).toBe("en-US");
      expect(DynamicGridColumnDef[5].valueGetter({ row: {}})).toBe("");
    });

    it("dataRequests", () => {
      expect(DynamicGridColumnDef[6].valueGetter({ row: { content: { dataRequests: "Classify" }}})).toBe("Classify");
      expect(DynamicGridColumnDef[6].valueGetter({ row: {}})).toBe("");
    });

    it("callerType", () => {
      expect(DynamicGridColumnDef[7].valueGetter({ row: { content: { callerType: "Customer" }}})).toBe("Customer");
      expect(DynamicGridColumnDef[7].valueGetter({ row: {}})).toBe("");
    });

    it("transferNumber", () => {
      expect(DynamicGridColumnDef[8].valueGetter({ row: { content: { transferNumber: "123" }}})).toBe("123");
      expect(DynamicGridColumnDef[8].valueGetter({ row: {}})).toBe("");
    });

    it("callFlowRoute", () => {
      expect(DynamicGridColumnDef[9].valueGetter({ row: { content: { callFlowRoute: "999" }}})).toBe("999");
      expect(DynamicGridColumnDef[9].valueGetter({ row: {}})).toBe("");
    });

    it("greetingMessages", () => {
      expect(DynamicGridColumnDef[10].valueGetter({ row: { content: { greetingMessages: "hi" }}})).toBe("hi");
      expect(DynamicGridColumnDef[10].valueGetter({ row: {}})).toBe("");
    });
    it("callIntent", () => {
      expect(DynamicGridColumnDef[29].valueGetter({ row: { content: { callIntent: "TEST_CALL_INTENT" }}})).toBe("TEST_CALL_INTENT");
      expect(DynamicGridColumnDef[29].valueGetter({ row: {}})).toBe("");
    });
    it("officeNumbers", () => {
      expect(DynamicGridColumnDef[30].valueGetter({ row: { content: { officeNumbers: ["#2710"]}}})).toEqual(["#2710"]);
      expect(DynamicGridColumnDef[30].valueGetter({ row: {}})).toEqual([]);
    });
  });
  describe("renderCell", ()=>{
    it("Dialed Description", ()=>{
      const renderedCell = render(DynamicGridColumnDef[1].renderCell({ row: { dialedDescription: "Test Dialed Description" }}));
      expect(renderedCell.findByDisplayValue("Test Dialed Description")).toBeTruthy();
    });
    it("callFlowTemplate", ()=>{
      const renderedCell = render(DynamicGridColumnDef[2].renderCell({ row: { callFlowTemplate: "Test Call Flow Template" }}));
      expect(renderedCell.findByDisplayValue("Test Call Flow Template")).toBeTruthy();
    });
    it("brand", ()=>{
      const renderedCell = render(DynamicGridColumnDef[4].renderCell({ row: { brand: "Test Brand" }}));
      expect(renderedCell.findByDisplayValue("Test Brand")).toBeTruthy();
    });
    it("greetingMessages", ()=>{
      const renderedCell = render(DynamicGridColumnDef[10].renderCell({ row: { greetingMessages: "Test Greeting" }}));
      expect(renderedCell.findByDisplayValue("Test Greeting")).toBeTruthy();
    });
    it("accountManager", ()=>{
      const renderedCell = render(DynamicGridColumnDef[16].renderCell({ row: { accountManager: "Test Account Manager" }}));
      expect(renderedCell.findByDisplayValue("Test Account Manager")).toBeTruthy();
    });
    it("internetPlacement", ()=>{
      const renderedCell = render(DynamicGridColumnDef[19].renderCell({ row: { internetPlacement: "Test Internet Placement" }}));
      expect(renderedCell.findByDisplayValue("Test Internet Placement")).toBeTruthy();
    });
    it("callDetails1", ()=>{
      const renderedCell = render(DynamicGridColumnDef[20].renderCell({ row: { callDetails1: "Test Call Details1" }}));
      expect(renderedCell.findByDisplayValue("Test Call Details1")).toBeTruthy();
    });
    it("callDetails2", ()=>{
      const renderedCell = render(DynamicGridColumnDef[21].renderCell({ row: { callDetails2: "Test Call Details2" }}));
      expect(renderedCell.findByDisplayValue("Test Call Details1")).toBeTruthy();
    });
    it("callTypeDescription", ()=>{
      const renderedCell = render(DynamicGridColumnDef[22].renderCell({ row: { callTypeDescription: "Test Call Type Description" }}));
      expect(renderedCell.findByDisplayValue("Test Call Type Description")).toBeTruthy();
    });
    it("officeNumbers", ()=>{
      const renderedCell = render(DynamicGridColumnDef[30].renderCell({ row: { content: { officeNumbers: ["#9999"]}}}));
      expect(renderedCell.findByDisplayValue("#9999")).toBeTruthy();
    });
    it("tfnRoutingGroup", ()=>{
      const renderedCell = render(DynamicGridColumnDef[31].renderCell({ row: { tfnRoutingGroup: "Core" }}));
      expect(renderedCell.findByDisplayValue("Core")).toBeTruthy();
    });
    it("predictiveCaller", ()=>{
      const renderedCell = render(DynamicGridColumnDef[32].renderCell({ row: { predictiveCaller: true }}));
      expect(renderedCell.container).toBeInTheDocument();
    });
    it("selfServiceIndicator", ()=>{
      const renderedCell = render(DynamicGridColumnDef[33].renderCell({ row: { selfServiceIndicator: true }}));
      expect(renderedCell.container).toBeInTheDocument();
    });
  });
});
