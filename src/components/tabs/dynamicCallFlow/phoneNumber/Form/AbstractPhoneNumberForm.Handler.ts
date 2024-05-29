import {
  AbstractFormHandler, VALID, NOT_VALID, FormHandler
} from "../../common/Form/AbstractForm.Handler";
import { PhoneNumberRecordUtil } from "../GraphQL/PhoneNumberRecord.Util";
import { PhoneNumberDataGridManager } from "../DataGrid/PhoneNumberDataGrid.Manager";
import { PhoneNumberFormManager } from "./PhoneNumberForm.Manager";
import { PhoneNumberRecordType } from "../GraphQL/DynamicPhoneNumber.Interfaces";
import { GREETING_MESSAGES } from "./DynamicPhoneNumberForm.Fields";
import { FieldDataType } from "../../common/Form/FormFieldConfig.State";
import { SingleCallFlowRecord } from "../GraphQL/PhoneNumberSingleRecord.Util";
// import {hasDuplicatePhoneNumberRecord} from "../GraphQL/PhoneNumberRecordMatch.Util";

export interface PhoneNumberFormHandler extends FormHandler<PhoneNumberRecordType> {
  get dataGridManager(): PhoneNumberDataGridManager;
}

export abstract class AbstractPhoneNumberFormHandler extends AbstractFormHandler<PhoneNumberRecordType> implements PhoneNumberFormHandler {
  private readonly _dataGridManager: PhoneNumberDataGridManager;

  constructor(modalName: string, modalLabel: string, accessToken: string, formManager: PhoneNumberFormManager, dataGridManager: PhoneNumberDataGridManager, displayCloneButton = false, displayDeleteButton = false) {
    super(modalName, modalLabel, accessToken, formManager, displayCloneButton, displayDeleteButton);
    this._dataGridManager = dataGridManager;

  }

  get dataGridManager(): PhoneNumberDataGridManager {
    return this._dataGridManager;
  }

  protected updateRecordProperty(phoneNumberRecord: PhoneNumberRecordType, key: string, value: FieldDataType): PhoneNumberRecordType {
    return PhoneNumberRecordUtil.setPropertyValue(phoneNumberRecord, key, value);
  }

  /**
   * Created this to make it more obviou
   * @param greetingMessage
   * @private
   */
  private _isValidGreetingMessage(greetingMessage: string): boolean {
    const reg = new RegExp("^[a-zA-Z0-9,@:=<>./\\-\\'\" ñáéíóú]+$");
    return (greetingMessage && reg.test(greetingMessage)) ? VALID : NOT_VALID;
  }

  protected phoneNumberValidation(): boolean {
    // Call the isValidForm in the abstract class to cover general validation, i.e. required fields are not null or empty strings
    // and fieldConditionChecks are performed
    let isFormValid = this.formValidation();

    // Now do specific validation for this form
    if (isFormValid === VALID && this.record[GREETING_MESSAGES as keyof PhoneNumberRecordType]){
      isFormValid = this._isValidGreetingMessage(this.record[GREETING_MESSAGES as keyof PhoneNumberRecordType] as string);
    }

    if (isFormValid === NOT_VALID) {
      this.dataGridManager.alertBar.error(this.formManager.fieldConfigs.generateErrorMessage());
    // } else if (hasDuplicatePhoneNumberRecord(this.dataGridManager.dataGrid.data, this.record, this.dataGridManager.alertBar)) {
    //   isFormValid = NOT_VALID;
    }

    return isFormValid;
  }
}