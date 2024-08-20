import {
  BRAND, CREATE_TIME, DATA_REQUESTS, EMPLOYEE_ID, GREETING_MESSAGES, PHONE_NUMBER, PREDICTIVE_CALLER
} from "dynamicCallFlowPhoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import {
  BrandTypeEnum, CallFlowTypeEnum, PhoneNumber
} from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { CctSharedCallFlowDb } from "dynamicCallFlowPhoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";
import { PhoneNumberRecordUtil } from "dynamicCallFlowPhoneNumber/GraphQL/PhoneNumber.Record.Util";
import { isTrue } from "dynamicCallFlowCommon/Util/Boolean.Util";
import { deepCopyObject } from "components/tabs/dynamicCallFlow/test/dynamicCallFlow.Testing.Util";
import {
  DynamicPhoneNumberOne
} from "dynamicCallFlowPhoneNumber/GraphQL/test/Dynamic.PhoneNumber.MockData";
import { LegacyPhoneNumberOne } from "dynamicCallFlowPhoneNumber/GraphQL/test/Legacy.PhoneNumber.Record.MockData";
import { now } from "lodash";
import { PKEY } from "dynamicCallFlowPhoneNumber/Form/Legacy.PhoneNumber.Form.Fields";

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

  it("should not find enum", () => {
    // const phoneNumberXlsxRow = {
    //   migrateSelfServiceNumberToDynamic: "n"
    // } as PhoneNumberXlsxRow;
    const migrateSelfServiceNumberToDynamic = isTrue("true");
    // const isNotValidCallFlowType = !/^\+1\d+$/.test("");
    expect(migrateSelfServiceNumberToDynamic).toEqual(true);
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

  it("shouldSetPropertyValueForDynamicPhoneNumberRecord", () => {
    PhoneNumberRecordUtil.setPropertyValue(mockPhoneNumberRecord, BRAND, "Brand2");
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
        brand: DynamicPhoneNumberOne.brand,
        callDetails1: "",
        callDetails2: "",
        callFlowTemplate: DynamicPhoneNumberOne.callFlowTemplate,
        callTypeDescription: DynamicPhoneNumberOne.callTypeDescription,
        channel: DynamicPhoneNumberOne.channel,
        content: {
          callFlowRoute: DynamicPhoneNumberOne.callFlowRoute,
          callIntent: DynamicPhoneNumberOne.callIntent,
          callerType: DynamicPhoneNumberOne.callerType,
          dataRequests: DynamicPhoneNumberOne.dataRequests,
          greetingMessages: DynamicPhoneNumberOne.greetingMessages,
          languageOffer: DynamicPhoneNumberOne.languageOffer,
          officeNumbers: DynamicPhoneNumberOne.officeNumbers,
          transferNumber: ""
        },
        createTime: (DynamicPhoneNumberOne.createTime ? new Date(DynamicPhoneNumberOne.createTime) : new Date()).toISOString(),
        dialedDescription: DynamicPhoneNumberOne.dialedDescription,
        employeeId: DynamicPhoneNumberOne.employeeId,
        internetPlacement: DynamicPhoneNumberOne.internetPlacement,
        lineOfBusiness: DynamicPhoneNumberOne.lineOfBusiness,
        marketingChannel: DynamicPhoneNumberOne.marketingChannel,
        pkey: DynamicPhoneNumberOne.phoneNumber,
        predictiveCaller: DynamicPhoneNumberOne.predictiveCaller,
        rangeIndicator: DynamicPhoneNumberOne.rangeIndicator,
        requestID: DynamicPhoneNumberOne.requestID,
        selfServiceIndicator: false,
        tfnRoutingGroup: DynamicPhoneNumberOne.tfnRoutingGroup,
        tollFreeNumber: DynamicPhoneNumberOne.tollFreeNumber,
        transferCode: DynamicPhoneNumberOne.transferCode,
        type: DynamicPhoneNumberOne.phoneNumberType,
        updateTime: (DynamicPhoneNumberOne.updateTime ? new Date(DynamicPhoneNumberOne.updateTime) : new Date()).toISOString(),
        userDestination: DynamicPhoneNumberOne.transferDestination,
        whisper: DynamicPhoneNumberOne.whisper
      });
    });

    it("should convert legacy phone number record to dynamic call flow phone number record", () => {
      const legacyPhoneNumberRecordCopy = deepCopyObject(LegacyPhoneNumberOne);

      expect(PhoneNumberRecordUtil.convertPhoneNumberRecord(legacyPhoneNumberRecordCopy)).toStrictEqual({
        brand: LegacyPhoneNumberOne.brand,
        callFlowName: "",
        callFlowRoute: LegacyPhoneNumberOne.content.callFlowRoute,
        callFlowTemplate: LegacyPhoneNumberOne.callFlowTemplate,
        callFlowType: LegacyPhoneNumberOne.selfServiceIndicator === true ? CallFlowTypeEnum.SELFSERVICE : CallFlowTypeEnum.DTMF,
        callIntent: LegacyPhoneNumberOne.content.callIntent,
        callTypeDescription: LegacyPhoneNumberOne.callTypeDescription,
        callerType: LegacyPhoneNumberOne.content.callerType,
        channel: LegacyPhoneNumberOne.channel,
        createTime: Math.floor((LegacyPhoneNumberOne.createTime ? new Date(LegacyPhoneNumberOne.createTime) : new Date()).getTime() / 1000),
        dataRequests: LegacyPhoneNumberOne.content.dataRequests,
        dialedDescription: LegacyPhoneNumberOne.dialedDescription,
        employeeId: LegacyPhoneNumberOne.employeeId,
        greetingMessages: LegacyPhoneNumberOne.content.greetingMessages,
        internetPlacement: LegacyPhoneNumberOne.internetPlacement,
        languageOffer: LegacyPhoneNumberOne.content.languageOffer,
        lineOfBusiness: LegacyPhoneNumberOne.lineOfBusiness,
        marketingChannel: LegacyPhoneNumberOne.marketingChannel,
        officeNumbers: LegacyPhoneNumberOne.content.officeNumbers,
        phoneNumber: LegacyPhoneNumberOne.pkey,
        phoneNumberType: LegacyPhoneNumberOne.type,
        predictiveCaller: LegacyPhoneNumberOne.predictiveCaller,
        rangeIndicator: LegacyPhoneNumberOne.rangeIndicator,
        requestID: LegacyPhoneNumberOne.requestID,
        tfnRoutingGroup: LegacyPhoneNumberOne.tfnRoutingGroup,
        tollFreeNumber: LegacyPhoneNumberOne.tollFreeNumber,
        transferCode: LegacyPhoneNumberOne.transferCode,
        transferDestination: LegacyPhoneNumberOne.userDestination,
        updateTime: Math.floor((LegacyPhoneNumberOne.updateTime ? new Date(LegacyPhoneNumberOne.updateTime) : new Date()).getTime() / 1000),
        whisper: LegacyPhoneNumberOne.whisper
      });
    });
  });
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
        content: {}
      } as CctSharedCallFlowDb;
    });

    it("should return correct phone number for dynamic phone number record", () => {
      expect(PhoneNumberRecordUtil.getPhoneNumber(mockPhoneNumberRecord)).toEqual("1234567890");
    });

    it("should return undefined phone number for dynamic phone number record", () => {
      expect(PhoneNumberRecordUtil.getPhoneNumber(undefined)).toBeFalsy();
    });

    it("should return correct phone number for legacy phone number record", () => {
      expect(PhoneNumberRecordUtil.getPhoneNumber(mockLegacyPhoneNumberRecord)).toEqual("1234567890");
    });

    it("should set phone number for dynamic phone number record", () => {
      PhoneNumberRecordUtil.setPhoneNumber(mockPhoneNumberRecord, "0987654321");
      expect(mockPhoneNumberRecord.phoneNumber).toEqual("0987654321");
    });

    it("should handle when phoneNumber undefined", () => {
      PhoneNumberRecordUtil.setPhoneNumber(undefined, "0987654321");
    });

    it("should set phone number for legacy phone number record", () => {
      PhoneNumberRecordUtil.setPhoneNumber(mockLegacyPhoneNumberRecord, "0987654321");
      expect(mockLegacyPhoneNumberRecord.pkey).toEqual("0987654321");
    });

    it("should filter dynamic phone number records", () => {
      const records = [mockPhoneNumberRecord, mockLegacyPhoneNumberRecord];
      const result = PhoneNumberRecordUtil.filterDynamicPhoneNumberRecords(records);
      expect(result).toEqual([mockPhoneNumberRecord]);
    });

    it("should filter legacy phone number records", () => {
      const records = [mockPhoneNumberRecord, mockLegacyPhoneNumberRecord];
      const result = PhoneNumberRecordUtil.filterLegacyPhoneNumberRecords(records);
      expect(result).toEqual([mockLegacyPhoneNumberRecord]);
    });

    it("should identify dynamic phone number record", () => {
      expect(PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(mockPhoneNumberRecord)).toBe(true);
      expect(PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(mockLegacyPhoneNumberRecord)).toBe(false);
    });

    it("should identify legacy phone number record", () => {
      expect(PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(mockPhoneNumberRecord)).toBe(false);
      expect(PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(mockLegacyPhoneNumberRecord)).toBe(true);
    });

    it("should return correct property value for dynamic phone number record", () => {
      expect(PhoneNumberRecordUtil.getPropertyValue(mockPhoneNumberRecord, BRAND)).toEqual(BrandTypeEnum.SAFECO);
    });

    it("should return array property value for dynamic phone number record", () => {
      mockPhoneNumberRecord.dataRequests = ["classify"];
      expect(PhoneNumberRecordUtil.getPropertyArrayValue(mockPhoneNumberRecord, DATA_REQUESTS)).toEqual(["classify"]);
    });

    it("should return array property as string value for dynamic phone number record", () => {
      mockPhoneNumberRecord.dataRequests = ["classify"];
      expect(PhoneNumberRecordUtil.getPropertyArrayValueAsString(mockPhoneNumberRecord, DATA_REQUESTS)).toEqual("classify");
    });

    it("should return property as string value for dynamic phone number record", () => {
      expect(PhoneNumberRecordUtil.getPropertyStringValue(mockPhoneNumberRecord, PHONE_NUMBER)).toEqual("1234567890");
    });

    it("should return property as boolean value for dynamic phone number record", () => {
      mockPhoneNumberRecord.predictiveCaller = true;
      expect(PhoneNumberRecordUtil.getPropertyBooleanValue(mockPhoneNumberRecord, PREDICTIVE_CALLER)).toEqual(true);
    });

    it("should return correct property value for legacy phone number record", () => {
      mockLegacyPhoneNumberRecord.content.greetingMessages = "Hello";
      expect(PhoneNumberRecordUtil.getPropertyValue(mockLegacyPhoneNumberRecord, "greetingMessages")).toEqual("Hello");
    });

    it("should validate greeting message to be true", () => {
      expect(PhoneNumberRecordUtil.isValidGreetingMessage("Hello")).toBe(true);
    });

    it("should validate greeting message to be false", () => {
      expect(PhoneNumberRecordUtil.isValidGreetingMessage("Hello!")).toBe(false);
    });

    it("should set property value for dynamic phone number record", () => {
      PhoneNumberRecordUtil.setPropertyValue(mockPhoneNumberRecord, BRAND, "Brand2");
      expect(mockPhoneNumberRecord.brand).toEqual("Brand2");
    });

    it("should handle undefined record for set property value", () => {
      PhoneNumberRecordUtil.setPropertyValue(undefined, BRAND, "Brand2");
    });

    it("should handle invalid key for record for set property value", () => {
      PhoneNumberRecordUtil.setPropertyValue(mockPhoneNumberRecord, "invalid", "Brand2");
    });

    it("should handle content missing for legacy record for set property value", () => {
      delete mockLegacyPhoneNumberRecord.content;
      PhoneNumberRecordUtil.setPropertyValue(mockLegacyPhoneNumberRecord, GREETING_MESSAGES, "welcome");
    });

    // it("should set phone number value for dynamic phone number record when pkey key", () => {
    //   PhoneNumberRecordUtil.setPropertyValue(mockPhoneNumberRecord, PKEY, "+18008881234567");
    //   expect(mockPhoneNumberRecord.phoneNumber).toEqual("+18008881234567");
    // });

    it("should set array property value for legacy phone number record", () => {
      PhoneNumberRecordUtil.setArrayPropertyValue(mockLegacyPhoneNumberRecord, DATA_REQUESTS, "classify");
      expect(mockLegacyPhoneNumberRecord.content.dataRequests).toEqual(["classify"]);
    });

    it("should set array property value for dynamic phone number record", () => {
      PhoneNumberRecordUtil.setArrayPropertyValue(mockPhoneNumberRecord, DATA_REQUESTS, "classify");
      expect(mockPhoneNumberRecord.dataRequests).toEqual(["classify"]);
    });

    it("should set string property value for dynamic phone number record", () => {
      PhoneNumberRecordUtil.setStringValue(mockPhoneNumberRecord, GREETING_MESSAGES, "Hello");
      expect(mockPhoneNumberRecord.greetingMessages).toEqual("Hello");
    });

    it("should set number property value for dynamic phone number record", () => {
      const time = now();
      PhoneNumberRecordUtil.setNumberValue(mockPhoneNumberRecord, CREATE_TIME, String(time));
      expect(mockPhoneNumberRecord.createTime).toEqual(time);
    });

    it("should set boolean property value for dynamic phone number record", () => {
      PhoneNumberRecordUtil.setBooleanValue(mockPhoneNumberRecord, PREDICTIVE_CALLER, "true");
      expect(mockPhoneNumberRecord.predictiveCaller).toEqual(true);
    });

    it("should remove batch transient properties for dynamic phone number record", () => {
      const phoneNumberRecordWithTransientProperties = {
        ...mockPhoneNumberRecord,
        pkey: "somevalue",
        id: "someid"
      };

      PhoneNumberRecordUtil.batchRemoveTransientProperties([phoneNumberRecordWithTransientProperties]);

      expect(phoneNumberRecordWithTransientProperties.pkey).toBeUndefined();
      expect(phoneNumberRecordWithTransientProperties.id).toBeUndefined();
    });

    it("should remove transient properties for dynamic phone number record", () => {
      mockPhoneNumberRecord.employeeId = undefined;
      PhoneNumberRecordUtil.removeNonNullableKeys(mockPhoneNumberRecord);
      expect(Object.keys(mockPhoneNumberRecord).includes(EMPLOYEE_ID)).toBe(false);
    });

    it("should remove transient properties for dynamic phone number record", () => {
      const phoneNumberRecordWithTransientProperties = {
        ...mockPhoneNumberRecord,
        pkey: "somevalue",
        id: "someid"
      };

      PhoneNumberRecordUtil.removeTransientProperties(phoneNumberRecordWithTransientProperties);

      expect(phoneNumberRecordWithTransientProperties.pkey).toBeUndefined();
      expect(phoneNumberRecordWithTransientProperties.id).toBeUndefined();
    });

    it("should remove transient properties for legacy phone number record", () => {
      const phoneNumberRecordWithTransientProperties = {
        ...mockLegacyPhoneNumberRecord,
        id: "someid"
      };

      PhoneNumberRecordUtil.removeTransientProperties(phoneNumberRecordWithTransientProperties);

      expect(phoneNumberRecordWithTransientProperties.pkey).toBeDefined();
      expect(phoneNumberRecordWithTransientProperties.id).toBeUndefined();
    });

    it("should convert dynamic call flow phone number record to legacy phone number record", () => {
      const dynamicPhoneNumberRecordCopy = deepCopyObject(mockPhoneNumberRecord);
      const legacyPhoneNumberRecord = PhoneNumberRecordUtil.convertPhoneNumberRecord(dynamicPhoneNumberRecordCopy);
      expect((legacyPhoneNumberRecord as CctSharedCallFlowDb).pkey).toStrictEqual("1234567890");
      expect((legacyPhoneNumberRecord as CctSharedCallFlowDb).brand).toEqual(BrandTypeEnum.SAFECO);
    });

    it("should convert legacy phone number record to dynamic call flow phone number record", () => {
      const legacyPhoneNumberRecordCopy = deepCopyObject(mockLegacyPhoneNumberRecord);
      const dynamicPhoneNumberRecord = PhoneNumberRecordUtil.convertPhoneNumberRecord(legacyPhoneNumberRecordCopy);
      expect((dynamicPhoneNumberRecord as PhoneNumber).phoneNumber).toEqual("1234567890");
      expect((dynamicPhoneNumberRecord as PhoneNumber).brand).toEqual(BrandTypeEnum.SAFECO);
    });
  });
});
