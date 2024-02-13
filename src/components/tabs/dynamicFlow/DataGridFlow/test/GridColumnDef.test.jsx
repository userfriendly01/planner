import DynamicGridColumnDef from "../GridColumnDef";
import { render } from "testUtils";

describe("<DynamicGridColumnDef />", () => {

  it("has 3 columns", () => {
    expect(DynamicGridColumnDef.length).toBe(3);
  });

  describe("renderCell", ()=>{
    it("Dialed Description", ()=>{
      const renderedCell = render(DynamicGridColumnDef[2].renderCell());
      expect(renderedCell.findByDisplayValue("Replace Tooltip with jsontotable conversion")).toBeTruthy();
    });
  });
});
