import { PhoneNumberRecordType } from "../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { SingleCallFlowRecord } from "../GraphQL/Single.PhoneNumber.Record.Util";
import { PhoneNumberRecordUtil } from "../GraphQL/PhoneNumber.Record.Util";
import { AbstractPhoneNumberFormHandler } from "./Abstract.PhoneNumber.Form.Handler";
import { PhoneNumberFormManager } from "./PhoneNumber.Form.Manager";
import { PhoneNumberDataGridComponentManager } from "../DataGrid/PhoneNumber.DataGrid.Component.Manager";
import { NOT_VALID } from "../../common/Form/Abstract.Form.Handler";
import { hasDuplicatePhoneNumberRecord } from "../GraphQL/Match.PhoneNumber.Records.Util";
import {FormModeType, FormModeTypeEnum} from "../../common/Form/Abstract.Form.Manager";

const MODAL_NAME = "PhoneNumberFormEdit";
const MODAL_LABEL = "Edit Phone Number";

export class EditPhoneNumberFormHandler extends AbstractPhoneNumberFormHandler {
  constructor(accessToken: string, formManager: PhoneNumberFormManager, dataGridManager: PhoneNumberDataGridComponentManager) {
    super(accessToken, formManager, dataGridManager, );
  }

  get modalName(): string {
    return MODAL_NAME;
  }

  get modalLabel(): string {
    return MODAL_LABEL;
  }

  get formMode(): FormModeType {
    return FormModeTypeEnum.Edit;
  }

  get displayCloneButton(): boolean {
    return true;
  }

  get displayDeleteButton(): boolean {
    return true;
  }

  handleOnOpen(): void {
    this.openModal();
  }

  handleOnClone(): void {
    // handle on clone
  }

  async handleOnSave(): Promise<void> {
    delete this.record["pkey"];
    delete this.record["id"];

    if (this.phoneNumberValidation() === NOT_VALID) {
      return;
    }

    if (hasDuplicatePhoneNumberRecord(this.dataGridManager.dataGrid.data, this.record, this.dataGridManager.alertBar)) {
      return;
    }

    const updateResults = await SingleCallFlowRecord.update(this.accessToken, this.record);

    if (updateResults.errors?.length > 0) {
      this.formManager.alertBar.error(updateResults.errors.map<string>(error => (error.message)).join("; "));
      return;
    }

    // TODO: add delete duplicate records in legacy call flow.
    // deleteOppositeRows([originalRow], accessToken);
    this.formManager.formFieldConfig.reset();
    const successMessage = `Phone Number ${PhoneNumberRecordUtil.getPhoneNumber(this.record)} has been successfully updated.`;
    this.dataGridManager.alertBar.success(successMessage);

    this.dataGridManager.dataGrid.state =
      { // When edit modal is open and a row is edited and the user clicks save, this method is called and the record in the edit modal replaces the record in the grid
        data: this.dataGridManager.dataGrid.data.map(phoneNumberRecord => PhoneNumberRecordUtil.getPhoneNumber(phoneNumberRecord) === PhoneNumberRecordUtil.getPhoneNumber(this.record) ? this.record : phoneNumberRecord),
        filteredData: this.dataGridManager.dataGrid.data.map((phoneNumberRecord: PhoneNumberRecordType) => PhoneNumberRecordUtil.getPhoneNumber(phoneNumberRecord) === PhoneNumberRecordUtil.getPhoneNumber(this.record) ? this.record : phoneNumberRecord),
        selectedRow: this.record
      };

    this.record = {
      ...this.record
    };
    this.closeModal();
  }

  async handleOnDelete(): Promise<void> {
    const deleteRecordResults = await SingleCallFlowRecord.deleteCallFlowRecord(this.accessToken, this.record);

    if (deleteRecordResults.errors?.length > 0) {
      this.dataGridManager.alertBar.error(deleteRecordResults.errors.map<string>(error => (error.message)).join("; "));
      return;
    }

    this.dataGridManager.dataGrid.state =
      { // When edit modal is open for a phone record and the delete button is clicked, this method is called and the row is removed from the grid
        data: this.dataGridManager.dataGrid.data.filter( (phoneNumberRecord: PhoneNumberRecordType) => phoneNumberRecord.id !== this.record.id),
        filteredData: this.dataGridManager.dataGrid.data.filter(phoneNumberRecord => phoneNumberRecord.id !== this.record.id),
        selectedRow: this.record
      };

    const alertMessage = `Phone Number ${PhoneNumberRecordUtil.getPhoneNumber(this.record)} has been successfully deleted.`;
    this.dataGridManager.alertBar.success(alertMessage);

    this.formManager.formFieldConfig.reset();
    this.closeModal();
  }

  handleOnCancel(): void {
    this.closeModal();
  }

  handleOnClose(): void {
    this.closeModal();
  }
}