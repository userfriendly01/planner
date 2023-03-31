import FlowGridColumnDef from "../GridColumnDef";
import { render } from "testUtils";

describe("<FlowGridColumnDef />", () => {

  it("has 16 columns", () => {
    expect(FlowGridColumnDef.length).toBe(28);
  });

  describe("valueGetter", ()=>{
    it("languageOffer", () => {
      expect(FlowGridColumnDef[5].valueGetter({ row: { content: { languageOffer: "en-US" }}})).toBe("en-US");
      expect(FlowGridColumnDef[5].valueGetter({ row: {}})).toBe("");
    });

    it("dataRequests", () => {
      expect(FlowGridColumnDef[6].valueGetter({ row: { content: { dataRequests: "Classify" }}})).toBe("Classify");
      expect(FlowGridColumnDef[6].valueGetter({ row: {}})).toBe("");
    });

    it("callerType", () => {
      expect(FlowGridColumnDef[7].valueGetter({ row: { content: { callerType: "Customer" }}})).toBe("Customer");
      expect(FlowGridColumnDef[7].valueGetter({ row: {}})).toBe("");
    });

    it("transferNumber", () => {
      expect(FlowGridColumnDef[8].valueGetter({ row: { content: { transferNumber: "123" }}})).toBe("123");
      expect(FlowGridColumnDef[8].valueGetter({ row: {}})).toBe("");
    });

    it("callFlowRoute", () => {
      expect(FlowGridColumnDef[9].valueGetter({ row: { content: { callFlowRoute: "999" }}})).toBe("999");
      expect(FlowGridColumnDef[9].valueGetter({ row: {}})).toBe("");
    });

    it("greetingMessages", () => {
      expect(FlowGridColumnDef[10].valueGetter({ row: { content: { greetingMessages: "hi" }}})).toBe("hi");
      expect(FlowGridColumnDef[10].valueGetter({ row: {}})).toBe("");
    });
  });
  describe("renderCell", ()=>{
    it("Dialed Description", ()=>{
      const renderedCell = render(FlowGridColumnDef[1].renderCell({ row: { dialedDescription: "Test Dialed Description" }}));
      expect(renderedCell.findByDisplayValue("Test Dialed Description")).toBeTruthy();
    });
    it("callFlowTemplate", ()=>{
      const renderedCell = render(FlowGridColumnDef[2].renderCell({ row: { dialedDescription: "Test Call Flow Template" }}));
      expect(renderedCell.findByDisplayValue("Test Call Flow Template")).toBeTruthy();
    });
    it("brand", ()=>{
      const renderedCell = render(FlowGridColumnDef[4].renderCell({ row: { dialedDescription: "Test Brand" }}));
      expect(renderedCell.findByDisplayValue("Test Brand")).toBeTruthy();
    });
    it("greetingMessages", ()=>{
      const renderedCell = render(FlowGridColumnDef[10].renderCell({ row: { dialedDescription: "Test Greeting" }}));
      expect(renderedCell.findByDisplayValue("Test Greeting")).toBeTruthy();
    });
    it("accountManager", ()=>{
      const renderedCell = render(FlowGridColumnDef[16].renderCell({ row: { dialedDescription: "Test Account Manager" }}));
      expect(renderedCell.findByDisplayValue("Test Account Manager")).toBeTruthy();
    });
    it("internetPlacement", ()=>{
      const renderedCell = render(FlowGridColumnDef[19].renderCell({ row: { dialedDescription: "Test Internet Placement" }}));
      expect(renderedCell.findByDisplayValue("Test Internet Placement")).toBeTruthy();
    });
    it("callDetails1", ()=>{
      const renderedCell = render(FlowGridColumnDef[20].renderCell({ row: { dialedDescription: "Test Call Details1" }}));
      expect(renderedCell.findByDisplayValue("Test Call Details1")).toBeTruthy();
    });
    it("callDetails2", ()=>{
      const renderedCell = render(FlowGridColumnDef[21].renderCell({ row: { dialedDescription: "Test Call Details2" }}));
      expect(renderedCell.findByDisplayValue("Test Call Details1")).toBeTruthy();
    });
    it("callTypeDescription", ()=>{
      const renderedCell = render(FlowGridColumnDef[22].renderCell({ row: { dialedDescription: "Test Call Type Description" }}));
      expect(renderedCell.findByDisplayValue("Test Call Type Description")).toBeTruthy();
    });
  });

});
