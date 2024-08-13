import {
  BRAND, GREETING_MESSAGES
} from "dynamicCallFlowPhoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import {
  BrandTypeEnum, CallFlowTypeEnum, PhoneNumber
} from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { CctSharedCallFlowDb } from "dynamicCallFlowPhoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";
import { PhoneNumberRecordUtil } from "dynamicCallFlowPhoneNumber/GraphQL/PhoneNumber.Record.Util";
import { isTrue } from "dynamicCallFlowCommon/Util/Boolean.Util";
import { deepCopyObject } from "components/tabs/dynamicCallFlow/test/dynamicCallFlow.Testing.Util";
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
});
