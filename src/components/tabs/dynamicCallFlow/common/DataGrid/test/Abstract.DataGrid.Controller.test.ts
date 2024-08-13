import { AbstractDataGridController } from "dynamicCallFlowCommon/DataGrid/Abstract.DataGrid.Controller";
import {
  AlertBarControllerRef,
  DataGridFilterRef,
  ReactGridApi
} from "dynamicCallFlowCommon/DynamicCallFlow.Interfaces";
import { AlertBarController } from "dynamicCallFlowCommon/AlertBar.Controller";

describe("AbstractDataGridController", () => {
  let controller: AbstractDataGridController<any>;
  let mockApi: ReactGridApi;
  let mockFilter: DataGridFilterRef<any>;
  let alertBarController: AlertBarController;

  beforeEach(() => {
    mockApi = { current: {}} as ReactGridApi;
    mockFilter = { current: {}} as DataGridFilterRef<any>;
    alertBarController = new AlertBarController(jest.fn());
    const alertBarControllerRef = {
      current: alertBarController
    } as AlertBarControllerRef;
    controller = new (class extends AbstractDataGridController<any> {
      matchFilter() {
        return (record: any) => record.id === 1;
      }
    })(mockApi, mockFilter, alertBarControllerRef);
  });

  it("shouldThrowErrorIfDataGridPropsNotInitialized", () => {
    expect(() => controller.dataGridProps).toThrow("DataGridProps not initialized.");
  });

  it("shouldAddRecordToSourceRecords", () => {
    const record = { id: 1 };
    controller.addRecordToSourceRecords(record);
    expect(controller.sourceRecords).toContain(record);
  });

  it("shouldUpdateRecordInSourceRecords", () => {
    const record = {
      id: 1,
      name: "old"
    };
    controller.sourceRecords = [record];
    const updatedRecord = {
      id: 1,
      name: "new"
    };
    controller.updateRecordInSourceRecords(updatedRecord);
    expect(controller.sourceRecords[0].name).toBe("new");
  });

  it("shouldRemoveRecordFromSourceRecords", () => {
    const record = { id: 1 };
    controller.sourceRecords = [record];
    controller.removeRecordFromSourceRecords(record);
    expect(controller.sourceRecords).not.toContain(record);
  });

  it("shouldAddRecordToDataGrid", () => {
    const record = { id: 1 };
    controller.addRecordToDataGrid(record);
    expect(controller.dataGridRecords).toContain(record);
  });

  it("shouldUpdateRecordInDataGrid", () => {
    const record = {
      id: 1,
      name: "old"
    };
    controller.dataGridRecords = [record];
    const updatedRecord = {
      id: 1,
      name: "new"
    };
    controller.updateRecordInDataGrid(updatedRecord);
    expect(controller.dataGridRecords[0].name).toBe("new");
  });

  it("shouldRemoveRecordFromDataGrid", () => {
    const record = { id: 1 };
    controller.dataGridRecords = [record];
    controller.removeRecordFromDataGrid(record);
    expect(controller.dataGridRecords).not.toContain(record);
  });
});