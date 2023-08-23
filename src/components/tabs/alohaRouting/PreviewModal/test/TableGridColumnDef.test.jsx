import { TableGridColumnDef } from "../TableGridColumnDef";
import { render } from "testUtils";

describe("<TableColumnDef />", () => {

  it("has no of columns", () => {
    expect(TableGridColumnDef.length).toBe(18);
  });

  describe("valueGetter", ()=>{
    it("startTime", () => {
      expect(TableGridColumnDef[12].valueGetter({ row: { startTime: "11:25:00 AM" }})).toBe("11:25 AM");
      expect(TableGridColumnDef[12].valueGetter({ row: { startTime: "2023-11-20" }})).toBe("");
    });

    it("endTime", () => {
      expect(TableGridColumnDef[13].valueGetter({ row: { endTime: "12:55:00 PM" }})).toBe("12:55 PM");
      expect(TableGridColumnDef[13].valueGetter({ row: { endTime: "2023-11-20" }})).toBe("");
    });

  });
  describe("renderCell", ()=>{
    it("brand", ()=>{
      const { findByDisplayValue } = render(TableGridColumnDef[1].renderCell({ row: { brand: "Liberty Mutual" }}));
      expect(findByDisplayValue("Liberty Mutual")).toBeTruthy();
    });
    it("brand with null value", ()=>{
      const { findByDisplayValue } = render(TableGridColumnDef[1].renderCell({ row: { brand: null }}));
      expect(findByDisplayValue("")).toBeTruthy();
    });
    it("callerType", ()=>{
      const renderedCell = render(TableGridColumnDef[3].renderCell({ row: { callerType: "Claims" }}));
      expect(renderedCell.findByDisplayValue("Claims")).toBeTruthy();
    });
    it("callerType with null value", ()=>{
      const renderedCell = render(TableGridColumnDef[3].renderCell({ row: { callerType: null }}));
      expect(renderedCell.findByDisplayValue("")).toBeTruthy();
    });
    it("callIntent", ()=>{
      const renderedCell = render(TableGridColumnDef[4].renderCell({ row: { callIntent: "Test INTENT" }}));
      expect(renderedCell.findByDisplayValue("Test INTENT")).toBeTruthy();
    });
    it("callIntent with null value", ()=>{
      const renderedCell = render(TableGridColumnDef[4].renderCell({ row: { callIntent: null }}));
      expect(renderedCell.findByDisplayValue("")).toBeTruthy();
    });
    it("transferMessage", ()=>{
      const renderedCell = render(TableGridColumnDef[14].renderCell({ row: { transferMessage: "Test Transfer Message" }}));
      expect(renderedCell.findByDisplayValue("Test Transfer Message")).toBeTruthy();
    });
    it("transferMessage with null value", ()=>{
      const renderedCell = render(TableGridColumnDef[14].renderCell({ row: { transferMessage: null }}));
      expect(renderedCell.findByDisplayValue("")).toBeTruthy();
    });
    it("occupancyCheck", ()=>{
      const renderedCell = render(TableGridColumnDef[16].renderCell({
        row: {
          occupancyCheck: [{
            team: "Aloha",
            percentage: 30
          }]
        }
      }));
      expect(renderedCell.findByDisplayValue("Aloha-30")).toBeTruthy();
    });
    it("routingSteps", ()=>{
      const renderedCell = render(TableGridColumnDef[17].renderCell({
        row: {
          routingSteps: [{
            teams: ["Team1"],
            time: 10
          }]
        }
      }));
      expect(renderedCell.findByDisplayValue("Team1-10")).toBeTruthy();
    });
  });

});