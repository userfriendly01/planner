import {
  AbstractFormHandler, NOT_VALID
} from "../../common/Form/Abstract.Form.Handler";
import {
  PhoneNumber, PhoneNumberRecordType
} from "../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { GREETING_MESSAGES } from "./Dynamic.PhoneNumber.Form.Fields";
import { PhoneNumberRecordUtil } from "../GraphQL/PhoneNumber.Record.Util";
import { PKEY } from "./Legacy.PhoneNumber.Form.Fields";
import { FieldConfigs } from "../../common/Form/Form.Field.Config";

export abstract class AbstractPhoneNumberFormHandler extends AbstractFormHandler<PhoneNumberRecordType> {
  protected deleteTransientKeys(record: PhoneNumberRecordType): void {
    // Delete keys from record that are transient and should not be saved
    delete record["id"];

    // Dynamic Phone Number uses phoneNumber as the pkey and does not have a pkey field
    if (PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(record)) {
      (record as PhoneNumber).phoneNumber = record.pkey as string || (record as PhoneNumber).phoneNumber;
      delete record[PKEY];
    }
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