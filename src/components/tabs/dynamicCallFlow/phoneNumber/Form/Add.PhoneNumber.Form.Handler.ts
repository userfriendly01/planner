import { NOT_VALID } from "../../common/Form/Abstract.Form.Handler";
// import { hasDuplicatePhoneNumberRecord } from "../GraphQL/PhoneNumberRecordMatch.Util";
import { SingleCallFlowRecord } from "../GraphQL/Single.PhoneNumber.Record.Util";
import { checkForDuplicateErrorMessage } from "../../common/GraphQL/GraphQL.Util";
import { PhoneNumberFormManager } from "./PhoneNumber.Form.Manager";
import { PhoneNumberDataGridComponentManager } from "../DataGrid/PhoneNumber.DataGrid.Component.Manager";
import { AbstractPhoneNumberFormHandler } from "./Abstract.PhoneNumber.Form.Handler";
// import {hasDuplicatePhoneNumberRecord} from "../GraphQL/Match.PhoneNumber.Records.Util";

const MODAL_NAME = "DynamicPhoneNumberFormAddHandler";
const MODAL_LABEL = "Add Dynamic Phone Number";

export class AddPhoneNumberFormHandler extends AbstractPhoneNumberFormHandler {

  constructor(accessToken: string, formManager: PhoneNumberFormManager, dataGridManager: PhoneNumberDataGridComponentManager) {
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

    // if (hasDuplicatePhoneNumberRecord(this.dataGridManager.dataGrid.data, this.record, this.dataGridManager.alertBar)) {
    //   return;
    // }

    const singleCallFlowResults = await SingleCallFlowRecord.create(this.accessToken, this.record);

    if (!singleCallFlowResults.errors) {
      this.dataGridManager.dataGrid.state.data.push(singleCallFlowResults.record);
      this.dataGridManager.dataGrid.state.filteredData.push(singleCallFlowResults.record);
      this.dataGridManager.alertBar.success("New call flow has been successfully added.");

      this.formManager.formFieldConfig.reset();
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