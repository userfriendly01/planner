import { deepCopyObject } from "components/tabs/dynamicCallFlow/test/dynamicCallFlow.Testing.Util";
import { PhoneNumberXlsxImportDynamicRecordGenerator } from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Import.Dynamic.Record.Generator";
import { testDynamicPhoneNumberXlsxRow } from "dynamicCallFlowPhoneNumber/Xlsx/test/PhoneNumber.Xlsx.MockData.Dynamic.Row";
import { DynamicPhoneNumberXlsxRow } from "dynamicCallFlowPhoneNumber/Xlsx/PhoneNumber.Xlsx.Interfaces";
import { stringToArray } from "dynamicCallFlowCommon/Util/Array.Util";
import { PhoneNumber } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { booleanValue } from "dynamicCallFlowCommon/Util/Boolean.Util";

describe("Dynamic Phone Number Xlsx Record Generator", () => {
  describe("generatePhoneNumberRecords", () => {
    it("should map Xlsx values to PhoneNumberRecords appropriately", () => {
      const dynamicPhoneNumberXlsxRowCopy = deepCopyObject<DynamicPhoneNumberXlsxRow>(testDynamicPhoneNumberXlsxRow);
      const dynamicPhoneNumberXlsxRecordGenerator = new PhoneNumberXlsxImportDynamicRecordGenerator();
      const result = dynamicPhoneNumberXlsxRecordGenerator.generatePhoneNumberRecords([dynamicPhoneNumberXlsxRowCopy]);

      expect(result).toStrictEqual([{
        brand: testDynamicPhoneNumberXlsxRow.brand,
        callFlowName: testDynamicPhoneNumberXlsxRow.callFlowName,
        callFlowRoute: testDynamicPhoneNumberXlsxRow.callFlowRoute,
        callFlowTemplate: testDynamicPhoneNumberXlsxRow.callFlowTemplate,
        callFlowType: testDynamicPhoneNumberXlsxRow.callFlowType,
        callIntent: testDynamicPhoneNumberXlsxRow.callIntent,
        callTypeDescription: testDynamicPhoneNumberXlsxRow.callTypeDescription,
        callerType: testDynamicPhoneNumberXlsxRow.callerType,
        channel: testDynamicPhoneNumberXlsxRow.channel,
        dataRequests: stringToArray(testDynamicPhoneNumberXlsxRow.dataRequests),
        dialedDescription: testDynamicPhoneNumberXlsxRow.dialedDescription,
        employeeId: testDynamicPhoneNumberXlsxRow.employeeId,
        greetingMessages: testDynamicPhoneNumberXlsxRow.greetingMessages,
        internetPlacement: testDynamicPhoneNumberXlsxRow.internetPlacement,
        languageOffer: testDynamicPhoneNumberXlsxRow.languageOffer,
        lineOfBusiness: testDynamicPhoneNumberXlsxRow.lineOfBusiness,
        marketingChannel: testDynamicPhoneNumberXlsxRow.marketingChannel,
        migrateSelfServiceNumberToDynamic: booleanValue(testDynamicPhoneNumberXlsxRow.migrateSelfServiceNumberToDynamic),
        nextActionId: testDynamicPhoneNumberXlsxRow.nextActionId,
        nextActionType: testDynamicPhoneNumberXlsxRow.nextActionType,
        officeNumbers: stringToArray(testDynamicPhoneNumberXlsxRow.officeNumbers),
        phoneNumber: testDynamicPhoneNumberXlsxRow.dialedPhoneNumber,
        phoneNumberType: testDynamicPhoneNumberXlsxRow.phoneNumberType,
        predictiveCaller: booleanValue(testDynamicPhoneNumberXlsxRow.predictiveCaller),
        rangeIndicator: testDynamicPhoneNumberXlsxRow.rangeIndicator,
        requestID: testDynamicPhoneNumberXlsxRow.requestID,
        tfnRoutingGroup: testDynamicPhoneNumberXlsxRow.tfnRoutingGroup,
        tollFreeNumber: testDynamicPhoneNumberXlsxRow.tollFreeNumber,
        transferCode: testDynamicPhoneNumberXlsxRow.transferCode,
        transferDestination: testDynamicPhoneNumberXlsxRow.transferDestination,
        whisper: testDynamicPhoneNumberXlsxRow.whisper
      } as PhoneNumber]);
    });
  });
});
