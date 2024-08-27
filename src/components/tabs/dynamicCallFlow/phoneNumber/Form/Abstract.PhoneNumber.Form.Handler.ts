import { AbstractFormHandler } from "components/tabs/dynamicCallFlow/common/Form/Abstract.Form.Handler";
import { PhoneNumberRecordType } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  EMPLOYEE_ID,
  GREETING_MESSAGES
} from "components/tabs/dynamicCallFlow/phoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import {
  FieldConfigs,
  FieldDataType
} from "components/tabs/dynamicCallFlow/common/Form/Form.Interfaces";
import { PhoneNumberRecordUtil } from "dynamicCallFlowPhoneNumber/GraphQL/PhoneNumber.Record.Util";
import {
  employeeIdIsNotValid,
  greetingMessageIsNotValid,
  phoneNumberIsNotValid
} from "dynamicCallFlowCommon/GraphQL/Field.Validation.GraphQL";
import { idDuplicateEmployeeAssignment } from "dynamicCallFlowPhoneNumber/DataGrid/PhoneNumber.DataGrid.Controller";

export abstract class AbstractPhoneNumberFormHandler extends AbstractFormHandler<PhoneNumberRecordType> {
  protected getRecordPropertyValue(record: PhoneNumberRecordType, key: string): FieldDataType {
    return PhoneNumberRecordUtil.getPropertyValue(record, key);
  }

  protected validatePhoneNumberRecord(record: PhoneNumberRecordType, fieldConfigs: FieldConfigs): void {
    this.validateForm(record, fieldConfigs);

    if (phoneNumberIsNotValid(PhoneNumberRecordUtil.getPhoneNumber(record))) {
      throw new Error(`Phone number "${PhoneNumberRecordUtil.getPhoneNumber(record)}" is not in the correct format +1##########.`);
    }

    if (record.employeeId && employeeIdIsNotValid(record.employeeId)) {
      throw new Error(`Employee ID is not in the correct format n#######: ${record.employeeId}`);
    } else if (record.employeeId && idDuplicateEmployeeAssignment(record, this.dataGridController.sourceRecords)) {
      throw new Error(`Employee ID ${record[EMPLOYEE_ID as keyof PhoneNumberRecordType]} is already assigned to a phone number.`);
    }

    if (greetingMessageIsNotValid(record[GREETING_MESSAGES as keyof PhoneNumberRecordType] as string)) {
      throw new Error(`Greeting message contains invalid characters: ${record[GREETING_MESSAGES as keyof PhoneNumberRecordType]}`);
    }
  }
}