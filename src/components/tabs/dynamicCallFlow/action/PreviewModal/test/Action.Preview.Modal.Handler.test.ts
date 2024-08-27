import { ActionPreviewModalHandler } from "dynamicCallFlowAction/PreviewModal/Action.Preview.Modal.Handler";
import {
  HANDLED_SUCCESSFULLY
} from "dynamicCallFlowCommon/Preview/Abstract.Preview.Modal.Handler";
import {
  ReactGridApi
} from "dynamicCallFlowCommon/DynamicCallFlow.Interfaces";
import { ActionRecordType } from "dynamicCallFlowAction/GraphQL/Action.Interfaces";
import {
  DataGridController, DataGridControllerRef
} from "dynamicCallFlowCommon/DataGrid/Abstract.DataGrid.Controller";
import {
  AlertBarController, AlertBarControllerRef
} from "dynamicCallFlowCommon/AlertBar.Controller";
import { ActionDataGridController } from "dynamicCallFlowAction/DataGrid/Action.DataGrid.Controller";
import * as batchCreateActionModule from "dynamicCallFlowAction/GraphQL/Batch.Create.Action.Records.Query";
import { BatchResults } from "dynamicCallFlowCommon/GraphQL/Abstract.BatchRecords.Query";
import { GraphQLError } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import { MockCallFlowConfigOne } from "dynamicCallFlowAction/GraphQL/test/Action.MockData";
import { DataGridFilterRef } from "dynamicCallFlowCommon/DataGrid/Abstract.DataGrid.Filter";

async function createMockBatchResults(alertMessage: string, errors: Array<string>, hasError = false): Promise<BatchResults<ActionRecordType>> {
  const graphQLErrors: GraphQLError[] = [];

  errors.forEach(error => graphQLErrors.push({ message: error }));

  return {
    alertMsg: alertMessage,
    errors: graphQLErrors,
    failure: [],
    hasError: hasError,
    success: []
  };
}

describe("ActionPreviewModalHandler", () => {
  let mockDataGridControllerRef: DataGridControllerRef<ActionRecordType>;
  let mockDataGridController: DataGridController<ActionRecordType>;
  let alertBarController: AlertBarController;

  beforeEach(() => {
    jest.clearAllMocks();
    const reactGridApi = {
    } as ReactGridApi;
    const dataGridFilter = {
    } as DataGridFilterRef<ActionRecordType>;

    alertBarController = new AlertBarController(jest.fn());
    const alertBarControllerRef = {
      current: alertBarController
    } as AlertBarControllerRef;

    mockDataGridController = new ActionDataGridController(reactGridApi, dataGridFilter, alertBarControllerRef);

    mockDataGridControllerRef = {
      current: mockDataGridController
    } as DataGridControllerRef<ActionRecordType>;
  });

  it("shouldHandleOnCreateSuccessfully", async () => {
    const handler = new ActionPreviewModalHandler(mockDataGridControllerRef);
    const spyOnRemoveRecords = jest.spyOn(mockDataGridController, "removeRecordsFromSourceRecords").mockReturnValue();
    const spyOneAddRecords = jest.spyOn(mockDataGridController, "addRecordsToSourceRecords").mockReturnValue();
    const spyOneCreateRecords = jest.spyOn(batchCreateActionModule, "batchCreateDynamicActionRecords")
      .mockReturnValue(createMockBatchResults("Success", []));
    const spyOnAlertMessage = jest.spyOn(mockDataGridController.alertBarController, "success").mockReturnValue();
    const result = await handler.handleOnCreate("accessToken", MockCallFlowConfigOne);

    expect(spyOnRemoveRecords).toHaveBeenCalled();
    expect(spyOneAddRecords).toHaveBeenCalled();
    expect(spyOneCreateRecords).toHaveBeenCalled();
    expect(result).toBe(HANDLED_SUCCESSFULLY);
    expect(spyOnAlertMessage).toHaveBeenCalledWith("Call Flow Configuration successfully loaded.");
  });

  // it("shouldReturnHandledSuccessfullyWhenNoUnusedRecords", async () => {
  //   const handler = new ActionPreviewModalHandler(mockDataGridControllerRef);
  //   const spyOnRemoveElements = jest.spyOn(removeElementsFromArray, "default").mockReturnValue([]);
  //   const result = await handler.deleteUnusedCallFlowConfigRecords("accessToken", [], []);
  //   expect(result).toBe(HANDLED_SUCCESSFULLY);
  //   expect(spyOnRemoveElements).toHaveBeenCalled();
  // });
  //
  // it("shouldReturnHandledSuccessfullyWhenBatchDeleteSucceeds", async () => {
  //   const handler = new ActionPreviewModalHandler(mockDataGridControllerRef);
  //   const spyOnRemoveElements = jest.spyOn(removeElementsFromArray, "default").mockReturnValue([{} as ActionRecordType]);
  //   const spyOnBatchDelete = jest.spyOn(batchDeleteActionRecords, "default").mockResolvedValue(createMockBatchResults("", [], false));
  //   const result = await handler.deleteUnusedCallFlowConfigRecords("accessToken", [], [{} as ActionRecordType]);
  //   expect(result).toBe(HANDLED_SUCCESSFULLY);
  //   expect(spyOnRemoveElements).toHaveBeenCalled();
  //   expect(spyOnBatchDelete).toHaveBeenCalled();
  // });
  //
  // it("shouldReturnHandledUnsuccessfullyWhenBatchDeleteFails", async () => {
  //   const handler = new ActionPreviewModalHandler(mockDataGridControllerRef);
  //   const spyOnRemoveElements = jest.spyOn(removeElementsFromArray, "default").mockReturnValue([{} as ActionRecordType]);
  //   const spyOnBatchDelete = jest.spyOn(batchDeleteActionRecords, "default").mockResolvedValue(createMockBatchResults("Error", ["Error"], true));
  //   const spyOnGraphQLError = jest.spyOn(mockDataGridController.alertBarController, "graphQLError").mockReturnValue();
  //   const result = await handler.deleteUnusedCallFlowConfigRecords("accessToken", [], [{} as ActionRecordType]);
  //   expect(result).toBe(HANDLED_UNSUCCESSFULLY);
  //   expect(spyOnRemoveElements).toHaveBeenCalled();
  //   expect(spyOnBatchDelete).toHaveBeenCalled();
  //   expect(spyOnGraphQLError).toHaveBeenCalledWith(["Error"]);
  // });
  // it("shouldHandleOnCreateWithBatchCreateError", async () => {
  //   const mockDataGridController = {
  //     sourceRecords: [{ callFlowName: "TestFlow" }],
  //     alertBarController: { success: jest.fn() }
  //   };
  //   const handler = new ActionPreviewModalHandler(mockDataGridController);
  //   const mockBatchCreate = jest.spyOn(handler, "batchCreateDynamicActionRecords").mockResolvedValue({ hasError: true });
  //
  //   const result = await handler.handleOnCreate("accessToken", [{ callFlowName: "TestFlow" }]);
  //
  //   expect(result).toBe(HANDLED_UNSUCCESSFULLY);
  //   expect(mockDataGridController.alertBarController.success).not.toHaveBeenCalled();
  // });
  //
  // it("shouldHandleOnCreateWithDeleteUnusedError", async () => {
  //   const mockDataGridController = {
  //     sourceRecords: [{ callFlowName: "TestFlow" }],
  //     removeRecordsFromSourceRecords: jest.fn(),
  //     addRecordsToSourceRecords: jest.fn(),
  //     alertBarController: { success: jest.fn() },
  //     dataGridRecords: []
  //   };
  //   const handler = new ActionPreviewModalHandler(mockDataGridController);
  //   const mockBatchCreate = jest.spyOn(handler, "batchCreateDynamicActionRecords").mockResolvedValue({ hasError: false });
  //   const mockDeleteUnused = jest.spyOn(handler, "deleteUnusedCallFlowConfigRecords").mockResolvedValue(HANDLED_UNSUCCESSFULLY);
  //
  //   const result = await handler.handleOnCreate("accessToken", [{ callFlowName: "TestFlow" }]);
  //
  //   expect(result).toBe(HANDLED_UNSUCCESSFULLY);
  //   expect(mockDataGridController.removeRecordsFromSourceRecords).not.toHaveBeenCalled();
  //   expect(mockDataGridController.addRecordsToSourceRecords).not.toHaveBeenCalled();
  //   expect(mockDataGridController.alertBarController.success).not.toHaveBeenCalled();
  // });
  //
  // it("shouldDeleteUnusedCallFlowConfigRecordsSuccessfully", async () => {
  //
  //   const handler = new ActionPreviewModalHandler(mockDataGridController);
  //   const mockBatchDelete = jest.spyOn(handler, "batchDeleteDynamicActionRecords").mockResolvedValue({ hasError: false });
  //
  //   const result = await handler.deleteUnusedCallFlowConfigRecords("accessToken", [], [{ callFlowName: "TestFlow" }]);
  //
  //   expect(result).toBe(HANDLED_SUCCESSFULLY);
  //   expect(mockDataGridController.alertBarController.graphQLError).not.toHaveBeenCalled();
  // });
  //
  // it("shouldHandleDeleteUnusedCallFlowConfigRecordsError", async () => {
  //   const mockDataGridController = {
  //     alertBarController: { graphQLError: jest.fn() }
  //   };
  //   const handler = new ActionPreviewModalHandler(mockDataGridController);
  //   const mockBatchDelete = jest.spyOn(handler, "batchDeleteDynamicActionRecords").mockResolvedValue({
  //     hasError: true,
  //     errors: ["Error"]
  //   });
  //
  //   const result = await handler.deleteUnusedCallFlowConfigRecords("accessToken", [], [{ callFlowName: "TestFlow" }]);
  //
  //   expect(result).toBe(HANDLED_UNSUCCESSFULLY);
  //   expect(mockDataGridController.alertBarController.graphQLError).toHaveBeenCalledWith(["Error"]);
  // });
});