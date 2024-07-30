import { EditPhoneNumberFormHandler } from "components/tabs/dynamicCallFlow/phoneNumber/Form/Edit.PhoneNumber.Form.Handler";
import { PhoneNumberRecordType } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { FieldConfigs } from "components/tabs/dynamicCallFlow/common/Form/Form.Interfaces";
import {
  DynamicPhoneNumberOne,
  mockDynamicPhoneNumberArray
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/test/Dynamic.PhoneNumber.MockData";
import { DataGridControllerRef } from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces";
import { PhoneNumberRecordUtil } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/PhoneNumber.Record.Util";

jest.mock("components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces");
jest.mock("components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Single.PhoneNumber.Record.Util");

const ACCESS_TOKEN = "accessToken";

describe("EditPhoneNumberFormHandler", () => {
  let handler: EditPhoneNumberFormHandler;
  let mockFieldConfigs: FieldConfigs;
  let dataGridController: DataGridControllerRef<PhoneNumberRecordType>;

  beforeEach(() => {
    handler = new EditPhoneNumberFormHandler(dataGridController);
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
    const mockSave = jest.fn().mockReturnValue(mockDynamicPhoneNumberArray);
    // dataGridController
    const response = await handler.handleOnSave(ACCESS_TOKEN, DynamicPhoneNumberOne, mockFieldConfigs);
    expect(response).toEqual({
      successMessage: `Phone Number ${PhoneNumberRecordUtil.getPhoneNumber(DynamicPhoneNumberOne)} has been successfully updated.`
    });
  });

  it("shouldHandleOnSaveWithError", async () => {
    // const mockSave = jest.fn().mockReturnValue(DynamicPhoneNumberSingleRecordResultsWithError);

    const response = await handler.handleOnSave(ACCESS_TOKEN, null, mockFieldConfigs);
    expect(response).toHaveProperty("errorMessage");
  });

  it("shouldHandleOnDeleteSuccessfully", async () => {
    // const mockSave = jest.fn().mockReturnValue(DynamicPhoneNumberSingleRecordResults);
    const response = await handler.handleOnDelete(ACCESS_TOKEN, DynamicPhoneNumberOne);
    expect(response).toEqual({
      successMessage: `Phone Number ${PhoneNumberRecordUtil.getPhoneNumber(DynamicPhoneNumberOne)} has been successfully deleted.`
    });
  });

  it("shouldHandleOnDeleteWithError", async () => {
    const response = await handler.handleOnDelete(ACCESS_TOKEN, null);
    expect(response).toHaveProperty("errorMessage");
    expect(response.errorMessage).toEqual("Record to delete is null or undefined.");
  });
});