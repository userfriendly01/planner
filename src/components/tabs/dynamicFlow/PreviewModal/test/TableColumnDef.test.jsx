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

const validFlowData = {
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
    it("Errors", ()=>{
      const renderedCell = render(TableGridColumnDef[1].renderCell({ row: { actionID: "None" }}));
      expect(renderedCell.findByDisplayValue("...")).toBeTruthy();
    });
    it("Options", ()=>{
      const renderedCell = render(TableGridColumnDef[10].renderCell({ row: { content: { options: ["Option 1", "Option 2"]}}}));
      expect(renderedCell.findByDisplayValue("Option 1")).toBeTruthy();
    });
    it("Repeat", ()=>{
      const renderedCell = render(TableGridColumnDef[11].renderCell({ row: { repeat: { "some": "data" }}}));
      expect(renderedCell.findByDisplayValue("some")).toBeTruthy();
    });
  });
  describe("valueSetter", ()=>{
    it("actionType", ()=>{
      expect(TableGridColumnDef[2].valueSetter({
        row: { ...validFlowData },
        value: "TEST_TYPE"
      }).actionType).toBe("TEST_TYPE");
      expect(TableGridColumnDef[2].valueSetter({ row: {}}).actionType).toBe(undefined);
    });
  });

});
