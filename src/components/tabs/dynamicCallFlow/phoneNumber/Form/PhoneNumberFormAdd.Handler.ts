import { NOT_VALID } from "../../common/Form/AbstractForm.Handler";
// import { hasDuplicatePhoneNumberRecord } from "../GraphQL/PhoneNumberRecordMatch.Util";
import { SingleCallFlowRecord } from "../GraphQL/PhoneNumberSingleRecord.Util";
import { checkForDuplicateErrorMessage } from "../../common/GraphQL/GraphQL.Util";
import { PhoneNumberFormManager } from "./PhoneNumberForm.Manager";
import { PhoneNumberDataGridManager } from "../DataGrid/PhoneNumberDataGrid.Manager";
import { AbstractPhoneNumberFormHandler } from "./AbstractPhoneNumberForm.Handler";

const MODAL_NAME = "DynamicPhoneNumberFormAddHandler";
const MODAL_LABEL = "Add Dynamic Phone Number";

export class PhoneNumberFormAddHandler extends AbstractPhoneNumberFormHandler {

  constructor(accessToken: string, formManager: PhoneNumberFormManager, dataGridManager: PhoneNumberDataGridManager) {
    super(MODAL_NAME, MODAL_LABEL, accessToken, formManager, dataGridManager);
  }

  handleOnOpen() {
    this.openModal();
  }

  handleOnClone() {
    // handle on clone
  }

  async handleOnSave(): Promise<void> {
    if (this.phoneNumberValidation() === NOT_VALID) {
      return;
    }

    const singleCallFlowResults = await SingleCallFlowRecord.create(this.accessToken, this.record);

    if (!singleCallFlowResults.errors) {
      this.dataGridManager.dataGrid.addRecordToData(singleCallFlowResults.record);
      this.dataGridManager.dataGrid.addRecordToFilteredData(singleCallFlowResults.record);
      this.dataGridManager.alertBar.success("New call flow has been successfully added.");

      this.formManager.fieldConfigs.reset();
    } else {
      checkForDuplicateErrorMessage(singleCallFlowResults.errors);
      this.dataGridManager.alertBar.error(singleCallFlowResults.errors.join("\n"));
      return;
    }
  }

  handleOnCancel(): void {
    // handle cancel
  }

  handleOnClose(): void {
    this.closeModal();
  }

  handleOnDelete(): void {
    // handle on delete
  }
}