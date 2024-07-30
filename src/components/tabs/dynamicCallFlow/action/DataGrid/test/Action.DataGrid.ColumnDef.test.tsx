import { ActionDataGridColumnDef } from "components/tabs/dynamicCallFlow/action/DataGrid/Action.DataGrid.ColumnDef";
import { GridColDef } from "@mui/x-data-grid";

describe("ActionDataGridColumnDef", () => {
  it("shouldHaveCorrectLength", () => {
    expect(ActionDataGridColumnDef.length).toEqual(14);
  });

  it("shouldHaveCorrectFields", () => {
    const fields = ActionDataGridColumnDef.map((column: GridColDef) => column.field);
    expect(fields).toEqual([
      "", "actionId", "actionType", "callFlowName", "nextActionId", "nextActionType", "speech", "timeout", "finishOnKey", "minDigits", "maxDigits", "options", "repeat", "url"
    ]);
  });

  it("shouldHaveSortableColumns", () => {
    const sortableColumns = ActionDataGridColumnDef.every((column: GridColDef) => column.sortable);
    expect(sortableColumns).toBe(true);
  });

  it("shouldHaveCorrectAlign", () => {
    const aligns = ActionDataGridColumnDef.every((column: GridColDef) => column.align === "left");
    expect(aligns).toBe(true);
  });

  it("shouldHaveRenderCellForSpecificFields", () => {
    const fieldsWithRenderCell = ActionDataGridColumnDef.filter((column: GridColDef) => column.renderCell).map((column: GridColDef) => column.field);
    expect(fieldsWithRenderCell).toEqual(["speech", "options", "repeat"]);
  });
});