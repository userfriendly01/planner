import { RoutingGridColumnDef } from "../GridColumnDef";
import { render } from "testUtils";

describe("<RoutingGridColumnDef />", () => {

  it("has no of columns", () => {
    expect(RoutingGridColumnDef.length).toBe(18);
  });

  describe("valueGetter", ()=>{
    it("startTime", () => {
      expect(RoutingGridColumnDef[12].valueGetter({ row: { startTime: "11:25:00 AM" }})).toBe("11:25 AM");
      expect(RoutingGridColumnDef[12].valueGetter({ row: { startTime: "2023-11-20" }})).toBe("");
    });

    it("endTime", () => {
      expect(RoutingGridColumnDef[13].valueGetter({ row: { endTime: "12:55:00 PM" }})).toBe("12:55 PM");
      expect(RoutingGridColumnDef[13].valueGetter({ row: { endTime: "2023-11-20" }})).toBe("");
    });

  });
  describe("renderCell", ()=>{
    it("brand", ()=>{
      const renderedCell = render(RoutingGridColumnDef[1].renderCell({ row: { brand: "Liberty Mutual" }}));
      expect(renderedCell.findByDisplayValue("Liberty Mutual")).toBeTruthy();
    });
    it("callerType", ()=>{
      const renderedCell = render(RoutingGridColumnDef[3].renderCell({ row: { callerType: "Claims" }}));
      expect(renderedCell.findByDisplayValue("Claims")).toBeTruthy();
    });
    it("callIntent", ()=>{
      const renderedCell = render(RoutingGridColumnDef[4].renderCell({ row: { callIntent: "Test INTENT" }}));
      expect(renderedCell.findByDisplayValue("Test INTENT")).toBeTruthy();
    });
    it("transferMessage", ()=>{
      const renderedCell = render(RoutingGridColumnDef[14].renderCell({ row: { transferMessage: "Test Transfer Message" }}));
      expect(renderedCell.findByDisplayValue("Test Transfer Message")).toBeTruthy();
    });
    it("occupancyCheck", ()=>{
      const renderedCell = render(RoutingGridColumnDef[16].renderCell({
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
      const renderedCell = render(RoutingGridColumnDef[17].renderCell({
        row: {
          routingSteps: [{
            team: "Team1",
            time: 10
          }]
        }
      }));
      expect(renderedCell.findByDisplayValue("Team1-10")).toBeTruthy();
    });
  });

});
