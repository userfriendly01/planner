import { ActionDataGridController } from "components/tabs/dynamicCallFlow/action/DataGrid/Action.DataGrid.Controller";
import {
  AlertBarControllerRef,
  DataGridFilterRef,
  ReactGridApi
} from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces";
import { ACTION_ID } from "components/tabs/dynamicCallFlow/action/Form/ActionFields";


jest.mock("components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces");
jest.mock("@mui/x-data-grid/internals");

describe("ActionDataGridController", () => {
  let dataGridController: ActionDataGridController;
  let mockDataGridApi: ReactGridApi;
  let mockDataGridFilter: DataGridFilterRef<any>;
  let mockAlertBarController: AlertBarControllerRef;

  beforeEach(() => {
    mockDataGridApi = { current: jest.fn() } as unknown as ReactGridApi;
    mockDataGridFilter = { current: jest.fn() } as unknown as DataGridFilterRef<any>;
    mockAlertBarController = { current: jest.fn() } as unknown as AlertBarControllerRef;
    dataGridController = new ActionDataGridController(mockDataGridApi, mockDataGridFilter, mockAlertBarController);
  });

  it("shouldReturnCorrectRecordKey", () => {
    expect(dataGridController.recordKey()).toEqual(ACTION_ID);
  });
});