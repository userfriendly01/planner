import {
  AbstractFormHandler, VALID, NOT_VALID, FormHandler, FormHandlerProps
} from "../../common/Form/Abstract.Form.Handler";
import { PhoneNumberRecordUtil } from "../GraphQL/PhoneNumber.Record.Util";
import { PhoneNumberDataGridComponentManager } from "../DataGrid/PhoneNumber.DataGrid.Component.Manager";
import { PhoneNumberFormManager } from "./PhoneNumber.Form.Manager";
import { PhoneNumberRecordType } from "../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { GREETING_MESSAGES } from "./Dynamic.PhoneNumber.Form.Fields";
import { FieldDataType } from "../../common/Form/Form.FieldConfig.State";
import { ReactSetState } from "../../common/StateManager/Abstract.ReactState";


export abstract class AbstractPhoneNumberFormHandler extends AbstractFormHandler<PhoneNumberRecordType> {
  private readonly _dataGridManagerComponentManager: PhoneNumberDataGridComponentManager;
  constructor(accessToken: string, formManager: PhoneNumberFormManager, state: FormHandlerProps<PhoneNumberRecordType>, setState: ReactSetState<FormHandlerProps<PhoneNumberRecordType>>, dataGridManager: PhoneNumberDataGridComponentManager) {
    super(accessToken, formManager);
  }

  protected updateRecordProperty(phoneNumberRecord: PhoneNumberRecordType, key: string, value: FieldDataType): void {
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
      this.dataGridManager.alertBar.error(this.formManager.formFieldConfig.generateErrorMessage());
    // } else if (hasDuplicatePhoneNumberRecord(this.dataGridManager.dataGrid.data, this.record, this.dataGridManager.alertBar)) {
    //   isFormValid = NOT_VALID;
    }

    return isFormValid;
  }
}