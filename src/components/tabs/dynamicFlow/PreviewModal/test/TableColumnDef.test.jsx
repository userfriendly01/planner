import { TableGridColumnDef } from "../TableColumnDef";
import {
  render, setupMockedComponents
} from "testUtils";
import {
  Tooltip
} from "@mui/material";

jest.mock("@mui/material",()=>({
  Tooltip: jest.fn()
}));

export const validFlowData = {
  actionId: "LSC1GREETING",
  actionType: "ANNOUNCEMENT",
  allowBargeIn: false,
  callFlowName: "LSC",
  errors: "* no errors",
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

describe("<TableGridColumnDef />", () => {

  it("has 14 columns", () => {
    expect(TableGridColumnDef.length).toBe(14);
  });

  describe("valueGetter", ()=>{
    it("languageOffer", () => {
      expect(TableGridColumnDef[1].valueGetter({ row: { errors: "* no errors" }})).toBe("* no errors");
      expect(TableGridColumnDef[1].valueGetter({ row: {}})).toBe("");
    });

    it("dataRequests", () => {
      expect(TableGridColumnDef[2].valueGetter({ row: { actionType: "Classify" }})).toBe("Classify");
      expect(TableGridColumnDef[2].valueGetter({ row: {}})).toBe("");
    });

  });
  describe("renderCell", ()=>{
    beforeEach(()=>{
      jest.clearAllMocks();
      setupMockedComponents({
        Tooltip
      });
    });
    it("Action ID", ()=>{
      const renderedCell = render(TableGridColumnDef[1].renderCell({ row: { actionID: "LSC1MENU" }}));
      expect(renderedCell.findByDisplayValue("LSC1MENU")).toBeTruthy();
    });
    it("Errors", ()=>{
      const renderedCell = render(TableGridColumnDef[2].renderCell({ row: { errors: "None" }}));
      expect(renderedCell.findByDisplayValue("None")).toBeTruthy();
    });
    it("Action Type", ()=>{
      const renderedCell = render(TableGridColumnDef[3].renderCell({ row: { actionType: "X" }}));
      expect(renderedCell.findByDisplayValue("X")).toBeTruthy();
    });
    it("Allow Barge-in", ()=>{
      const renderedCell = render(TableGridColumnDef[4].renderCell({ row: { allowBargeIn: true }}));
      expect(renderedCell.findByDisplayValue("TRUE")).toBeTruthy();
    });
    it("Callflow Name", ()=>{
      const renderedCell = render(TableGridColumnDef[5].renderCell({ row: { callFlowName: "LSC" }}));
      expect(renderedCell.findByDisplayValue("LSC")).toBeTruthy();
    });
    it("Finish on Key", ()=>{
      const renderedCell = render(TableGridColumnDef[6].renderCell({ row: { finishOnKey: "#" }}));
      expect(renderedCell.findByDisplayValue("#")).toBeTruthy();
    });
    it("Max Digits", ()=>{
      const renderedCell = render(TableGridColumnDef[7].renderCell({ row: { maxDigits: 3 }}));
      expect(renderedCell.findByDisplayValue("3")).toBeTruthy();
    });
    it("Min Digits", ()=>{
      const renderedCell = render(TableGridColumnDef[8].renderCell({ row: { minDigits: 1 }}));
      expect(renderedCell.findByDisplayValue("1")).toBeTruthy();
    });
    it("Next Action", ()=>{
      const renderedCell = render(TableGridColumnDef[9].renderCell({ row: { nextActionId: "LSC1MENU" }}));
      expect(renderedCell.findByDisplayValue("LSC1MENU")).toBeTruthy();
    });
    it("Next Action Type", ()=>{
      const renderedCell = render(TableGridColumnDef[10].renderCell({ row: { nextActionType: "MENU" }}));
      expect(renderedCell.findByDisplayValue("MENU")).toBeTruthy();
    });
    it("Options", ()=>{
      const renderedCell = render(TableGridColumnDef[11].renderCell({ row: { content: { options: ["Option 1", "Option 2"]}}}));
      expect(renderedCell.findByDisplayValue("Option 1")).toBeTruthy();
    });
    it("Repeat", ()=>{
      const renderedCell = render(TableGridColumnDef[12].renderCell({ row: { repeat: { "some": "data" }}}));
      expect(renderedCell.findByDisplayValue("some")).toBeTruthy();
    });
    it("Speech", ()=>{
      const renderedCell = render(TableGridColumnDef[13].renderCell({ row: { speech: "Hello there!" }}));
      expect(renderedCell.findByDisplayValue("Hello there!")).toBeTruthy();
    });
    it("Timeout", ()=>{
      const renderedCell = render(TableGridColumnDef[14].renderCell({ row: { timeout: 7 }}));
      expect(renderedCell.findByDisplayValue("7")).toBeTruthy();
    });
  });
  describe("valueSetter", ()=>{
    it("languageOffer", ()=>{
      expect(TableGridColumnDef[1].valueSetter({
        row: { ...validFlowData },
        value: "TEST_ERROR"
      }).errors).toBe("TEST_ERROR");
      expect(TableGridColumnDef[1].valueSetter({ row: {}}).errors).toBe(undefined);
    });
    it("dataRequests", ()=>{
      expect(TableGridColumnDef[2].valueSetter({
        row: { ...validFlowData },
        value: "TEST_TYPE"
      }).actionType).toBe("TEST_TYPE");
      expect(TableGridColumnDef[2].valueSetter({ row: {}}).actionType).toBe(undefined);
    });
  });

});
