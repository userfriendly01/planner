import { AbstractPhoneNumberFormHandler } from "./Abstract.PhoneNumber.Form.Handler";
import { PhoneNumberRecordType } from "../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { SingleCallFlowRecord } from "../GraphQL/Single.PhoneNumber.Record.Util";
import { FormOnHandleResponse } from "../../common/Form/Abstract.Form.Handler";
import { FieldConfigs } from "../../common/Form/Form.Field.Config";
import { PhoneNumberRecordUtil } from "../GraphQL/PhoneNumber.Record.Util";

const MODAL_NAME = "DynamicPhoneNumberFormAddHandler";
const MODAL_LABEL = "Add";

export class AddPhoneNumberFormHandler extends AbstractPhoneNumberFormHandler {
  get modalName(): string {
    return MODAL_NAME;
  }

  get modalLabel(): string {
    return MODAL_LABEL;
  }

  get displayCloneButton(): boolean {
    return false;
  }

  get displayDeleteButton(): boolean {
    return false;
  }

  async handleOnSave(accessToken: string, recordToCreate: PhoneNumberRecordType, fieldConfigs: FieldConfigs): Promise<FormOnHandleResponse<PhoneNumberRecordType>> {
    // Make a copy of the recordToCreate as the transient keys on the record need to be deleted in order to persist to db and the transient keys are needed in the UI
    const recordToReturn = { ...recordToCreate };

    try {
      this.deleteTransientKeys(recordToCreate);

      this.validatePhoneNumberRecord(recordToCreate, fieldConfigs);

      const createRecordResults = await SingleCallFlowRecord.create(accessToken, recordToCreate);

      if (createRecordResults.errors?.length > 0) {
        const message = createRecordResults.errors.map<string>(error => (error.message)).join("; ");
        console.error(message);

        return {
          errorMessage: message
        };
      }
    } catch (error) {
      console.error(error?.message, error);

      return {
        errorMessage: error?.message || JSON.stringify(error)
      };
    }

    // TODO: add delete duplicate records.
    // deleteOppositeRows([originalRow], accessToken);

    this.dataGridController.addRecordToSourceRecords(recordToReturn);

    return {
      record: recordToReturn,
      successMessage: `Phone Number ${PhoneNumberRecordUtil.getPhoneNumber(recordToReturn)} has been successfully updated.`
    };
  }

  handleOnDelete(accessToken: string, recordToDelete: PhoneNumberRecordType): Promise<FormOnHandleResponse<PhoneNumberRecordType>> {
    // Add handler does not have delete functionality, but interface requires it.  Just a nuane of having a delete button on the edit form but not shown on the add form.
    return undefined;
  }

}