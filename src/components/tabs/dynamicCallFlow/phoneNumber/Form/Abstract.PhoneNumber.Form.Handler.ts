import { AbstractFormHandler } from "components/tabs/dynamicCallFlow/common/Form/Abstract.Form.Handler";
import { PhoneNumberRecordType } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  EMPLOYEE_ID,
  GREETING_MESSAGES,
  PHONE_NUMBER
} from "components/tabs/dynamicCallFlow/phoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import {
  FieldConfigs,
  FieldDataType
} from "components/tabs/dynamicCallFlow/common/Form/Form.Interfaces";
import { PhoneNumberRecordUtil } from "dynamicCallFlowPhoneNumber/GraphQL/PhoneNumber.Record.Util";
// import { checkForDuplicatwePhoneNumberRecord } from "dynamicCallFlowPhoneNumber/GraphQL/Match.PhoneNumber.Records.Util";
import {
  employeeIdIsNotValid,
  greetingMessageIsNotValid,
  phoneNumberIsNotValid
} from "dynamicCallFlowCommon/GraphQL/Field.Validation.GraphQL";

export abstract class AbstractPhoneNumberFormHandler extends AbstractFormHandler<PhoneNumberRecordType> {
  protected getRecordPropertyValue(record: PhoneNumberRecordType, key: string): FieldDataType {
    return PhoneNumberRecordUtil.getPropertyValue(record, key);
  }

  protected validatePhoneNumberRecord(record: PhoneNumberRecordType, fieldConfigs: FieldConfigs): void {
    this.validateForm(record, fieldConfigs);

    if (phoneNumberIsNotValid(record[PHONE_NUMBER as keyof PhoneNumberRecordType] as string)) {
      throw new Error(`Phone number is not in the correct format +1##########: ${record[PHONE_NUMBER as keyof PhoneNumberRecordType]}`);
    }

    if (record[EMPLOYEE_ID as keyof PhoneNumberRecordType] && employeeIdIsNotValid(record[EMPLOYEE_ID as keyof PhoneNumberRecordType] as string)) {
      throw new Error(`Employee ID is not in the correct format n#######: ${record[EMPLOYEE_ID as keyof PhoneNumberRecordType]}`);
    }

    if (greetingMessageIsNotValid(record[GREETING_MESSAGES as keyof PhoneNumberRecordType] as string)) {
      throw new Error(`Greeting message contains invalid characters: ${record[GREETING_MESSAGES as keyof PhoneNumberRecordType]}`);
    }
  }
}