import DynamicGridColumnDef from "../DynamicGridColumnDef";
import { render } from "testUtils";

describe("<DynamicGridColumnDef />", () => {

  it("has 14 columns", () => {
    expect(DynamicGridColumnDef.length).toBe(14);
  });

  describe("actionId", ()=>{
    it("actionId", () => {
      expect(DynamicGridColumnDef[0]).toEqual({
        headerName: "actionId",
        field: "actionId",
        sortable: true,
        width: 300,
        align: "left"
      });
    });

    it("action type", () => {
      expect(DynamicGridColumnDef[1]).toEqual( {
        headerName: "action type",
        field: "actionType",
        sortable: true,
        width: 150,
        align: "left"
      });
    });

    it("callflow name", () => {
      expect(DynamicGridColumnDef[2]).toEqual({
        headerName: "callFlowName",
        field: "callFlowName",
        sortable: true,
        width: 110,
        align: "left"
      });
    });

    it("speech", () => {
      const renderedCell = render(DynamicGridColumnDef[5].renderCell({
        row: {
          headerName: "speech",
          field: "speech",
          sortable: true,
          width: 300,
          align: "left"
        }
      }));
      expect(renderedCell.findByDisplayValue("speech")).toBeTruthy();
    });

    it("timeout", () => {
      expect(DynamicGridColumnDef[6]).toEqual( {
        headerName: "timeout",
        field: "timeout",
        sortable: true,
        width: 110,
        align: "left"
      });
    });

    it("finishOnKey", () => {
      expect(DynamicGridColumnDef[7]).toEqual( {
        headerName: "finishOnKey",
        field: "finishOnKey",
        sortable: true,
        width: 110,
        align: "left"
      });
    });
    it("minDigits", () => {
      expect(DynamicGridColumnDef[8]).toEqual( {
        headerName: "minDigits",
        field: "minDigits",
        sortable: true,
        width: 110,
        align: "left"
      });
    });
    it("maxDigits", () => {
      expect(DynamicGridColumnDef[9]).toEqual( {
        headerName: "maxDigits",
        field: "maxDigits",
        sortable: true,
        width: 110,
        align: "left"
      });
    });
    it("nextActionType", () => {
      expect(DynamicGridColumnDef[10]).toEqual( {
        headerName: "next action type",
        field: "nextActionType",
        sortable: true,
        width: 150,
        align: "left"
      });
    });
    it("nextActionId", () => {
      expect(DynamicGridColumnDef[11]).toEqual(  {
        headerName: "next action id",
        field: "nextActionId",
        sortable: true,
        width: 300,
        align: "left"
      });
    });
    it("options", () => {
      const renderedCell = render(DynamicGridColumnDef[12].renderCell({
        row: {
          headerName: "options",
          field: "options",
          sortable: true,
          width: 300,
          align: "left"
        }
      }));
      expect(renderedCell.findByDisplayValue("options")).toBeTruthy();
    });
    it("repeat", () => {
      const renderedCell = render(DynamicGridColumnDef[12].renderCell({
        row: {
          headerName: "repeat",
          field: "repeat",
          sortable: true,
          width: 300,
          align: "left"
        }
      }));
      expect(renderedCell.findByDisplayValue("repeat")).toBeTruthy();
    });
  });
});
