import { getActionXlsxImporterResults } from "components/tabs/dynamicCallFlow/action/Xlsx/test/Action.Xlsx.Test.Util";
import { ActionXlsxExporter } from "dynamicCallFlowAction/Xlsx/Action.Xlsx.Exporter";
import {
  Action, ActionRecordType
} from "dynamicCallFlowAction/GraphQL/Action.Interfaces";
import { ActionTypeEnum } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "00000000-0000-0000-0000-000000000000")
}));

describe("Action XLSX Exporter", () => {
  test("happy path", () => {
    const xlsxImporterResults = getActionXlsxImporterResults("AISGMain.xlsx");

    expect(xlsxImporterResults).toBeDefined();
    expect(xlsxImporterResults.errors.length).toBe(0);
  });

  describe("ActionXlsxExporter", () => {
    it("shouldCreateInstance", () => {
      const exporter = ActionXlsxExporter.instance();
      expect(exporter).toBeInstanceOf(ActionXlsxExporter);
    });

    it("shouldConvertRecordsToXlsxRows", async () => {
      const exporter = ActionXlsxExporter.instance();
      const records: Array<ActionRecordType> = [
        {
          callFlowName: "Flow1",
          actionId: "Action1",
          actionType: ActionTypeEnum.ANNOUNCEMENT,
          speech: "Hello",
          nextActionId: "Action2",
          nextActionType: ActionTypeEnum.ANNOUNCEMENT
        },
        {
          callFlowName: "Flow2",
          actionId: "Action2",
          actionType: ActionTypeEnum.ANNOUNCEMENT,
          speech: "Hello",
          nextActionId: "NextAction1",
          nextActionType: ActionTypeEnum.ANNOUNCEMENT
        }
      ];
      const xlsxRows = await exporter.generateWorkBooks(records);
      expect(xlsxRows.size).toBe(2);
    });

    it("shouldGroupRecordsByWorkBookNames", () => {
      const exporter = ActionXlsxExporter.instance();
      const records: Array<ActionRecordType> = [
        {
          actionId: "Action1",
          callFlowName: "Flow1"
        },
        {
          callFlowName: "Flow1",
          actionId: "Action2"
        },
        {
          callFlowName: "Flow2",
          actionId: "Action3"
        }
      ];
      const groupedRecords = exporter.groupRecordsByWorkBookNames(records);
      expect(groupedRecords.size).toBe(2);
      expect(groupedRecords.get("Flow1")).toHaveLength(2);
      expect(groupedRecords.get("Flow2")).toHaveLength(1);
    });

    it("shouldHandleEmptyRecordsArray", () => {
      const exporter = ActionXlsxExporter.instance();
      const records: Array<ActionRecordType> = [];
      const groupedRecords = exporter.groupRecordsByWorkBookNames(records);
      expect(groupedRecords.size).toBe(0);
    });

    it("shouldHandleSingleRecord", () => {
      const exporter = ActionXlsxExporter.instance();
      const records: Array<Action> = [{
        actionId: "Action1",
        callFlowName: "Flow1"
      }];
      const groupedRecords = exporter.groupRecordsByWorkBookNames(records);
      expect(groupedRecords.size).toBe(1);
      expect(groupedRecords.get("Flow1")).toHaveLength(1);
    });
  });
});