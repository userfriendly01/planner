import { deepCopyObject } from "components/tabs/dynamicCallFlow/test/dynamicCallFlow.Testing.Util";
import {
  BRAND, GREETING_MESSAGES
} from "dynamicCallFlowPhoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import {
  BrandTypeEnum, PhoneNumber
} from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { CctSharedCallFlowDb } from "dynamicCallFlowPhoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";
import { PhoneNumberRecordUtil } from "dynamicCallFlowPhoneNumber/GraphQL/PhoneNumber.Record.Util";
import { DynamicPhoneNumberOne } from "dynamicCallFlowPhoneNumber/GraphQL/test/Dynamic.PhoneNumber.MockData";
import { LegacyPhoneNumberOne } from "dynamicCallFlowPhoneNumber/GraphQL/test/Legacy.PhoneNumber.Record.MockData";

describe("PhoneNumberRecordUtil", () => {
  let mockPhoneNumberRecord: PhoneNumber;
  let mockLegacyPhoneNumberRecord: CctSharedCallFlowDb;

  beforeEach(() => {
    mockPhoneNumberRecord = {
      phoneNumber: "1234567890",
      brand: BrandTypeEnum.SAFECO
    } as PhoneNumber;

    mockLegacyPhoneNumberRecord = {
      pkey: "1234567890",
      brand: BrandTypeEnum.SAFECO,
      content: {
        greetingMessages: "Hello"
      }
    } as CctSharedCallFlowDb;
  });

  it("shouldReturnCorrectPkeyForDynamicPhoneNumberRecord", () => {
    expect(PhoneNumberRecordUtil.getPkey(mockPhoneNumberRecord)).toEqual("1234567890");
  });

  it("shouldReturnCorrectPkeyForLegacyPhoneNumberRecord", () => {
    expect(PhoneNumberRecordUtil.getPkey(mockLegacyPhoneNumberRecord)).toEqual("1234567890");
  });

  it("shouldIdentifyDynamicPhoneNumberRecord", () => {
    expect(PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(mockPhoneNumberRecord)).toBe(true);
    expect(PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(mockLegacyPhoneNumberRecord)).toBe(false);
  });

  it("shouldIdentifyLegacyPhoneNumberRecord", () => {
    expect(PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(mockPhoneNumberRecord)).toBe(false);
    expect(PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(mockLegacyPhoneNumberRecord)).toBe(true);
  });

  it("shouldReturnCorrectPropertyValueForDynamicPhoneNumberRecord", () => {
    expect(PhoneNumberRecordUtil.getPropertyValue(mockPhoneNumberRecord, BRAND)).toEqual(BrandTypeEnum.SAFECO);
  });

  it("shouldReturnCorrectPropertyValueForLegacyPhoneNumberRecord", () => {
    expect(PhoneNumberRecordUtil.getPropertyValue(mockLegacyPhoneNumberRecord, GREETING_MESSAGES)).toEqual("Hello");
  });

  it("shouldValidateGreetingMessage", () => {
    expect(PhoneNumberRecordUtil.isValidGreetingMessage("Hello")).toBe(false);
  });

  it("shouldSetPropertyValueForDynamicPhoneNumberRecord", () => {
    PhoneNumberRecordUtil.setPropertyValue(mockPhoneNumberRecord, "brand", "Brand2");
    expect(mockPhoneNumberRecord.brand).toEqual("Brand2");
  });

  it("shouldSetPropertyValueForLegacyPhoneNumberRecord", () => {
    PhoneNumberRecordUtil.setPropertyValue(mockLegacyPhoneNumberRecord, GREETING_MESSAGES, "Hi");
    expect(mockLegacyPhoneNumberRecord.content?.greetingMessages).toEqual("Hi");
  });

  it("shouldRemoveTransientPropertiesForDynamicPhoneNumberRecord", () => {
    const phoneNumberRecordWithTransientProperties = {
      ...mockPhoneNumberRecord,
      pkey: "somevalue",
      id: "someid"
    };

    expect(phoneNumberRecordWithTransientProperties.pkey).toBeDefined();
    expect(phoneNumberRecordWithTransientProperties.id).toBeDefined();

    PhoneNumberRecordUtil.removeTransientProperties(phoneNumberRecordWithTransientProperties);

    expect(phoneNumberRecordWithTransientProperties.pkey).toBeUndefined();
    expect(phoneNumberRecordWithTransientProperties.id).toBeUndefined();
  });

  it("shouldRemoveTransientPropertiesForLegacyPhoneNumberRecord", () => {
    const phoneNumberRecordWithTransientProperties = {
      ...mockLegacyPhoneNumberRecord,
      id: "someid"
    };

    expect(phoneNumberRecordWithTransientProperties.pkey).toBeDefined();
    expect(phoneNumberRecordWithTransientProperties.id).toBeDefined();

    PhoneNumberRecordUtil.removeTransientProperties(phoneNumberRecordWithTransientProperties);

    expect(phoneNumberRecordWithTransientProperties.pkey).toBeDefined();
    expect(phoneNumberRecordWithTransientProperties.id).toBeUndefined();
  });

  it("shouldReturnTrueForIsDynamicPhoneNumberRecord", () => {
    const phoneNumberRecord = {
      phoneNumber: undefined
    } as PhoneNumber;

    expect(PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(phoneNumberRecord)).toEqual(true);
  });

  describe("convertPhoneNumberRecord", () => {
    it("should convert dynamic call flow phone number record to legacy phone number record", () => {
      const dynamicPhoneNumberRecordCopy = deepCopyObject(DynamicPhoneNumberOne);

      expect(PhoneNumberRecordUtil.convertPhoneNumberRecord(dynamicPhoneNumberRecordCopy)).toStrictEqual({
        accountManager: "",
        affinityVDN: "",
        agentId: "",
        brand: "Safeco",
        callDetails1: "",
        callDetails2: "",
        callFlowTemplate: "LSC",
        callTypeDescription: "LSC",
        channel: "Claims",
        content: {
          callFlowRoute: "call flow route",
          callIntent: "call intent",
          callerType: "Customer",
          dataRequests: [
            "data request"
          ],
          greetingMessages: "Hello",
          languageOffer: "English",
          officeNumbers: [
            "office number"
          ],
          transferNumber: ""
        },
        createTime: "2024-04-10T13:33:53.000Z",
        dialedDescription: "testing phone number record",
        employeeId: "n0000000",
        internetPlacement: "internet placement",
        lineOfBusiness: "line of business",
        marketingChannel: "marketing channel",
        pkey: "8005550001",
        predictiveCaller: false,
        rangeIndicator: "range indicator",
        requestID: "request id",
        selfServiceIndicator: false,
        tfnRoutingGroup: "tfn routing group",
        tollFreeNumber: "8005551212",
        transferCode: "005",
        type: "TFN",
        updateTime: "2024-04-10T13:33:53.000Z",
        userDestination: "transfer destination",
        whisper: "whisper"
      });
    });

    it("should convert legacy phone number record to dynamic call flow phone number record", () => {
      const legacyPhoneNumberRecordCopy = deepCopyObject(LegacyPhoneNumberOne);

      expect(PhoneNumberRecordUtil.convertPhoneNumberRecord(legacyPhoneNumberRecordCopy)).toStrictEqual({
        brand: "Safeco",
        callFlowName: "",
        callFlowRoute: "call flow route",
        callFlowTemplate: "LSC",
        callFlowType: "DTMF",
        callIntent: "call intent",
        callTypeDescription: "LSC",
        callerType: "Customer",
        channel: "Claims",
        createTime: 1712756033,
        dataRequests: ["data request"],
        dialedDescription: "testing phone number record",
        employeeId: "n0000000",
        greetingMessages: "Hello",
        internetPlacement: "internet placement",
        languageOffer: "English",
        lineOfBusiness: "line of business",
        marketingChannel: "marketing channel",
        officeNumbers: ["office number"],
        phoneNumber: "8004440001",
        phoneNumberType: "TFN",
        predictiveCaller: false,
        rangeIndicator: "range indicator",
        requestID: "request id",
        tfnRoutingGroup: "tfn routing group",
        tollFreeNumber: "8005551212",
        transferCode: "005",
        transferDestination: "user destination",
        updateTime: 1712756033,
        whisper: "whisper"
      });
    });
  });
});
