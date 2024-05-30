import {
  AbstractFormManager, FormManager, FormManagerProps
} from "../../common/Form/Abstract.Form.Manager";
import { PhoneNumberRecordType } from "../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { ReactSetState } from "../../common/StateManager/Abstract.ReactState";
import { FieldDataType } from "../../common/Form/Form.FieldConfig.State";
import { PhoneNumberRecordUtil } from "../GraphQL/PhoneNumber.Record.Util";

export class PhoneNumberFormManager extends AbstractFormManager<PhoneNumberRecordType> implements FormManager<PhoneNumberRecordType> {
  constructor(state: FormManagerProps<PhoneNumberRecordType>, setState: ReactSetState<FormManagerProps<PhoneNumberRecordType>>) {
    super(state, setState);
  }

  protected updateRecordProperty(record: PhoneNumberRecordType, key: string, value: FieldDataType): void {
    PhoneNumberRecordUtil.setPropertyValue(record, key, value);
  }

}