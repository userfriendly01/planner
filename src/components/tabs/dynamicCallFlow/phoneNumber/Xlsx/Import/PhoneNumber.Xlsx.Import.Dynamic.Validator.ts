import {
  PhoneNumberXlsxImportAbstractValidator
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Import.Abstract.Validator";
import { DynamicPhoneNumberXlsxRow } from "dynamicCallFlowPhoneNumber/Xlsx/PhoneNumber.Xlsx.Interfaces";
import {
  CALL_FLOW_NAME,
  CALL_FLOW_TEMPLATE,
  CALL_FLOW_TYPE,
  NEXT_ACTION_ID,
  NEXT_ACTION_TYPE,
  TRANSFER_DESTINATION
} from "dynamicCallFlowPhoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import { CallFlowTypeEnum } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { isTrue } from "dynamicCallFlowCommon/Util/Boolean.Util";
import { ActionTypeEnum } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";

export class PhoneNumberXlsxImportDynamicValidator extends PhoneNumberXlsxImportAbstractValidator {

  /**
   * Inspects and validates phone number fields specific to dynamic phone numbers.
   * @param dynamicPhoneNumberXlsxRow - The phone number row to inspect.
   */
  protected validateUncommonPhoneNumberFields(dynamicPhoneNumberXlsxRow: DynamicPhoneNumberXlsxRow): void {
    this.validateRequiredKey(dynamicPhoneNumberXlsxRow, TRANSFER_DESTINATION);
    this.validateRequiredKey(dynamicPhoneNumberXlsxRow, CALL_FLOW_NAME);
    this.validateRequiredKeyEnumType(dynamicPhoneNumberXlsxRow, CALL_FLOW_TYPE, CallFlowTypeEnum);

    if (CallFlowTypeEnum.DTMF === dynamicPhoneNumberXlsxRow.callFlowType) {
      this.validateRequiredKey(dynamicPhoneNumberXlsxRow, NEXT_ACTION_ID);
    }

    if (dynamicPhoneNumberXlsxRow.nextActionId) {
      if (CallFlowTypeEnum.SELFSERVICE === dynamicPhoneNumberXlsxRow.callFlowType) {
        this.logPhoneNumberValidationError(dynamicPhoneNumberXlsxRow.dialedPhoneNumber, `${NEXT_ACTION_ID} should not be set when ${CALL_FLOW_TYPE} is ${CallFlowTypeEnum.SELFSERVICE}.`);
      }
    }

    if (CallFlowTypeEnum.DTMF === dynamicPhoneNumberXlsxRow.callFlowType) {
      this.validateRequiredKeyEnumType(dynamicPhoneNumberXlsxRow, NEXT_ACTION_TYPE, ActionTypeEnum);
    }

    if (dynamicPhoneNumberXlsxRow.nextActionType) {
      if (CallFlowTypeEnum.SELFSERVICE === dynamicPhoneNumberXlsxRow.callFlowType) {
        this.logPhoneNumberValidationError(dynamicPhoneNumberXlsxRow.dialedPhoneNumber, `${NEXT_ACTION_TYPE} should not be set when ${CALL_FLOW_TYPE} is ${CallFlowTypeEnum.SELFSERVICE}.`);
      }

      if (isTrue(dynamicPhoneNumberXlsxRow.migrateSelfServiceNumberToDynamic)) {
        this.logPhoneNumberValidationError(dynamicPhoneNumberXlsxRow.dialedPhoneNumber, `${NEXT_ACTION_TYPE} should not be set for migrated self service phone numbers.`);
      }
    }

    if (isTrue(dynamicPhoneNumberXlsxRow.migrateSelfServiceNumberToDynamic)) {
      if (dynamicPhoneNumberXlsxRow.callFlowType !== CallFlowTypeEnum.SELFSERVICE) {
        this.logPhoneNumberValidationError(dynamicPhoneNumberXlsxRow.dialedPhoneNumber, `${CALL_FLOW_TYPE} must be SELFSERVICE for migrated self service phone numbers.`);
      }

      if (dynamicPhoneNumberXlsxRow.callFlowName !== CallFlowTypeEnum.SELFSERVICE) {
        this.logPhoneNumberValidationError(dynamicPhoneNumberXlsxRow.dialedPhoneNumber, `${CALL_FLOW_NAME} must be SELFSERVICE for migrated self service phone numbers.`);
      }

      if (dynamicPhoneNumberXlsxRow.callFlowTemplate !== CallFlowTypeEnum.SELFSERVICE) {
        this.logPhoneNumberValidationError(dynamicPhoneNumberXlsxRow.dialedPhoneNumber, `${CALL_FLOW_TEMPLATE} must be SELFSERVICE for migrated self service phone numbers.`);
      }
    }
  }
}