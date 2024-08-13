import {
  PhoneNumberXlsxImportAbstractValidator, buildErrorMessage
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Import.Abstract.Validator";
import {
  testDynamicPhoneNumberXlsxRow,
  testMigratingDynamicPhoneNumberXlsxRow, testSelfServiceDynamicPhoneNumberXlsxRow
} from "dynamicCallFlowPhoneNumber/Xlsx/test/PhoneNumber.Xlsx.MockData.Dynamic.Row";
import { testLegacyPhoneNumberXlsxRow } from "dynamicCallFlowPhoneNumber/Xlsx/test/PhoneNumber.Xlsx.MockData.Legacy.Row";
import { deepCopyObject } from "components/tabs/dynamicCallFlow/test/dynamicCallFlow.Testing.Util";
import { CallFlowTypeEnum } from "../../../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { ActionTypeEnum } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import { PhoneNumberXlsxRow } from "dynamicCallFlowPhoneNumber/Xlsx/PhoneNumber.Xlsx.Interfaces";
import {
  BRAND, CALL_FLOW_NAME, CALL_FLOW_TEMPLATE, CALL_FLOW_TYPE,
  CHANNEL, DIALED_DESCRIPTION,
  EMPLOYEE_ID, GREETING_MESSAGES,
  LANGUAGE_OFFER, NEXT_ACTION_ID, NEXT_ACTION_TYPE, PHONE_NUMBER_TYPE, TRANSFER_DESTINATION
} from "dynamicCallFlowPhoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import {
  PhoneNumberXlsxImportDynamicValidator
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Import.Dynamic.Validator";
import {
  PhoneNumberXlsxImportLegacyValidator
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Import.Legacy.Validator";
import {
  PhoneNumberXlsxImportValidatorUtil
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/test/PhoneNumber.Xlsx.Import.Validator.Util";
import { booleanAsString } from "dynamicCallFlowCommon/Util/Boolean.Util";
import {
  PhoneNumberXlsxImportValidator
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Import.Interface";

describe("Dynamic Phone Number XLSX Value Validator", () => {
  const validator: PhoneNumberXlsxImportValidator = new PhoneNumberXlsxImportDynamicValidator();
  const validatorUtil = new PhoneNumberXlsxImportValidatorUtil(validator);


  it("shouldLogErrorWhenNextActionIdIsSetForSelfServicePhoneNumber", () => {
    const xlsxRow = deepCopyObject(testDynamicPhoneNumberXlsxRow);
    xlsxRow.callFlowType = CallFlowTypeEnum.SELFSERVICE;
    xlsxRow.nextActionId = "someActionId";
    validatorUtil.elementShouldBeMissingTest(NEXT_ACTION_ID, xlsxRow,`${NEXT_ACTION_ID} should not be set when ${CALL_FLOW_TYPE} is ${CallFlowTypeEnum.SELFSERVICE}.`);
  });

  it("shouldNotLogErrorWhenNextActionIdIsNotSetForSelfServicePhoneNumber", () => {
    const xlsxRow = deepCopyObject(testDynamicPhoneNumberXlsxRow);
    xlsxRow.callFlowType = CallFlowTypeEnum.SELFSERVICE;
    xlsxRow.nextActionId = "";
    xlsxRow.nextActionType = "";
    validatorUtil.shouldNotContainErrorMessageTest(xlsxRow);
  });

  it("shouldNotLogErrorWhenNextActionIdIsNotSetForMigratedSelfServicePhoneNumber", () => {
    const xlsxRow = deepCopyObject(testSelfServiceDynamicPhoneNumberXlsxRow);
    validatorUtil.shouldNotContainErrorMessageTest(xlsxRow);
  });

  describe("Happy path", () => {
    it("should return an empty array of errors when all values are valid", () => {
      const xlsxRow = deepCopyObject(testDynamicPhoneNumberXlsxRow);
      const errors = validator.validate([xlsxRow]);

      expect(errors).toStrictEqual([]);
    });
  });

  describe("Error path", () => {
    it(`should return an array of errors when ${TRANSFER_DESTINATION} is missing`, () => {
      validatorUtil.missingElementTest(TRANSFER_DESTINATION, deepCopyObject(testDynamicPhoneNumberXlsxRow));
    });

    it(`should return an array of errors when ${CALL_FLOW_NAME} is missing`, () => {
      validatorUtil.missingElementTest(CALL_FLOW_NAME, deepCopyObject(testDynamicPhoneNumberXlsxRow));
    });

    it(`should return an array of errors when ${CALL_FLOW_TYPE} is missing`, () => {
      validatorUtil.missingElementTest(CALL_FLOW_TYPE, deepCopyObject(testDynamicPhoneNumberXlsxRow));
    });

    it(`should return an array of errors when ${CALL_FLOW_TYPE} is invalid`, () => {
      validatorUtil.invalidElementTest(CALL_FLOW_TYPE, "BOT", deepCopyObject(testDynamicPhoneNumberXlsxRow));
    });

    it(`should return an array of errors when missing ${NEXT_ACTION_ID}`, () => {
      validatorUtil.missingElementTest(NEXT_ACTION_ID, deepCopyObject(testDynamicPhoneNumberXlsxRow));
    });

    // it(`should return an array of errors when missing ${NEXT_ACTION_TYPE}`, () => {
    //   validatorUtil.missingElementTest(NEXT_ACTION_TYPE, deepCopyObject(testDynamicPhoneNumberXlsxRow));
    // });

    it(`should return an array of errors when ${NEXT_ACTION_TYPE} is invalid`, () => {
      validatorUtil.invalidElementTest(NEXT_ACTION_TYPE, "REDIAL", deepCopyObject(testDynamicPhoneNumberXlsxRow));
    });
  });
});
