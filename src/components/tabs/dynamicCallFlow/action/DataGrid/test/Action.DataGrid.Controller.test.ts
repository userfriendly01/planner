import {
  ActionDataGridController,
  actionMatchFilter
} from "components/tabs/dynamicCallFlow/action/DataGrid/Action.DataGrid.Controller";
import {
  ReactGridApi
} from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces";
import { ACTION_ID } from "dynamicCallFlowAction/Form/ActionFields";
import { ActionRecordType } from "dynamicCallFlowAction/GraphQL/Action.Interfaces";
import { AlertBarController, AlertBarControllerRef } from "dynamicCallFlowCommon/AlertBar.Controller";
import { DataGridFilterRef } from "dynamicCallFlowCommon/DataGrid/Abstract.DataGrid.Filter";

jest.mock("components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces");
jest.mock("@mui/x-data-grid/internals");

describe("ActionDataGridController", () => {
  let dataGridController: ActionDataGridController;
  let mockDataGridApi: ReactGridApi;
  let mockDataGridFilter: DataGridFilterRef<any>;
  let alertBarController: AlertBarController;

  beforeEach(() => {
    mockDataGridApi = { current: jest.fn() } as unknown as ReactGridApi;
    mockDataGridFilter = { current: jest.fn() } as unknown as DataGridFilterRef<any>;
    alertBarController = new AlertBarController(jest.fn());
    const alertBarControllerRef = {
      current: alertBarController
    } as AlertBarControllerRef;
    dataGridController = new ActionDataGridController(mockDataGridApi, mockDataGridFilter, alertBarControllerRef);
  });

  it("shouldReturnCorrectRecordKey", () => {
    expect(dataGridController.matchFilter()).toEqual(actionMatchFilter);
  });

  describe("actionMatchFilter", () => {
    it("shouldReturnTrueForMatchingActionIds", () => {
      const actionRecord1 = { [ACTION_ID]: "1" } as ActionRecordType;
      const actionRecord2 = { [ACTION_ID]: "1" } as ActionRecordType;
      expect(actionMatchFilter(actionRecord1, actionRecord2)).toBe(true);
    });

    it("shouldReturnFalseForNonMatchingActionIds", () => {
      const actionRecord1 = { [ACTION_ID]: "1" } as ActionRecordType;
      const actionRecord2 = { [ACTION_ID]: "2" } as ActionRecordType;
      expect(actionMatchFilter(actionRecord1, actionRecord2)).toBe(false);
    });

    it("shouldReturnFalseIfFirstActionRecordIsNull", () => {
      const actionRecord1: ActionRecordType = null;
      const actionRecord2 = { [ACTION_ID]: "1" } as ActionRecordType;
      expect(actionMatchFilter(actionRecord1, actionRecord2)).toBe(false);
    });

    it("shouldReturnFalseIfSecondActionRecordIsNull", () => {
      const actionRecord1 = { [ACTION_ID]: "1" } as ActionRecordType;
      const actionRecord2: ActionRecordType = null;
      expect(actionMatchFilter(actionRecord1, actionRecord2)).toBe(false);
    });

    it("shouldReturnFalseIfBothActionRecordsAreNull", () => {
      const actionRecord1: ActionRecordType = null;
      const actionRecord2: ActionRecordType = null;
      expect(actionMatchFilter(actionRecord1, actionRecord2)).toBe(true);
    });
  });
});