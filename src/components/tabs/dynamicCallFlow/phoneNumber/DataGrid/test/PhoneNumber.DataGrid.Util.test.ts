import { BatchResults } from "dynamicCallFlowCommon/GraphQL/Abstract.BatchRecords.Query";
import { BatchPhoneNumberRecord } from "dynamicCallFlowPhoneNumber/GraphQL/Batch.PhoneNumber.Records.Util";
import {
  BrandTypeEnum, PhoneNumber,
  PhoneNumberRecordType
} from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { deleteOppositeRows } from "dynamicCallFlowPhoneNumber/DataGrid/PhoneNumber.DataGrid.Util";

describe("PhoneNumber DataGrid Util", () => {
  describe("deleteOppositeRows", () => {
    let batchPhoneNumberDeleteSpy: jest.SpyInstance;
    const dynamicPhoneNumberRecord: PhoneNumber = {
      phoneNumber: "+1234567890",
      brand: BrandTypeEnum.LIBERTY_MUTUAL,
      updateTime: 1721257399042,
      createTime: 1721257399042
    };
    const mockBatchPhoneNumberDeleteResponse: BatchResults<PhoneNumberRecordType> = {
      alertMsg: "alertMsg",
      errors: [],
      failure: [],
      hasError: false,
      success: [dynamicPhoneNumberRecord]
    };

    beforeEach(() => {
      batchPhoneNumberDeleteSpy = jest.spyOn(BatchPhoneNumberRecord, "delete").mockResolvedValue(mockBatchPhoneNumberDeleteResponse);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should call BatchPhoneNumberRecord.delete with phoneNumberRecords converted to opposite phone number format", async () => {
      const result = await deleteOppositeRows("dummyAccessToken", [dynamicPhoneNumberRecord]);

      expect(result).toStrictEqual(mockBatchPhoneNumberDeleteResponse);
      expect(batchPhoneNumberDeleteSpy).toHaveBeenCalledWith("dummyAccessToken", [{
        accountManager: "",
        affinityVDN: "",
        agentId: "",
        brand: "Liberty Mutual",
        callDetails1: "",
        callDetails2: "",
        content: {
          transferNumber: ""
        },
        createTime: "2024-07-17T23:03:19.042Z",
        pkey: "+1234567890",
        selfServiceIndicator: false,
        updateTime: "2024-07-17T23:03:19.042Z"
      }]);
    });
  });
});
