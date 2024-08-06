import { PhoneNumberXlsxValueInspector } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Value.Inspector";
import { testDynamicPhoneNumberXlsxRow } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/test/Dynamic.PhoneNumber.Xlsx.MockData";
import { testLegacyPhoneNumberXlsxRow } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/test/Legacy.PhoneNumber.Xlsx.MockData";
import { deepCopyObject } from "components/tabs/dynamicCallFlow/test/dynamicCallFlow.Testing.Util";
import { CallFlowTypeEnum } from "../../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { ActionTypeEnum } from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";

describe("Phone Number XLSX Value Inspector", () => {
  let phoneNumberXlsxValueInspector: PhoneNumberXlsxValueInspector;

  beforeEach(() => {
    phoneNumberXlsxValueInspector = new PhoneNumberXlsxValueInspector();
  });

  describe("inspectValues", () => {
    describe("Happy path", () => {
      describe("Dynamic and Legacy", () => {
        it("should trim any whitespace from start and end of any XLSX values", () => {
          const dynamicPhoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          const testDialedPhoneNumber = "+12345678910";
          const testGreetingMessages = "Hi there, I commend you for reading through all these unit tests!  If you are reading this, it means you are a true hero!  Thanks for reading through this entire PR! -Max";
          dynamicPhoneNumberXlsxRowCopy.dialedPhoneNumber = ` ${testDialedPhoneNumber} `;
          dynamicPhoneNumberXlsxRowCopy.greetingMessages = `                ${testGreetingMessages}          `;
          phoneNumberXlsxValueInspector.inspectValues([dynamicPhoneNumberXlsxRowCopy]);

          expect(dynamicPhoneNumberXlsxRowCopy.dialedPhoneNumber).toEqual(testDialedPhoneNumber);
          expect(dynamicPhoneNumberXlsxRowCopy.greetingMessages).toEqual(testGreetingMessages);
        });

        it("should set predictiveCaller to false when predictiveCaller is present but invalid", () => {
          const phoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          phoneNumberXlsxRowCopy.predictiveCaller = "invalidPredictiveCaller";
          const errors = phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

          expect(errors).toStrictEqual([]);
          expect(phoneNumberXlsxRowCopy.predictiveCaller).toEqual("false");
        });

        it("should set migrateSelfServiceNumberToDynamic to false when migrateSelfServiceNumberToDynamic is present but invalid", () => {
          const phoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          phoneNumberXlsxRowCopy.migrateSelfServiceNumberToDynamic = "invalidMigrateSelfServiceNumberToDynamic";
          const errors = phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

          expect(errors).toStrictEqual([]);
          expect(phoneNumberXlsxRowCopy.migrateSelfServiceNumberToDynamic).toEqual("false");
        });
      });

      describe("Dynamic", () => {
        it("should return an empty array of errors when all values are valid", () => {
          const dynamicPhoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          const errors = phoneNumberXlsxValueInspector.inspectValues([dynamicPhoneNumberXlsxRowCopy]);

          expect(errors).toStrictEqual([]);
        });

        it("should set callFlowName and callFlowType to SELFSERVICE and delete nextActionId and nextActionType when migrateSelfServiceNumberToDynamic is true", () => {
          const dynamicPhoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          delete dynamicPhoneNumberXlsxRowCopy.callFlowName;
          delete dynamicPhoneNumberXlsxRowCopy.callFlowType;
          dynamicPhoneNumberXlsxRowCopy.nextActionId = "ooga booga here is the next action, which should be deleted!";
          dynamicPhoneNumberXlsxRowCopy.nextActionType = ActionTypeEnum.MENU;
          dynamicPhoneNumberXlsxRowCopy.migrateSelfServiceNumberToDynamic = "true";
          phoneNumberXlsxValueInspector.inspectValues([dynamicPhoneNumberXlsxRowCopy]);

          expect(dynamicPhoneNumberXlsxRowCopy.callFlowName).toEqual(CallFlowTypeEnum.SELFSERVICE);
          expect(dynamicPhoneNumberXlsxRowCopy.callFlowType).toEqual(CallFlowTypeEnum.SELFSERVICE);
          expect(dynamicPhoneNumberXlsxRowCopy.nextActionId).toBeUndefined();
          expect(dynamicPhoneNumberXlsxRowCopy.nextActionType).toBeUndefined();
        });
      });

      describe("Legacy", () => {
        it("should return an empty array of errors when all values are valid", () => {
          const legacyPhoneNumberXlsxValueInspectorCopy = deepCopyObject(testLegacyPhoneNumberXlsxRow);
          const errors = phoneNumberXlsxValueInspector.inspectValues([legacyPhoneNumberXlsxValueInspectorCopy]);

          expect(errors).toStrictEqual([]);
        });

        it("should set selfServiceIndicator to false when selfServiceIndicator is present but invalid", () => {
          const phoneNumberXlsxRowCopy = deepCopyObject(testLegacyPhoneNumberXlsxRow);
          phoneNumberXlsxRowCopy.selfServiceIndicator = "invalidSelfServiceIndicator";
          phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

          expect(phoneNumberXlsxRowCopy.selfServiceIndicator).toEqual("false");
        });
      });
    });

    describe("Error path", () => {
      describe("Dynamic and Legacy", () => {
        it("should return an array of errors when dialedPhoneNumber is missing", () => {
          const phoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          phoneNumberXlsxRowCopy.dialedPhoneNumber = "";
          const errors = phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

          expect(errors).toStrictEqual(["Dialed Phone Number[] missing dialedPhoneNumber."]);
        });

        it("should return an array of errors when dialedDescription is missing", () => {
          const phoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          phoneNumberXlsxRowCopy.dialedDescription = "";
          const errors = phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

          expect(errors).toStrictEqual(["Dialed Phone Number[+12345678910] missing dialedDescription."]);
        });

        it("should return an array of errors when phoneNumberType is missing", () => {
          const phoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          phoneNumberXlsxRowCopy.phoneNumberType = "";
          const errors = phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

          expect(errors).toStrictEqual(["Dialed Phone Number[+12345678910] missing or invalid phoneNumberType."]);
        });

        it("should return an array of errors when phoneNumberType is invalid", () => {
          const phoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          phoneNumberXlsxRowCopy.phoneNumberType = "invalidPhoneNumberType";
          const errors = phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

          expect(errors).toStrictEqual(["Dialed Phone Number[+12345678910] missing or invalid phoneNumberType."]);
        });

        it("should return an array of errors when callFlowTemplate is missing", () => {
          const phoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          phoneNumberXlsxRowCopy.callFlowTemplate = "";
          const errors = phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

          expect(errors).toStrictEqual(["Dialed Phone Number[+12345678910] missing callFlowTemplate."]);
        });

        it("should return an array of errors when channel is missing", () => {
          const phoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          phoneNumberXlsxRowCopy.channel = "";
          const errors = phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

          expect(errors).toStrictEqual(["Dialed Phone Number[+12345678910] missing or invalid channel."]);
        });

        it("should return an array of errors when channel is invalid", () => {
          const phoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          phoneNumberXlsxRowCopy.channel = "invalidChannel";
          const errors = phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

          expect(errors).toStrictEqual(["Dialed Phone Number[+12345678910] missing or invalid channel."]);
        });

        it("should return an array of errors when brand is missing", () => {
          const phoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          phoneNumberXlsxRowCopy.brand = "";
          const errors = phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

          expect(errors).toStrictEqual(["Dialed Phone Number[+12345678910] missing or invalid brand."]);
        });

        it("should return an array of errors when brand is invalid", () => {
          const phoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          phoneNumberXlsxRowCopy.brand = "invalidBrand";
          const errors = phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

          expect(errors).toStrictEqual(["Dialed Phone Number[+12345678910] missing or invalid brand."]);
        });

        it("should return an array of errors when greetingMessages is missing", () => {
          const phoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          phoneNumberXlsxRowCopy.greetingMessages = "";
          const errors = phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

          expect(errors).toStrictEqual(["Dialed Phone Number[+12345678910] missing greetingMessages."]);
        });

        it("should return an array of errors when languageOffer is missing", () => {
          const phoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          phoneNumberXlsxRowCopy.languageOffer = "";
          const errors = phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

          expect(errors).toStrictEqual(["Dialed Phone Number[+12345678910] missing or invalid languageOffer."]);
        });

        it("should return an array of errors when languageOffer is invalid", () => {
          const phoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          phoneNumberXlsxRowCopy.languageOffer = "invalidLanguageOffer";
          const errors = phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

          expect(errors).toStrictEqual(["Dialed Phone Number[+12345678910] missing or invalid languageOffer."]);
        });

        it("should return an array of errors when employeeId is present but invalid", () => {
          const phoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          phoneNumberXlsxRowCopy.employeeId = "invalidEmployeeId";
          const errors = phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

          expect(errors).toStrictEqual(["Dialed Phone Number[+12345678910] missing or invalid employeeId."]);
        });
      });

      describe("Dynamic", () => {
        it("should return an array of errors when transferDestination is missing", () => {
          const phoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          phoneNumberXlsxRowCopy.transferDestination = "";
          const errors = phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

          expect(errors).toStrictEqual(["Dialed Phone Number[+12345678910] missing transferDestination."]);
        });

        it("should return an array of errors when callFlowName is missing from phoneNumber that isn't being migrated", () => {
          const phoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          phoneNumberXlsxRowCopy.callFlowName = "";
          phoneNumberXlsxRowCopy.nextActionId = "ooga booga";
          phoneNumberXlsxRowCopy.nextActionType = ActionTypeEnum.MENU;
          delete phoneNumberXlsxRowCopy.migrateSelfServiceNumberToDynamic;
          const errors = phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

          expect(errors).toStrictEqual(["Dialed Phone Number[+12345678910] missing callFlowName."]);
        });

        it("should return an array of errors when callFlowType is missing from phoneNumber that isn't being migrated", () => {
          const phoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          phoneNumberXlsxRowCopy.callFlowType = "";
          phoneNumberXlsxRowCopy.nextActionId = "ooga booga 2";
          phoneNumberXlsxRowCopy.nextActionType = ActionTypeEnum.MENU;
          delete phoneNumberXlsxRowCopy.migrateSelfServiceNumberToDynamic;
          const errors = phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

          expect(errors).toStrictEqual(["Dialed Phone Number[+12345678910] missing or invalid callFlowType."]);
        });

        it("should return an array of errors when callFlowType is invalid on phoneNumber that isn't being migrated", () => {
          const phoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          phoneNumberXlsxRowCopy.callFlowType = "invalidCallFlowType";
          phoneNumberXlsxRowCopy.nextActionId = "ooga booga 3";
          phoneNumberXlsxRowCopy.nextActionType = ActionTypeEnum.MENU;
          delete phoneNumberXlsxRowCopy.migrateSelfServiceNumberToDynamic;
          const errors = phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

          expect(errors).toStrictEqual(["Dialed Phone Number[+12345678910] missing or invalid callFlowType."]);
        });

        it("should return an array of errors when only one of nextActionId and nextActionType is present on phoneNumber that isn't being migrated", () => {
          const phoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          phoneNumberXlsxRowCopy.nextActionId = "testNextActionId";
          phoneNumberXlsxRowCopy.nextActionType = "";
          delete phoneNumberXlsxRowCopy.migrateSelfServiceNumberToDynamic;
          const errors = phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

          expect(errors).toStrictEqual(["Dialed Phone Number[+12345678910] nextActionId and nextActionType must be provided together."]);
        });

        it("should return an array of errors when nextActionType is invalid on phoneNumber that isn't being migrated", () => {
          const phoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
          phoneNumberXlsxRowCopy.nextActionId = "testNextActionId2";
          phoneNumberXlsxRowCopy.nextActionType = "invalidNextActionType";
          delete phoneNumberXlsxRowCopy.migrateSelfServiceNumberToDynamic;
          const errors = phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

          expect(errors).toStrictEqual(["Dialed Phone Number[+12345678910] invalid nextActionType."]);
        });
      });
    });
  });
});
