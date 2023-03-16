import FlowGridColumnDef from "../GridColumnDef";

describe("<FlowGridColumnDef />", () => {

  it("has 15 columns", () => {
    expect(FlowGridColumnDef.length).toBe(15);
  });

  it("languageOffer valueGetter", () => {
    expect(FlowGridColumnDef[5].valueGetter({ row: { content: { languageOffer: "en-US" }}})).toBe("en-US");
    expect(FlowGridColumnDef[5].valueGetter({ row: {}})).toBe("");
  });

  it("languageOffer dataRequests", () => {
    expect(FlowGridColumnDef[6].valueGetter({ row: { content: { dataRequests: "Classify" }}})).toBe("Classify");
    expect(FlowGridColumnDef[6].valueGetter({ row: {}})).toBe("");
  });

  it("languageOffer callerType", () => {
    expect(FlowGridColumnDef[7].valueGetter({ row: { content: { callerType: "Customer" }}})).toBe("Customer");
    expect(FlowGridColumnDef[7].valueGetter({ row: {}})).toBe("");
  });

  it("languageOffer transferNumber", () => {
    expect(FlowGridColumnDef[8].valueGetter({ row: { content: { transferNumber: "123" }}})).toBe("123");
    expect(FlowGridColumnDef[8].valueGetter({ row: {}})).toBe("");
  });

  it("languageOffer callFlowRoute", () => {
    expect(FlowGridColumnDef[9].valueGetter({ row: { content: { callFlowRoute: "999" }}})).toBe("999");
    expect(FlowGridColumnDef[9].valueGetter({ row: {}})).toBe("");
  });

  it("languageOffer greetingMessages", () => {
    expect(FlowGridColumnDef[10].valueGetter({ row: { content: { greetingMessages: "hi" }}})).toBe("hi");
    expect(FlowGridColumnDef[10].valueGetter({ row: {}})).toBe("");
  });

});