import {
  testDynamicPhoneNumberXlsxRow,
  testSelfServiceDynamicPhoneNumberXlsxRow
} from "dynamicCallFlowPhoneNumber/Xlsx/test/PhoneNumber.Xlsx.MockData.Dynamic.Row";
import { deepCopyObject } from "dynamicCallFlowCommon/test/DynamicCallFlow.Testing.Util";
import { CallFlowTypeEnum } from "../../../GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  CALL_FLOW_NAME,
  CALL_FLOW_TYPE,
  NEXT_ACTION_ID,
  NEXT_ACTION_TYPE,
  TRANSFER_DESTINATION
} from "dynamicCallFlowPhoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import {
  PhoneNumberXlsxImportDynamicValidator
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Import.Dynamic.Validator";
import {
  PhoneNumberXlsxImportValidatorTestingUtil
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/test/PhoneNumber.Xlsx.Import.Validator.Testing.Util";
import {
  PhoneNumberXlsxImportValidator
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Import.Interface";

describe("Dynamic Phone Number XLSX Value Validator", () => {
  const validator: PhoneNumberXlsxImportValidator = new PhoneNumberXlsxImportDynamicValidator();
  const validatorUtil = new PhoneNumberXlsxImportValidatorTestingUtil(validator);


  it("should log error when NextActionIdIsSetForSelfServicePhoneNumber", () => {
    const xlsxRow = deepCopyObject(testDynamicPhoneNumberXlsxRow);
    xlsxRow.callFlowType = CallFlowTypeEnum.SELFSERVICE;
    xlsxRow.nextActionId = "someActionId";
    validatorUtil.elementShouldBeMissingTest(NEXT_ACTION_ID, xlsxRow,`${NEXT_ACTION_ID} should not be set when ${CALL_FLOW_TYPE} is ${CallFlowTypeEnum.SELFSERVICE}.`);
  });

  it("should not log error when NextActionIdIsNotSetForSelfServicePhoneNumber", () => {
    const xlsxRow = deepCopyObject(testDynamicPhoneNumberXlsxRow);
    xlsxRow.callFlowType = CallFlowTypeEnum.SELFSERVICE;
    xlsxRow.nextActionId = "";
    xlsxRow.nextActionType = "";
    validatorUtil.shouldNotContainErrorMessageTest(xlsxRow);
  });

  it("should not log error when NextActionIdIsNotSetForMigratedSelfServicePhoneNumber", () => {
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

  it("should log error when NextActionTypeIsSetForMigratedSelfServicePhoneNumber", () => {
    const xlsxRow = deepCopyObject(testDynamicPhoneNumberXlsxRow);
    xlsxRow.migrateSelfServiceNumberToDynamic = "true";
    xlsxRow.nextActionType = "someActionType";
    validatorUtil.elementShouldBeMissingTest(NEXT_ACTION_TYPE, xlsxRow, `${NEXT_ACTION_TYPE} should not be set for migrated self service phone numbers.`);
  });

  it("should not log error for a self service phone number being migrated has a callFlowTemplate not set to SELFSERVICE", () => {
    const xlsxRow = deepCopyObject(testDynamicPhoneNumberXlsxRow);
    xlsxRow.migrateSelfServiceNumberToDynamic = "true";
    xlsxRow.nextActionType = "";
    xlsxRow.nextActionId = "";
    xlsxRow.callFlowName = CallFlowTypeEnum.SELFSERVICE;
    xlsxRow.callFlowType = CallFlowTypeEnum.SELFSERVICE;
    xlsxRow.callFlowTemplate = "someCallFlowTemplate";
    validatorUtil.shouldNotContainErrorMessageTest(xlsxRow);
  });

  it("should not log error when NextActionType and ActionId IsNotSetForMigratedSelfServicePhoneNumber", () => {
    const xlsxRow = deepCopyObject(testDynamicPhoneNumberXlsxRow);
    xlsxRow.migrateSelfServiceNumberToDynamic = "true";
    xlsxRow.nextActionType = "";
    xlsxRow.nextActionId = "";
    xlsxRow.callFlowName = CallFlowTypeEnum.SELFSERVICE;
    xlsxRow.callFlowTemplate = CallFlowTypeEnum.SELFSERVICE;
    xlsxRow.callFlowType = CallFlowTypeEnum.SELFSERVICE;
    validatorUtil.shouldNotContainErrorMessageTest(xlsxRow);
  });
});
