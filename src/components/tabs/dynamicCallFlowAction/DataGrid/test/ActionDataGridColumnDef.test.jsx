import DynamicGridColumnDef from "../ActionDataGridColumnDef";
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

    describe("createTime", () => {
      describe("valueGetter", () => {
        const getter = DynamicGridColumnDef[3].valueGetter;
        const oldTime = "1971-05-25T04:00:00.000Z";
        const oldTimeUnixEpoch = 43992000;

        it("should set the date", () => {
          expect(getter({
            row: {
              createTime: oldTimeUnixEpoch
            }
          })).toEqual(oldTime);
        });

      });
    });

    describe("updateTime", () => {
      describe("valueGetter", () => {
        const getter = DynamicGridColumnDef[4].valueGetter;
        const oldTime = "1971-05-25T04:00:01.000Z";
        const oldTimeUnixEpoch = 43992001;

        it("should set the date", () => {
          expect(getter({
            row: {
              updateTime: oldTimeUnixEpoch
            }
          })).toEqual(oldTime);
        });

      });
    });

    describe("speech", () => {
      const speech = "Hello";
      describe("render", () => {
        describe("greeting", () => {
          const renderedCell = render(DynamicGridColumnDef[5].renderCell({
            row: {
              speech
            }
          }));
          it("should render the cell", () => {
            expect(renderedCell.findByText(speech)).toBeTruthy();
          });
        });
        describe("nothing", () => {
          const renderedCell = render(DynamicGridColumnDef[5].renderCell({
            row: {
            }
          }));
          it("should render the cell", () => {
            expect(renderedCell.findByText("")).toBeTruthy();
          });
        });
      });
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
      expect(DynamicGridColumnDef[11]).toEqual( {
        headerName: "next action type",
        field: "nextActionType",
        sortable: true,
        width: 150,
        align: "left"
      });
    });
    it("nextActionId", () => {
      expect(DynamicGridColumnDef[10]).toEqual(  {
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
      const renderedCell = render(DynamicGridColumnDef[13].renderCell({
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
