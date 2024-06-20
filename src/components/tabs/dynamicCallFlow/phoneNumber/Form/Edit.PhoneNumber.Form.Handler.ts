import { AbstractPhoneNumberFormHandler } from "./Abstract.PhoneNumber.Form.Handler";
import { PhoneNumberRecordType } from "../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { PhoneNumberRecordUtil } from "../GraphQL/PhoneNumber.Record.Util";
import { SingleCallFlowRecord } from "../GraphQL/Single.PhoneNumber.Record.Util";
import { FormOnHandleResponse } from "../../common/Form/Abstract.Form.Handler";
import { FieldConfigs } from "../../common/Form/Form.Field.Config";

const MODAL_NAME = "PhoneNumberFormEdit";
const MODAL_LABEL = "Edit";

export class EditPhoneNumberFormHandler extends AbstractPhoneNumberFormHandler {
  get modalName(): string {
    return MODAL_NAME;
  }

  get modalLabel(): string {
    return MODAL_LABEL;
  }

  get displayCloneButton(): boolean {
    return true;
  }

  get displayDeleteButton(): boolean {
    return true;
  }

  async handleOnSave(accessToken: string, recordToUpdate: PhoneNumberRecordType, fieldConfigs: FieldConfigs): Promise<FormOnHandleResponse<PhoneNumberRecordType>> {
    // Make a copy of the recordToSave as the transient keys on the record need to be deleted in order to persist to db and the transient keys are needed in the UI
    const recordToReturn = { ...recordToUpdate };

    try {
      this.deleteTransientKeys(recordToUpdate);

      this.validatePhoneNumberRecord(recordToUpdate, fieldConfigs);

      const updateRecordResults = await SingleCallFlowRecord.update(accessToken, recordToUpdate);

      if (updateRecordResults.errors?.length > 0) {
        const message = updateRecordResults.errors.map<string>(error => (error.message)).join("; ");
        console.error(message);

        return {
          errorMessage: message
        };
      }
    } catch (error) {
      console.error(error.message, error);

      return {
        errorMessage: error?.message || JSON.stringify(error)
      };
    }

    // TODO: add delete duplicate records in legacy call flow.
    // deleteOppositeRows([originalRow], accessToken);

    this.dataGridController.updateRecordInSourceRecords(recordToReturn);

    return {
      record: recordToReturn,
      successMessage: `Phone Number ${PhoneNumberRecordUtil.getPhoneNumber(recordToReturn)} has been successfully updated.`
    };
  }

  async handleOnDelete(accessToken: string, recordToDelete: PhoneNumberRecordType): Promise<FormOnHandleResponse<PhoneNumberRecordType>> {
    const recordToReturn = { ...recordToDelete };

    try {
      const deleteRecordResults = await SingleCallFlowRecord.delete(accessToken, recordToDelete);

      if (deleteRecordResults.errors?.length > 0) {
        const message = deleteRecordResults.errors.map<string>(error => (error.message)).join("; ");
        console.error(message);

        return {
          errorMessage: message
        };
      }
    } catch (error) {
      console.error(error.message, error);

      return {
        errorMessage: error?.message || JSON.stringify(error)
      };
    }

    this.dataGridController.removeRecordFromSourceRecords(recordToReturn);

    return {
      record: recordToReturn,
      successMessage: `Phone Number ${PhoneNumberRecordUtil.getPhoneNumber(recordToReturn)} has been successfully deleted.`
    };
  }

  reset(): void {
    // reset
  }
}