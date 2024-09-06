import { BatchPhoneNumberRecord } from "dynamicCallFlowPhoneNumber/GraphQL/Batch.PhoneNumber.Records.Util";
import { mockAccessToken } from "dynamicCallFlowPhoneNumber/GraphQL/Query/test/GraphQL.Query.Testing.Util";
import {
  batchCreateLegacyPhoneNumberRecords
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/Batch.Create.Legacy.PhoneNumber.Records.Query";
import {
  batchCreateDynamicPhoneNumberRecords
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/Batch.Create.Dynamic.PhoneNumber.Records.Query";
import {
  batchDeleteLegacyPhoneNumberRecords
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/Batch.Delete.Legacy.PhoneNumber.Records.Query";
import {
  batchDeleteDynamicPhoneNumberRecords
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/Batch.Delete.Dynamic.PhoneNumber.Records.Query";
import { BatchResults } from "dynamicCallFlowCommon/GraphQL/Abstract.BatchRecords.Query";
import { PhoneNumberRecordType } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { mockDynamicPhoneNumberArray } from "dynamicCallFlowPhoneNumber/GraphQL/test/Dynamic.PhoneNumber.MockData";
import { LegacyPhoneNumberArray } from "dynamicCallFlowPhoneNumber/GraphQL/test/Legacy.PhoneNumber.Record.MockData";

jest.mock("dynamicCallFlowPhoneNumber/GraphQL/Query/Batch.Create.Legacy.PhoneNumber.Records.Query", () => ({
  batchCreateLegacyPhoneNumberRecords: jest.fn()
}));

jest.mock("dynamicCallFlowPhoneNumber/GraphQL/Query/Batch.Create.Dynamic.PhoneNumber.Records.Query", () => ({
  batchCreateDynamicPhoneNumberRecords: jest.fn()
}));

jest.mock("dynamicCallFlowPhoneNumber/GraphQL/Query/Batch.Delete.Legacy.PhoneNumber.Records.Query", () => ({
  batchDeleteLegacyPhoneNumberRecords: jest.fn()
}));

jest.mock("dynamicCallFlowPhoneNumber/GraphQL/Query/Batch.Delete.Dynamic.PhoneNumber.Records.Query", () => ({
  batchDeleteDynamicPhoneNumberRecords: jest.fn()
}));

describe("Batch Phone Number Records Util", () => {
  it("should create phone number records", async () => {
    (batchCreateLegacyPhoneNumberRecords as jest.Mock).mockResolvedValue({
      errors: [],
      hasError: false,
      failure: [],
      success: LegacyPhoneNumberArray
    } as BatchResults<PhoneNumberRecordType>);
    (batchCreateDynamicPhoneNumberRecords as jest.Mock).mockResolvedValue({
      errors: [],
      hasError: false,
      failure: [],
      success: mockDynamicPhoneNumberArray()
    } as BatchResults<PhoneNumberRecordType>);
    const results = await BatchPhoneNumberRecord.create(mockAccessToken, [
      ...LegacyPhoneNumberArray,
      ...mockDynamicPhoneNumberArray()
    ]);
    expect(results.success?.length).toEqual(LegacyPhoneNumberArray.length + mockDynamicPhoneNumberArray().length);
  });

  it("should handle error during create phone number records", async () => {
    (batchCreateLegacyPhoneNumberRecords as jest.Mock).mockResolvedValue({
      hasError: true,
      failure: LegacyPhoneNumberArray,
      success: [],
      errors: [{
        message: "Create failed"
      }]
    } as BatchResults<PhoneNumberRecordType>);
    (batchCreateDynamicPhoneNumberRecords as jest.Mock).mockResolvedValue({
      hasError: true,
      failure: mockDynamicPhoneNumberArray(),
      success: [],
      errors: [{
        message: "Create failed"
      }]
    } as BatchResults<PhoneNumberRecordType>);
    const results = await BatchPhoneNumberRecord.create(mockAccessToken, [
      ...LegacyPhoneNumberArray,
      ...mockDynamicPhoneNumberArray()
    ]);
    expect(results.errors?.length).toEqual(2);
  });

  it("should delete phone number records successfully", async () => {
    (batchDeleteLegacyPhoneNumberRecords as jest.Mock).mockResolvedValue({
      errors: [],
      failure: [],
      hasError: false,
      success: LegacyPhoneNumberArray
    } as BatchResults<PhoneNumberRecordType>);
    (batchDeleteDynamicPhoneNumberRecords as jest.Mock).mockResolvedValue({
      errors: [],
      failure: [],
      hasError: false,
      success: mockDynamicPhoneNumberArray()
    } as BatchResults<PhoneNumberRecordType>);
    const results = await BatchPhoneNumberRecord.delete(mockAccessToken, [
      ...LegacyPhoneNumberArray,
      ...mockDynamicPhoneNumberArray()
    ]);
    expect(results.success.length).toEqual(LegacyPhoneNumberArray.length + mockDynamicPhoneNumberArray().length);
  });

  it("should handle error during delete legacy phone number records", async () => {
    (batchDeleteLegacyPhoneNumberRecords as jest.Mock).mockResolvedValue({
      errors: [{
        message: "error deleting records"
      }],
      failure: LegacyPhoneNumberArray,
      hasError: true,
      success: []
    } as BatchResults<PhoneNumberRecordType>);
    (batchDeleteDynamicPhoneNumberRecords as jest.Mock).mockResolvedValue({
      errors: [{
        message: "error deleting records"
      }],
      failure: mockDynamicPhoneNumberArray(),
      hasError: true,
      success: []
    } as BatchResults<PhoneNumberRecordType>);
    const results = await BatchPhoneNumberRecord.delete(mockAccessToken, LegacyPhoneNumberArray);
    expect(results.errors?.length).toEqual(2);
  });
});