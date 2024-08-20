import { PhoneNumberPreviewModalHandler } from "components/tabs/dynamicCallFlow/phoneNumber/PreviewModal/PhoneNumber.Preview.Modal.Handler";
import { PhoneNumberRecordType } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { BatchPhoneNumberRecord } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Batch.PhoneNumber.Records.Util";
import { deleteOppositeRows } from "components/tabs/dynamicCallFlow/phoneNumber/DataGrid/PhoneNumber.DataGrid.Util";
import { generateMatchingRecordMessages } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Match.PhoneNumber.Records.Util";
import {
  HANDLED_SUCCESSFULLY, HANDLED_UNSUCCESSFULLY
} from "components/tabs/dynamicCallFlow/common/Preview/Abstract.Preview.Modal.Handler";
import { BatchResults } from "dynamicCallFlowCommon/GraphQL/Abstract.BatchRecords.Query";
import { mockAlertBarControllerRef } from "dynamicCallFlowCommon/test/AlertBar.Controller.test";
import { AlertBarController, AlertBarControllerRef } from "dynamicCallFlowCommon/AlertBar.Controller";
import { DataGridController, DataGridControllerRef } from "dynamicCallFlowCommon/DataGrid/Abstract.DataGrid.Controller";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;

jest.mock("components/tabs/dynamicCallFlow/phoneNumber/DataGrid/PhoneNumber.DataGrid.Util", () => ({
  deleteOppositeRows: jest.fn()
}));

jest.mock("components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Match.PhoneNumber.Records.Util", () => ({
  generateMatchingRecordMessages: jest.fn()
}));

jest.mock("components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Batch.PhoneNumber.Records.Util", () => ({
  BatchPhoneNumberRecord: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}));

describe("PhoneNumberPreviewModalHandler", () => {
  // let mockDataGridController: jest.Mock = <DataGridController<PhoneNumberRecordType>>
  let handler: PhoneNumberPreviewModalHandler;
  let mockAccessToken: string;
  let mockPhoneNumberRecords: PhoneNumberRecordType[];
  let mockDataGridController: DataGridControllerRef<PhoneNumberRecordType>;
  let alertBarController: AlertBarController;

  beforeEach(() => {
    alertBarController = {
      error: jest.fn(),
      graphQLError: jest.fn(),
      warning: jest.fn(),
      info: jest.fn(),
      success: jest.fn(),
      closeAlertBar: jest.fn()
    } as unknown as AlertBarController;

    mockDataGridController = {
      current: {
        sourceRecords: [],
        alertBarController: alertBarController,
        removeRecordsFromSourceRecords: jest.fn(),
        addRecordsToSourceRecords: jest.fn(),
        updateRecordsInSourceRecords: jest.fn()
      } as unknown as DataGridController<PhoneNumberRecordType>
    };
    handler = new PhoneNumberPreviewModalHandler(mockDataGridController);
    mockAccessToken = "mockAccessToken";
    mockPhoneNumberRecords = [{ /* mock phone number record */ }] as PhoneNumberRecordType[];
  });

  it("should return HANDLED_UNSUCCESSFULLY if matching records are found on create", async () => {
    jest.spyOn(handler, "hasMatchingRecords").mockReturnValue(true);
    const result = await handler.handleOnCreate(mockAccessToken, mockPhoneNumberRecords);
    expect(result).toBe(HANDLED_UNSUCCESSFULLY);
  });

  it("should return HANDLED_SUCCESSFULLY if no matching records are found on create", async () => {
    jest.spyOn(handler, "hasMatchingRecords").mockReturnValue(false);
    jest.spyOn(BatchPhoneNumberRecord, "create").mockResolvedValue({
      hasError: false
    } as BatchResults<PhoneNumberRecordType>);
    const spyOnAlertBarControllerSuccess = jest.spyOn(mockDataGridController.current.alertBarController, "success");
    (deleteOppositeRows as jest.Mock).mockResolvedValue({ hasError: false } as BatchResults<PhoneNumberRecordType>);
    // jest.spyOn(deleteOppositeRows, "deleteOppositeRows").mockResolvedValue({ hasError: false } as BatchResults<PhoneNumberRecordType>);
    const result = await handler.handleOnCreate(mockAccessToken, mockPhoneNumberRecords);
    expect(result).toBe(HANDLED_SUCCESSFULLY);
    expect(spyOnAlertBarControllerSuccess).toHaveBeenCalledWith("Phone Number Records successfully created.");
  });

  it("should return HANDLED_UNSUCCESSFULLY if batch create has errors", async () => {
    jest.spyOn(handler, "hasMatchingRecords").mockReturnValue(false);
    jest.spyOn(BatchPhoneNumberRecord, "create").mockResolvedValue({
      hasError: true,
      errors: ["error"]
    } as unknown as BatchResults<PhoneNumberRecordType>);
    const result = await handler.handleOnCreate(mockAccessToken, mockPhoneNumberRecords);
    expect(result).toBe(HANDLED_UNSUCCESSFULLY);
  });

  it("should return HANDLED_UNSUCCESSFULLY if delete opposite rows has errors", async () => {
    jest.spyOn(handler, "hasMatchingRecords").mockReturnValue(false);
    jest.spyOn(BatchPhoneNumberRecord, "create").mockResolvedValue({ hasError: false } as BatchResults<PhoneNumberRecordType>);
    (deleteOppositeRows as jest.Mock).mockResolvedValue({
      hasError: true,
      errors: ["error"]
    } as unknown as BatchResults<PhoneNumberRecordType>);

    const result = await handler.handleOnCreate(mockAccessToken, mockPhoneNumberRecords);
    expect(result).toBe(HANDLED_UNSUCCESSFULLY);
  });

  it("should return HANDLED_SUCCESSFULLY on successful delete", async () => {
    (BatchPhoneNumberRecord.delete as jest.Mock).mockResolvedValue({ hasError: false } as BatchResults<PhoneNumberRecordType>);
    const result = await handler.handleOnDelete(mockAccessToken, mockPhoneNumberRecords);
    expect(result).toBe(HANDLED_SUCCESSFULLY);
  });

  it("should return HANDLED_UNSUCCESSFULLY if batch delete has errors", async () => {
    (BatchPhoneNumberRecord.delete as jest.Mock).mockResolvedValue({
      hasError: true,
      errors: ["error"]
    } as unknown as BatchResults<PhoneNumberRecordType>);
    const result = await handler.handleOnDelete(mockAccessToken, mockPhoneNumberRecords);
    expect(result).toBe(HANDLED_UNSUCCESSFULLY);
  });

  it("should call alertBarController.error if matching records are found", () => {
    (generateMatchingRecordMessages as jest.Mock).mockReturnValue(["match"]);
    const spyOnAlertBarControllerError = jest.spyOn(mockDataGridController.current.alertBarController, "error");

    const result = handler.hasMatchingRecords(mockPhoneNumberRecords);
    expect(result).toBe(true);
    expect(spyOnAlertBarControllerError).toHaveBeenCalledWith("Matching records found for: match");
  });

  it("should not call alertBarController.error if no matching records are found", () => {
    (generateMatchingRecordMessages as jest.Mock).mockReturnValue([]);
    const spyOnAlertBarControllerError = jest.spyOn(mockDataGridController.current.alertBarController, "error");

    const result = handler.hasMatchingRecords(mockPhoneNumberRecords);
    expect(result).toBe(false);
    expect(spyOnAlertBarControllerError).not.toHaveBeenCalled();
  });
});