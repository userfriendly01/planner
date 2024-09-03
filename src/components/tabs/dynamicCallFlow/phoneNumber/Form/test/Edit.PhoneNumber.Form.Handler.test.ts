import { EditPhoneNumberFormHandler } from "components/tabs/dynamicCallFlow/phoneNumber/Form/Edit.PhoneNumber.Form.Handler";
import { PhoneNumberRecordType } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { FieldConfigs } from "components/tabs/dynamicCallFlow/common/Form/Form.Interfaces";
import { DynamicPhoneNumberOne } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/test/Dynamic.PhoneNumber.MockData";
import { PhoneNumberRecordUtil } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/PhoneNumber.Record.Util";
import {
  DataGridController, DataGridControllerRef
} from "dynamicCallFlowCommon/DataGrid/Abstract.DataGrid.Controller";
import { SingleCallFlowRecord } from "dynamicCallFlowPhoneNumber/GraphQL/Single.PhoneNumber.Record.Util";
import { AlertBarController } from "dynamicCallFlowCommon/AlertBar.Controller";
import { mockAccessToken } from "dynamicCallFlowPhoneNumber/GraphQL/Query/test/GraphQL.Query.Testing.Util";

jest.mock("components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces");
jest.mock("components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Single.PhoneNumber.Record.Util");

describe("EditPhoneNumberFormHandler", () => {
  let handler: EditPhoneNumberFormHandler;
  let mockFieldConfigs: FieldConfigs;
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
      removeRecordFromSourceRecords: jest.fn(),
      removeRecordsFromSourceRecords: jest.fn(),
      addRecordsToSourceRecords: jest.fn(),
      updateRecordInSourceRecords: jest.fn(),
      updateRecordsInSourceRecords: jest.fn()
    } as unknown as DataGridController<PhoneNumberRecordType>;

    dataGridControllerRef = {
      current: dataGridController
    };
    handler = new EditPhoneNumberFormHandler(dataGridControllerRef);
    mockFieldConfigs = {};
  });

  it("shouldReturnModalName", () => {
    expect(handler.modalName).toEqual("PhoneNumberFormEdit");
  });

  it("shouldReturnModalLabel", () => {
    expect(handler.modalLabel).toEqual("Edit");
  });

  it("shouldDisplayCloneButton", () => {
    expect(handler.displayCloneButton).toBe(true);
  });

  it("shouldDisplayDeleteButton", () => {
    expect(handler.displayDeleteButton).toBe(true);
  });

  it("shouldHandleOnSaveSuccessfully", async () => {
    jest.spyOn(SingleCallFlowRecord, "update").mockResolvedValue({
      alertMsg: undefined,
      errors: [],
      record: DynamicPhoneNumberOne,
      hasError: false
    });

    const response = await handler.handleOnSave(mockAccessToken, DynamicPhoneNumberOne, mockFieldConfigs);
    expect(response.successMessage).toEqual(`Phone Number ${PhoneNumberRecordUtil.getPhoneNumber(DynamicPhoneNumberOne)} has been successfully updated.`);
  });

  it("should fail from invalid phone number", async () => {
    const invalidPhoneNumber = {
      ...DynamicPhoneNumberOne,
      phoneNumber: "1234567890"
    };

    const response = await handler.handleOnSave(mockAccessToken, invalidPhoneNumber, mockFieldConfigs);
    expect(response.errorMessage).toEqual(`Phone number "${invalidPhoneNumber.phoneNumber}" is not in the correct format +1##########.`);
  });

  it("should fail from invalid employee id", async () => {
    const invalidEmployeeId = {
      ...DynamicPhoneNumberOne,
      employeeId: "n0123"
    };

    const response = await handler.handleOnSave(mockAccessToken, invalidEmployeeId, mockFieldConfigs);
    expect(response.errorMessage).toEqual(`Employee ID is not in the correct format n#######: ${invalidEmployeeId.employeeId}`);
  });

  it("should fail from invalid greetingMessages", async () => {
    const invalidEmployeeId = {
      ...DynamicPhoneNumberOne,
      greetingMessages: "it worked!"
    };

    const response = await handler.handleOnSave(mockAccessToken, invalidEmployeeId, mockFieldConfigs);
    expect(response.errorMessage).toEqual(`Greeting message contains invalid characters: ${invalidEmployeeId.greetingMessages}`);
  });

  it("should succeed from missing employee id", async () => {
    const missingEmployeeIdKey = {
      ...DynamicPhoneNumberOne
    };

    delete missingEmployeeIdKey.employeeId;

    jest.spyOn(SingleCallFlowRecord, "update").mockResolvedValue({
      alertMsg: undefined,
      errors: [],
      record: missingEmployeeIdKey,
      hasError: false
    });

    const response = await handler.handleOnSave(mockAccessToken, missingEmployeeIdKey, mockFieldConfigs);
    expect(response.successMessage).toEqual(`Phone Number ${missingEmployeeIdKey.phoneNumber} has been successfully updated.`);
  });

  it("shouldHandleOnSaveWithError", async () => {
    jest.spyOn(SingleCallFlowRecord, "update").mockResolvedValue({
      alertMsg: undefined,
      errors: [{
        message: "Error saving record"
      }],
      record: undefined,
      hasError: true
    });

    const response = await handler.handleOnSave(mockAccessToken, DynamicPhoneNumberOne, mockFieldConfigs);
    expect(response.errorMessage).toEqual("Error saving record");
  });

  it("shouldHandleOnDeleteSuccessfully", async () => {
    jest.spyOn(SingleCallFlowRecord, "delete").mockResolvedValue({
      alertMsg: undefined,
      errors: [],
      record: undefined,
      hasError: false
    });

    const response = await handler.handleOnDelete(mockAccessToken, DynamicPhoneNumberOne);
    expect(response.successMessage).toEqual(`Phone Number ${PhoneNumberRecordUtil.getPhoneNumber(DynamicPhoneNumberOne)} has been successfully deleted.`);
  });

  it("should handle error on delete", async () => {
    jest.spyOn(SingleCallFlowRecord, "delete").mockResolvedValue({
      alertMsg: undefined,
      errors: [{
        message: "delete failed"
      }],
      record: undefined,
      hasError: true
    });

    const response = await handler.handleOnDelete(mockAccessToken, DynamicPhoneNumberOne);
    expect(response.errorMessage).toEqual("delete failed");
  });

  it("should handle exception thrown on delete", async () => {
    jest.spyOn(SingleCallFlowRecord, "delete").mockRejectedValue(new Error("delete failed"));

    try {
      await handler.handleOnDelete(mockAccessToken, DynamicPhoneNumberOne);
    } catch (error) {
      expect(error.message).toEqual("delete failed");
    }
  });
});