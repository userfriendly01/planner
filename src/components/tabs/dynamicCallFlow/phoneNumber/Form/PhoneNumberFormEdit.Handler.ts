import { PhoneNumberRecordType } from "../GraphQL/DynamicPhoneNumber.Interfaces";
import { SingleCallFlowRecord } from "../GraphQL/PhoneNumberSingleRecord.Util";
import { PhoneNumberRecordUtil } from "../GraphQL/PhoneNumberRecord.Util";
import { AbstractPhoneNumberFormHandler } from "./AbstractPhoneNumberForm.Handler";
import { PhoneNumberFormManager } from "./PhoneNumberForm.Manager";
import { PhoneNumberDataGridManager } from "../DataGrid/PhoneNumberDataGrid.Manager";
import { NOT_VALID } from "../../common/Form/AbstractForm.Handler";

const MODAL_NAME = "PhoneNumberFormEdit";
const MODAL_LABEL = "Edit Phone Number";

export class PhoneNumberFormEditHandler extends AbstractPhoneNumberFormHandler {
  constructor(accessToken: string, formManager: PhoneNumberFormManager, dataGridManager: PhoneNumberDataGridManager) {
    super(MODAL_NAME, MODAL_LABEL, accessToken, formManager, dataGridManager, true, true);
  }

  handleOnOpen(): void {
    this.openModal();
  }

  handleOnClone(): void {
    // handle on clone
  }

  async handleOnSave(): Promise<void> {
    if (this.phoneNumberValidation() === NOT_VALID) {
      return;
    }

    delete this.record["pkey"];
    delete this.record["id"];
    const updateResults = await SingleCallFlowRecord.update(this.accessToken, this.record);

    if (updateResults.errors?.length > 0) {
      this.dataGridManager.alertBar.error(updateResults.errors.map<string>(error => (error.message)).join("; "));
      return;
    }

    // TODO: add delete duplicate records in legacy call flow.
    // deleteOppositeRows([originalRow], accessToken);
    this.formManager.fieldConfigs.reset();
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

    this.formManager.fieldConfigs.reset();
    this.closeModal();
  }

  handleOnCancel(): void {
    this.closeModal();
  }

  handleOnClose(): void {
    this.closeModal();
  }
}