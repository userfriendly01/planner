import TableGridColumnDef from "dynamicCallFlowAction/PreviewModal/Action.Preview.Modal.ColumnDef";

describe("TableGridColumnDef", () => {
  it("shouldContainCorrectNumberOfColumns", () => {
    expect(TableGridColumnDef.length).toBe(13);
  });

  it("shouldContainCorrectColumnHeaders", () => {
    const headers = TableGridColumnDef.map(col => col.headerName);
    expect(headers).toEqual([
      "Action ID",
      "Action Type",
      "Call Flow Name",
      "Next Action",
      "Next Action Type",
      "Menu Allow Barge-in",
      "Menu Finish on Key",
      "Menu Max Digits",
      "Menu Min Digits",
      "Menu Options",
      "Repeat",
      "Speech",
      "Timeout"
    ]);
  });

  it("shouldContainCorrectFields", () => {
    const fields = TableGridColumnDef.map(col => col.field);
    expect(fields).toEqual([
      "actionId",
      "actionType",
      "callFlowName",
      "nextActionId",
      "nextActionType",
      "allowBargeIn",
      "finishOnKey",
      "maxDigits",
      "minDigits",
      "options",
      "repeat",
      "speech",
      "timeout"
    ]);
  });

  it("shouldContainSortableColumns", () => {
    const sortableColumns = TableGridColumnDef.filter(col => col.sortable);
    expect(sortableColumns.length).toBe(13);
  });

  it("shouldContainCorrectWidths", () => {
    const widths = TableGridColumnDef.map(col => col.width);
    expect(widths).toEqual([
      220, 150, 110, 220, 150, 110, 110, 110, 110, 330, 110, 330, 110
    ]);
  });

  it("shouldContainCorrectAlignments", () => {
    const alignments = TableGridColumnDef.map(col => col.align);
    expect(alignments).toEqual(Array(13).fill("left"));
  });

  it("shouldRenderCellForMenuOptions", () => {
    const optionsColumn = TableGridColumnDef.find(col => col.field === "options");
    expect(optionsColumn?.renderCell).toBeDefined();
  });

  it("shouldRenderCellForRepeat", () => {
    const repeatColumn = TableGridColumnDef.find(col => col.field === "repeat");
    expect(repeatColumn?.renderCell).toBeDefined();
  });
});