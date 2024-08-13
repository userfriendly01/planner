import {
  testDynamicPhoneNumberXlsxRow
} from "dynamicCallFlowPhoneNumber/Xlsx/test/PhoneNumber.Xlsx.MockData.Dynamic.Row";
import { deepCopyObject } from "components/tabs/dynamicCallFlow/test/dynamicCallFlow.Testing.Util";
import {
  BRAND,
  CALL_FLOW_TEMPLATE,
  CHANNEL,
  DIALED_DESCRIPTION,
  EMPLOYEE_ID,
  GREETING_MESSAGES,
  LANGUAGE_OFFER,
  PHONE_NUMBER_TYPE
} from "dynamicCallFlowPhoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import {
  PhoneNumberXlsxImportDynamicValidator
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Import.Dynamic.Validator";
import {
  PhoneNumberXlsxImportValidatorUtil
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/test/PhoneNumber.Xlsx.Import.Validator.Util";
import {
  PhoneNumberXlsxImportValidator
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Import.Interface";

describe("Phone Number XLSX Value Inspector", () => {
  const validator: PhoneNumberXlsxImportValidator = new PhoneNumberXlsxImportDynamicValidator();
  const validatorUtil = new PhoneNumberXlsxImportValidatorUtil(validator);

  describe("Happy path", () => {
    describe("Dynamic and Legacy", () => {
      it("should trim any whitespace from start and end of any XLSX values", () => {
        const dynamicPhoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
        dynamicPhoneNumberXlsxRowCopy.dialedPhoneNumber = ` ${dynamicPhoneNumberXlsxRowCopy.dialedPhoneNumber} `;
        dynamicPhoneNumberXlsxRowCopy.greetingMessages = `                ${dynamicPhoneNumberXlsxRowCopy.greetingMessages}          `;
        const errors = validator.validate([dynamicPhoneNumberXlsxRowCopy]);

        expect(errors?.length).toEqual(0);
        expect(dynamicPhoneNumberXlsxRowCopy.dialedPhoneNumber).toEqual(testDynamicPhoneNumberXlsxRow.dialedPhoneNumber);
        expect(dynamicPhoneNumberXlsxRowCopy.greetingMessages).toEqual(testDynamicPhoneNumberXlsxRow.greetingMessages);
      });
    });
  });

  describe("Error path", () => {
    it("should contain error when dialedPhoneNumber is missing", () => {
      const deepCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
      deepCopy.dialedPhoneNumber = "";
      validatorUtil.missingElementTest("dialedPhoneNumber", deepCopyObject(deepCopy));
    });

    it(`should contain error when ${DIALED_DESCRIPTION} is missing`, () => {
      validatorUtil.missingElementTest(DIALED_DESCRIPTION, deepCopyObject(testDynamicPhoneNumberXlsxRow));
    });

    it(`should contain error when ${PHONE_NUMBER_TYPE} is missing`, () => {
      validatorUtil.missingElementTest(PHONE_NUMBER_TYPE, deepCopyObject(testDynamicPhoneNumberXlsxRow));
    });

    it(`should contain error when ${PHONE_NUMBER_TYPE} is invalid`, () => {
      validatorUtil.invalidElementTest(PHONE_NUMBER_TYPE, "wackyPhoneNumberType", deepCopyObject(testDynamicPhoneNumberXlsxRow));
    });

    it(`should contain error when ${CALL_FLOW_TEMPLATE} is missing`, () => {
      validatorUtil.missingElementTest(CALL_FLOW_TEMPLATE, deepCopyObject(testDynamicPhoneNumberXlsxRow));
    });

    it(`should contain error when ${CHANNEL} is missing`, () => {
      validatorUtil.missingElementTest(CHANNEL, deepCopyObject(testDynamicPhoneNumberXlsxRow));
    });

    it(`should contain error when ${CHANNEL} is invalid`, () => {
      validatorUtil.invalidElementTest(CHANNEL, "Maintenance", deepCopyObject(testDynamicPhoneNumberXlsxRow));
    });

    it(`should contain error when ${BRAND} is missing`, () => {
      validatorUtil.invalidElementTest(BRAND, "Maintenance", deepCopyObject(testDynamicPhoneNumberXlsxRow));
    });

    it(`should contain error when ${BRAND} is invalid`, () => {
      validatorUtil.invalidElementTest(BRAND, "StarCraft", deepCopyObject(testDynamicPhoneNumberXlsxRow));
    });

    it(`should contain error when ${GREETING_MESSAGES} is missing`, () => {
      validatorUtil.missingElementTest(GREETING_MESSAGES, deepCopyObject(testDynamicPhoneNumberXlsxRow));
    });

    it(`should contain error when ${LANGUAGE_OFFER} is missing`, () => {
      validatorUtil.missingElementTest(LANGUAGE_OFFER, deepCopyObject(testDynamicPhoneNumberXlsxRow));
    });

    it(`should contain error when ${LANGUAGE_OFFER} is invalid`, () => {
      validatorUtil.invalidElementTest(LANGUAGE_OFFER, "wookie", deepCopyObject(testDynamicPhoneNumberXlsxRow));
    });

    it(`should contain error when ${EMPLOYEE_ID} is present but invalid - missing 'n'`, () => {
      validatorUtil.invalidElementTest(EMPLOYEE_ID, "012345678", deepCopyObject(testDynamicPhoneNumberXlsxRow));
    });

    it(`should contain error when ${EMPLOYEE_ID} is present but invalid - length is over 9`, () => {
      validatorUtil.invalidElementTest(EMPLOYEE_ID, "n012345678", deepCopyObject(testDynamicPhoneNumberXlsxRow));
    });
  });
});
