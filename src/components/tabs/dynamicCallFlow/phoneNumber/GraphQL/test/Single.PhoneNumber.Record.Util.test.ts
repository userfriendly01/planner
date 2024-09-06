import {
  createPhoneNumberRecord,
  updatePhoneNumberRecord,
  deletePhoneNumberRecord,
  SingleCallFlowRecord
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Single.PhoneNumber.Record.Util";
import { PhoneNumberRecordType } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { CctSharedCallFlowDb } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";
import { SingleRecordResults } from "components/tabs/dynamicCallFlow/common/GraphQL/AbstractSingleRecord.Query";
import { PhoneNumberRecordUtil } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/PhoneNumber.Record.Util";
import { createDynamicPhoneNumberRecord } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Create.Dynamic.PhoneNumber.Record.Query";
import { createLegacyPhoneNumberRecord } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Create.Legacy.PhoneNumber.Record.Query";
import { updateDynamicPhoneNumberRecord } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Update.Dynamic.PhoneNumber.Record.Query";
import { updateLegacyPhoneNumberRecord } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Update.Legacy.PhoneNumber.Record.Query";
import { deleteDynamicPhoneNumberRecord } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Delete.Dynamic.PhoneNumber.Record.Query";
import { deleteLegacyPhoneNumberRecord } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Delete.Legacy.PhoneNumber.Record.Query";
import { mockAccessToken } from "dynamicCallFlowPhoneNumber/GraphQL/Query/test/GraphQL.Query.Testing.Util";
import { DynamicPhoneNumberOne } from "dynamicCallFlowPhoneNumber/GraphQL/test/Dynamic.PhoneNumber.MockData";
import { LegacyPhoneNumberOne } from "dynamicCallFlowPhoneNumber/GraphQL/test/Legacy.PhoneNumber.Record.MockData";

jest.mock("components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Create.Dynamic.PhoneNumber.Record.Query", () => ({
  createDynamicPhoneNumberRecord: jest.fn()
}));

jest.mock("components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Create.Legacy.PhoneNumber.Record.Query", () => ({
  createLegacyPhoneNumberRecord: jest.fn()
}));

jest.mock("components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Update.Dynamic.PhoneNumber.Record.Query", () => ({
  updateDynamicPhoneNumberRecord: jest.fn()
}));

jest.mock("components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Update.Legacy.PhoneNumber.Record.Query", () => ({
  updateLegacyPhoneNumberRecord: jest.fn()
}));

jest.mock("components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Delete.Dynamic.PhoneNumber.Record.Query", () => ({
  deleteDynamicPhoneNumberRecord: jest.fn()
}));

jest.mock("components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Delete.Legacy.PhoneNumber.Record.Query", () => ({
  deleteLegacyPhoneNumberRecord: jest.fn()
}));

describe("PhoneNumberRecord Util Functions", () => {
  it("should create dynamic phone number record successfully", async () => {
    (createDynamicPhoneNumberRecord as jest.Mock).mockResolvedValue({
      alertMsg: "",
      errors: [],
      record: { ...DynamicPhoneNumberOne },
      hasError: false
    } as SingleRecordResults<PhoneNumberRecordType>);
    const result = await SingleCallFlowRecord.create(mockAccessToken, DynamicPhoneNumberOne);
    expect(result.record).toEqual(DynamicPhoneNumberOne);
  });

  it("should handle error during create dynamic phone number record", async () => {
    (createDynamicPhoneNumberRecord as jest.Mock).mockResolvedValue({
      alertMsg: "",
      errors: [{
        message: "Create failed"
      }],
      record: undefined,
      hasError: true
    } as SingleRecordResults<PhoneNumberRecordType>);
    const result = await createPhoneNumberRecord(mockAccessToken, DynamicPhoneNumberOne);
    expect(result.errors[0].message).toEqual("Create failed");
  });

  it("should create legacy phone number record successfully", async () => {
    (createLegacyPhoneNumberRecord as jest.Mock).mockResolvedValue({
      alertMsg: "",
      errors: [],
      record: { ...LegacyPhoneNumberOne },
      hasError: false
    } as SingleRecordResults<PhoneNumberRecordType>);
    const result = await createPhoneNumberRecord(mockAccessToken, LegacyPhoneNumberOne);
    expect(result.record).toEqual(LegacyPhoneNumberOne);
  });

  it("should handle error during create legacy phone number record", async () => {
    (createLegacyPhoneNumberRecord as jest.Mock).mockResolvedValue({
      alertMsg: "",
      errors: [{
        message: "Create failed"
      }],
      record: undefined,
      hasError: true
    } as SingleRecordResults<PhoneNumberRecordType>);
    const result = await createPhoneNumberRecord(mockAccessToken, LegacyPhoneNumberOne);
    expect(result.errors[0].message).toEqual("Create failed");
  });

  it("should update dynamic phone number record successfully", async () => {
    (updateDynamicPhoneNumberRecord as jest.Mock).mockResolvedValue({
      alertMsg: "",
      errors: [],
      record:  DynamicPhoneNumberOne,
      hasError: false
    } as SingleRecordResults<PhoneNumberRecordType>);
    const result = await SingleCallFlowRecord.update(mockAccessToken, DynamicPhoneNumberOne);
    expect(result.record).toEqual(DynamicPhoneNumberOne);
  });

  it("should update legacy phone number record successfully", async () => {
    (updateLegacyPhoneNumberRecord as jest.Mock).mockResolvedValue({
      alertMsg: "",
      errors: [],
      record: { ...LegacyPhoneNumberOne },
      hasError: false
    } as SingleRecordResults<PhoneNumberRecordType>);
    const result = await updatePhoneNumberRecord(mockAccessToken, LegacyPhoneNumberOne);
    expect(result.record).toEqual(LegacyPhoneNumberOne);
  });

  it("should delete dynamic phone number record successfully", async () => {
    (deleteDynamicPhoneNumberRecord as jest.Mock).mockResolvedValue({
      alertMsg: "",
      errors: [],
      record:  DynamicPhoneNumberOne,
      hasError: false
    } as SingleRecordResults<PhoneNumberRecordType>);
    const result = await SingleCallFlowRecord.delete(mockAccessToken, DynamicPhoneNumberOne);
    expect(result.record).toEqual(DynamicPhoneNumberOne);
  });

  it("should delete legacy phone number record successfully", async () => {
    (deleteLegacyPhoneNumberRecord as jest.Mock).mockResolvedValue({
      alertMsg: "",
      errors: [],
      record: { ...LegacyPhoneNumberOne },
      hasError: false
    } as SingleRecordResults<PhoneNumberRecordType>);
    const result = await deletePhoneNumberRecord(mockAccessToken, LegacyPhoneNumberOne);
    expect(result.record).toEqual(LegacyPhoneNumberOne);
  });


  // it("should handle error during update dynamic phone number record", async () => {
  //   jest.spyOn(PhoneNumberRecordUtil, "isLegacyPhoneNumberRecord").mockReturnValue(false);
  //   jest.spyOn(updateDynamicPhoneNumberRecord, "mockRejectedValue").mockRejectedValue(new Error("Update failed"));
  //   await expect(updatePhoneNumberRecord(mockAccessToken, mockDynamicPhoneNumberRecord)).rejects.toThrow("Update failed");
  // });
  //
  // it("should handle error during update legacy phone number record", async () => {
  //   jest.spyOn(PhoneNumberRecordUtil, "isLegacyPhoneNumberRecord").mockReturnValue(true);
  //   jest.spyOn(updateLegacyPhoneNumberRecord, "mockRejectedValue").mockRejectedValue(new Error("Update failed"));
  //   await expect(updatePhoneNumberRecord(mockAccessToken, mockLegacyPhoneNumberRecord)).rejects.toThrow("Update failed");
  // });
  //
  // it("should handle error during delete dynamic phone number record", async () => {
  //   jest.spyOn(PhoneNumberRecordUtil, "isLegacyPhoneNumberRecord").mockReturnValue(false);
  //   jest.spyOn(deleteDynamicPhoneNumberRecord, "mockRejectedValue").mockRejectedValue(new Error("Delete failed"));
  //   await expect(deletePhoneNumberRecord(mockAccessToken, mockDynamicPhoneNumberRecord)).rejects.toThrow("Delete failed");
  // });
  //
  // it("should handle error during delete legacy phone number record", async () => {
  //   jest.spyOn(PhoneNumberRecordUtil, "isLegacyPhoneNumberRecord").mockReturnValue(true);
  //   jest.spyOn(deleteLegacyPhoneNumberRecord, "mockRejectedValue").mockRejectedValue(new Error("Delete failed"));
  //   await expect(deletePhoneNumberRecord(mockAccessToken, mockLegacyPhoneNumberRecord)).rejects.toThrow("Delete failed");
  // });
});