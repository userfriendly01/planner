import { AddPhoneNumberFormHandler } from "dynamicCallFlowPhoneNumber/Form/Add.PhoneNumber.Form.Handler";
import { PhoneNumberRecordType } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { SingleCallFlowRecord } from "dynamicCallFlowPhoneNumber/GraphQL/Single.PhoneNumber.Record.Util";
import {
  DataGridController, DataGridControllerRef
} from "dynamicCallFlowCommon/DataGrid/Abstract.DataGrid.Controller";
import { AlertBarController } from "dynamicCallFlowCommon/AlertBar.Controller";
import { mockAccessToken } from "dynamicCallFlowPhoneNumber/GraphQL/Query/test/GraphQL.Query.Testing.Util";
import { DynamicPhoneNumberOne } from "dynamicCallFlowPhoneNumber/GraphQL/test/Dynamic.PhoneNumber.MockData";
import {
  DynamicPhoneNumberFormFieldConfigs
} from "dynamicCallFlowPhoneNumber/Form/Dynamic.PhoneNumber.Form.FieldConfigs";

describe("Add.PhoneNumber.Form.Handler", () => {
  let handler: AddPhoneNumberFormHandler;
  let dataGridControllerRef: DataGridControllerRef<PhoneNumberRecordType>;
  let dataGridController: DataGridController<PhoneNumberRecordType>;
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

    dataGridController = {
      sourceRecords: [],
      alertBarController: alertBarController,
      addRecordToSourceRecords: jest.fn(),
      removeRecordFromSourceRecords: jest.fn(),
      removeRecordsFromSourceRecords: jest.fn(),
      addRecordsToSourceRecords: jest.fn(),
      updateRecordInSourceRecords: jest.fn(),
      updateRecordsInSourceRecords: jest.fn()
    } as unknown as DataGridController<PhoneNumberRecordType>;

    dataGridControllerRef = {
      current: dataGridController
    };
    handler = new AddPhoneNumberFormHandler(dataGridControllerRef);
  });

  it("shouldReturnModalName", () => {
    expect(handler.modalName).toBe("DynamicPhoneNumberFormAddHandler");
  });

  it("shouldReturnModalLabel", () => {
    expect(handler.modalLabel).toBe("Add");
  });

  it("shouldNotDisplayCloneButton", () => {
    expect(handler.displayCloneButton).toBe(false);
  });

  it("shouldNotDisplayDeleteButton", () => {
    expect(handler.displayDeleteButton).toBe(false);
  });

  it("shouldHandleOnSaveSuccessfully", async () => {
    jest.spyOn(SingleCallFlowRecord, "create").mockResolvedValue({ errors: []});

    const result = await handler.handleOnSave(mockAccessToken, DynamicPhoneNumberOne, DynamicPhoneNumberFormFieldConfigs);

    expect(result.successMessage).toBe(`Phone Number ${DynamicPhoneNumberOne.phoneNumber} has been successfully updated.`);
    expect(result.record).toEqual(DynamicPhoneNumberOne);
  });

  it("shouldReturnErrorMessageWhenCreateFails", async () => {
    jest.spyOn(SingleCallFlowRecord, "create").mockResolvedValue({ errors: [{ message: "Create failed" }]});

    const result = await handler.handleOnSave(mockAccessToken, DynamicPhoneNumberOne, DynamicPhoneNumberFormFieldConfigs);

    expect(result.errorMessage).toBe("Create failed");
  });

  it("shouldReturnErrorMessageWhenExceptionThrown", async () => {
    jest.spyOn(SingleCallFlowRecord, "create").mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    const result = await handler.handleOnSave(mockAccessToken, DynamicPhoneNumberOne, DynamicPhoneNumberFormFieldConfigs);

    expect(result.errorMessage).toBe("Unexpected error");
  });
});