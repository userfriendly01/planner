import FlowGridColumnDef from "../GridColumnDef";
import { render } from "testUtils";

describe("<FlowGridColumnDef />", () => {

  it("has 35 columns", () => {
    expect(FlowGridColumnDef.length).toBe(35);
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

    it("transferDestination", () => {
      expect(FlowGridColumnDef[8].valueGetter({ row: { content: { transferDestination: "123" }}})).toBe("123");
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
    it("callIntent", () => {
      expect(FlowGridColumnDef[27].valueGetter({ row: { content: { callIntent: "TEST_CALL_INTENT" }}})).toBe("TEST_CALL_INTENT");
      expect(FlowGridColumnDef[27].valueGetter({ row: {}})).toBe("");
    });
    it("officeNumbers", () => {
      expect(FlowGridColumnDef[28].valueGetter({ row: { content: { officeNumbers: ["#2710"]}}})).toEqual(["#2710"]);
      expect(FlowGridColumnDef[28].valueGetter({ row: {}})).toEqual([]);
    });
  });
  describe("renderCell", ()=>{
    it("Dialed Description", ()=>{
      const renderedCell = render(FlowGridColumnDef[1].renderCell({ row: { dialedDescription: "Test Dialed Description" }}));
      expect(renderedCell.findByDisplayValue("Test Dialed Description")).toBeTruthy();
    });
    it("callFlowTemplate", ()=>{
      const renderedCell = render(FlowGridColumnDef[2].renderCell({ row: { callFlowTemplate: "Test Call Flow Template" }}));
      expect(renderedCell.findByDisplayValue("Test Call Flow Template")).toBeTruthy();
    });
    it("brand", ()=>{
      const renderedCell = render(FlowGridColumnDef[4].renderCell({ row: { brand: "Test Brand" }}));
      expect(renderedCell.findByDisplayValue("Test Brand")).toBeTruthy();
    });
    it("greetingMessages", ()=>{
      const renderedCell = render(FlowGridColumnDef[10].renderCell({ row: { greetingMessages: "Test Greeting" }}));
      expect(renderedCell.findByDisplayValue("Test Greeting")).toBeTruthy();
    });
    it("accountManager", ()=>{
      const renderedCell = render(FlowGridColumnDef[15].renderCell({ row: { accountManager: "Moe" }}));
      expect(renderedCell.findByDisplayValue("Moe")).toBeTruthy();

      const renderedCell2 = render(FlowGridColumnDef[15].renderCell({ row: { }}));
      expect(renderedCell2.findByDisplayValue("")).toBeTruthy();
    });
    it("internetPlacement", ()=>{
      const renderedCell = render(FlowGridColumnDef[18].renderCell({ row: { internetPlacement: "Yes" }}));
      expect(renderedCell.findByDisplayValue("Yes")).toBeTruthy();

      const renderedCell2 = render(FlowGridColumnDef[18].renderCell({ row: { }}));
      expect(renderedCell2.findByDisplayValue("")).toBeTruthy();
    });
    it("callDetails1", ()=>{
      const renderedCell = render(FlowGridColumnDef[19].renderCell({ row: { callDetails1: "Test Call Details1" }}));
      expect(renderedCell.findByDisplayValue("Test Call Details1")).toBeTruthy();

      const renderedCell2 = render(FlowGridColumnDef[19].renderCell({ row: { }}));
      expect(renderedCell2.findByDisplayValue("")).toBeTruthy();
    });
    it("callDetails2", ()=>{
      const renderedCell = render(FlowGridColumnDef[20].renderCell({ row: { callDetails2: "Test Call Details2" }}));
      expect(renderedCell.findByDisplayValue("Test Call Details1")).toBeTruthy();

      const renderedCell2 = render(FlowGridColumnDef[20].renderCell({ row: { }}));
      expect(renderedCell2.findByDisplayValue("")).toBeTruthy();
    });
    it("callTypeDescription", ()=>{
      const renderedCell = render(FlowGridColumnDef[21].renderCell({ row: { callTypeDescription: "Test Call Type Description" }}));
      expect(renderedCell.findByDisplayValue("Test Call Type Description")).toBeTruthy();

      const renderedCell2 = render(FlowGridColumnDef[21].renderCell({ row: { }}));
      expect(renderedCell2.findByDisplayValue("")).toBeTruthy();
    });
    it("officeNumbers", ()=>{
      const renderedCell = render(FlowGridColumnDef[28].renderCell({ row: { content: { officeNumbers: ["#9999"]}}}));
      expect(renderedCell.findByDisplayValue("#9999")).toBeTruthy();
      expect(renderedCell.findByLabelText("...")).toBeTruthy();

      render(FlowGridColumnDef[28].renderCell({ row: { content: { officeNumbers: []}}}));
      render(FlowGridColumnDef[28].renderCell({ row: { }}));


    });
    it("tfnRoutingGroup", ()=>{
      const renderedCell = render(FlowGridColumnDef[29].renderCell({ row: { tfnRoutingGroup: "Core" }}));
      expect(renderedCell.findByDisplayValue("Core")).toBeTruthy();
    });
    it("predictiveCaller", ()=>{
      const renderedCell = render(FlowGridColumnDef[30].renderCell({ row: { predictiveCaller: true }}));
      expect(renderedCell.container).toBeInTheDocument();

      const renderedCell2 = render(FlowGridColumnDef[30].renderCell({ row: { }}));
      expect(renderedCell2.container).toBeInTheDocument();

    });
    it("callFlowName", ()=>{
      const renderedCell = render(FlowGridColumnDef[31].renderCell({ row: { callFlowName: "LSC" }}));
      expect(renderedCell.container).toBeInTheDocument();
    });
    it("callFlowType", ()=>{
      const renderedCell = render(FlowGridColumnDef[32].renderCell({ row: { callFlowType: "DTMF" }}));
      expect(renderedCell.container).toBeInTheDocument();
    });
  });
});
