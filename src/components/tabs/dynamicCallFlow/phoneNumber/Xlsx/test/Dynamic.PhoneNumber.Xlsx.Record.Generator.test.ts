import { deepCopyObject } from "components/tabs/dynamicCallFlow/test/dynamicCallFlow.Testing.Util";
import { DynamicPhoneNumberXlsxRecordGenerator } from "dynamicCallFlowPhoneNumber/Xlsx/Import/Dynamic.PhoneNumber.Xlsx.Record.Generator";
import { testDynamicPhoneNumberXlsxRow } from "dynamicCallFlowPhoneNumber/Xlsx/test/Dynamic.PhoneNumber.Xlsx.MockData";

describe("Dynamic Phone Number Xlsx Record Generator", () => {
  describe("generatePhoneNumberRecords", () => {
    it("should map Xlsx values to PhoneNumberRecords appropriately", () => {
      const dynamicPhoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
      const dynamicPhoneNumberXlsxRecordGenerator = new DynamicPhoneNumberXlsxRecordGenerator();
      const result = dynamicPhoneNumberXlsxRecordGenerator.generatePhoneNumberRecords([dynamicPhoneNumberXlsxRowCopy]);

      expect(result).toStrictEqual([{
        brand: "Liberty Mutual",
        callFlowName: "SELFSERVICE",
        callFlowRoute: "testDynamicCallFlowRoute",
        callFlowTemplate: "testDynamicCallFlowTemplate",
        callFlowType: "SELFSERVICE",
        callIntent: "testDynamicCallIntent",
        callTypeDescription: "testDynamicCallTypeDescription",
        callerType: "Customer",
        channel: "Service",
        dataRequests: ["testDynamicDataRequests"],
        dialedDescription: "testDynamicDialedDescription",
        employeeId: "testDynamicEmployeeId",
        greetingMessages: "testDynamicGreetingMessages",
        internetPlacement: "testDynamicInternetPlacement",
        languageOffer: "English",
        lineOfBusiness: "testDynamicLineOfBusiness",
        marketingChannel: "testDynamicMarketingChannel",
        migrateSelfServiceNumberToDynamic: true,
        nextActionId: "",
        nextActionType: "",
        officeNumbers: ["officeNumbers"],
        phoneNumber: "+12345678910",
        phoneNumberType: "TFN",
        predictiveCaller: false,
        rangeIndicator: "testDynamicRangeIndicator",
        requestID: "requestID",
        tfnRoutingGroup: "testDynamicTfnRoutingGroup",
        tollFreeNumber: "testDynamicTollFreeNumber",
        transferCode: "testDynamicTransferCode",
        transferDestination: "testDynamicTransferDestination",
        whisper: "testDynamicWhisper"
      }]);
    });
  });
});
