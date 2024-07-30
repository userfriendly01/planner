import {
  AbstractFormHandler, NOT_VALID
} from "components/tabs/dynamicCallFlow/common/Form/Abstract.Form.Handler";
import { PhoneNumberRecordType } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { GREETING_MESSAGES } from "components/tabs/dynamicCallFlow/phoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import {
  FieldConfigs,
  FieldDataType
} from "components/tabs/dynamicCallFlow/common/Form/Form.Interfaces";
import { PhoneNumberRecordUtil } from "dynamicCallFlowPhoneNumber/GraphQL/PhoneNumber.Record.Util";

export abstract class AbstractPhoneNumberFormHandler extends AbstractFormHandler<PhoneNumberRecordType> {
  protected getRecordPropertyValue(record: PhoneNumberRecordType, key: string): FieldDataType {
    return PhoneNumberRecordUtil.getPropertyValue(record, key);
  }

  /**
   *
   * @param greetingMessage
   * @private
   */
  private _validateGreetingMessage(greetingMessage: string): void {
    const reg = new RegExp("^[a-zA-Z0-9,@:=<>./\\-'\" ñáéíóú]+$");

    if (greetingMessage && reg.test(greetingMessage) === NOT_VALID) {
      throw new Error(`Greeting message contains invalid characters: ${greetingMessage}`);
    }
  }

  protected validatePhoneNumberRecord(record: PhoneNumberRecordType, fieldConfigs: FieldConfigs): void {
    this.validateForm(record, fieldConfigs);

    // Now do specific validation for this form
    if (record[GREETING_MESSAGES as keyof PhoneNumberRecordType]){
      this._validateGreetingMessage(record[GREETING_MESSAGES as keyof PhoneNumberRecordType] as string);
    }

    // checkForDuplicatePhoneNumberRecord(this.sourceRecords, record);
  }
}