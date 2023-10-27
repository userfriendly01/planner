import { RoutingGridColumnDef } from "../GridColumnDef";
import { render } from "testUtils";

describe("<RoutingGridColumnDef />", () => {

  it("has no of columns", () => {
    expect(RoutingGridColumnDef.length).toBe(20);
  });

  describe("valueGetter", () => {
    it("startTime", () => {
      expect(RoutingGridColumnDef[12].valueGetter({ row: { startTime: "11:25:00 AM" }})).toBe("11:25 AM");
      expect(RoutingGridColumnDef[12].valueGetter({ row: { startTime: "2023-11-20"  }})).toBe("");
    });

    it("endTime", () => {
      expect(RoutingGridColumnDef[13].valueGetter({ row: { endTime: "12:55:00 PM" }})).toBe("12:55 PM");
      expect(RoutingGridColumnDef[13].valueGetter({ row: { endTime: "2023-11-20" }})).toBe("");
    });

  });
  describe("renderCell", () => {
    it("brand", () => {
      const { findByDisplayValue } = render(RoutingGridColumnDef[1].renderCell({ row: { brand: "Liberty Mutual" }}));
      expect(findByDisplayValue("Liberty Mutual")).toBeTruthy();
    });
    it("brand with null value", () => {
      const { findByDisplayValue } = render(RoutingGridColumnDef[1].renderCell({ row: { brand: null }}));
      expect(findByDisplayValue("")).toBeTruthy();
    });
    it("callerType", () => {
      const renderedCell = render(RoutingGridColumnDef[3].renderCell({ row: { callerType: "Claims" }}));
      expect(renderedCell.findByDisplayValue("Claims")).toBeTruthy();
    });
    it("callerType with null value", () => {
      const renderedCell = render(RoutingGridColumnDef[3].renderCell({ row: { callerType: null }}));
      expect(renderedCell.findByDisplayValue("")).toBeTruthy();
    });
    it("callIntent", () => {
      const renderedCell = render(RoutingGridColumnDef[4].renderCell({ row: { callIntent: "Test INTENT" }}));
      expect(renderedCell.findByDisplayValue("Test INTENT")).toBeTruthy();
    });
    it("callIntent with null value", () => {
      const renderedCell = render(RoutingGridColumnDef[4].renderCell({ row: { callIntent: null }}));
      expect(renderedCell.findByDisplayValue("")).toBeTruthy();
    });
    it("transferMessage", () => {
      const renderedCell = render(RoutingGridColumnDef[14].renderCell({ row: { transferMessage: "Test Transfer Message" }}));
      expect(renderedCell.findByDisplayValue("Test Transfer Message")).toBeTruthy();
    });
    it("transferMessage with null value", () => {
      const renderedCell = render(RoutingGridColumnDef[14].renderCell({ row: { transferMessage: null }}));
      expect(renderedCell.findByDisplayValue("")).toBeTruthy();
    });
    it("occupancyCheck", () => {
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
    it("routingSteps", () => {
      const renderedCell = render(RoutingGridColumnDef[17].renderCell({
        row: {
          routingSteps: [{
            teams: ["Team1"],
            time: 10
          }]
        }
      }));
      expect(renderedCell.findByDisplayValue("Team1-10")).toBeTruthy();
    });
    it("AlternateTransferDest", () => {
      const renderedCell = render(RoutingGridColumnDef[18].renderCell({ row: { alternateTransferDestination: "Claims" }}));
      expect(renderedCell.findByDisplayValue("Claims")).toBeTruthy();
    });
    it("AlternateTransferDest with null value", () => {
      const renderedCell = render(RoutingGridColumnDef[18].renderCell({ row: { alternateTransferDestination: null }}));
      expect(renderedCell.findByDisplayValue("")).toBeTruthy();
    });
    it("tfnRoutingGroup", () => {
      const renderedCell = render(RoutingGridColumnDef[19].renderCell({ row: { tfnRoutingGroup: "Core" }}));
      expect(renderedCell.findByDisplayValue("Core")).toBeTruthy();
    });
    it("tfnRoutingGroup with null value", () => {
      const renderedCell = render(RoutingGridColumnDef[19].renderCell({ row: { tfnRoutingGroup: null }}));
      expect(renderedCell.findByDisplayValue("")).toBeTruthy();
    });
  });
});
