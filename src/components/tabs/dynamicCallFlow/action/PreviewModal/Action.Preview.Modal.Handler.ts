import { ActionRecordType } from "../GraphQL/Action.Interfaces";
import {
  AbstractPreviewModalHandler, HANDLED_SUCCESSFULLY,
  HANDLED_UNSUCCESSFULLY
} from "../../common/Preview/Abstract.Preview.Modal.Handler";
import { batchCreateDynamicActionRecords } from "../GraphQL/Batch.Create.Action.Records.Query";
import { batchDeleteDynamicActionRecords } from "../GraphQL/Batch.Delete.Action.Records.Query";
import { removeElementsFromArray } from "components/tabs/dynamicCallFlow/common/Util/Array.Util";
import { ACTION_ID } from "dynamicCallFlow/Form/ActionFields";
import { BatchResults } from "components/tabs/dynamicCallFlow/common/GraphQL/Abstract.BatchRecords.Query";

export class ActionPreviewModalHandler extends AbstractPreviewModalHandler<ActionRecordType> {

  async handleOnCreate(accessToken: string, newCallFlowConfig: Array<ActionRecordType>): Promise<boolean> {
    if (newCallFlowConfig?.length > 0) {
      const callFlowName = newCallFlowConfig[0].callFlowName;
      const oldCallFlowConfig: Array<ActionRecordType> = this.dataGridController.sourceRecords.filter(sourceRecord => sourceRecord.callFlowName === callFlowName);

      const batchResults: BatchResults<ActionRecordType> = await batchCreateDynamicActionRecords(accessToken, newCallFlowConfig);

      if (batchResults?.hasError) {
        return HANDLED_UNSUCCESSFULLY;
      } else {
        // if (HANDLED_UNSUCCESSFULLY === await this.deleteUnusedCallFlowConfigRecords(accessToken, newCallFlowConfig, oldCallFlowConfig)) {
        //   return HANDLED_UNSUCCESSFULLY;
        // }

        //Remove old call flow config records from the source records
        this.dataGridController.removeRecordsFromSourceRecords(oldCallFlowConfig);
        // Add the new call flow config records to the source records
        this.dataGridController.addRecordsToSourceRecords(newCallFlowConfig);
        // Set the data grid records to the source records (will need to change in future when filtering is added, once added dataGridFilter.applyFilter() will be called)
        this.dataGridController.dataGridRecords = this.dataGridController.sourceRecords;
      }
    }

    this.dataGridController.alertBarController.success("Call Flow Configuration successfully loaded.");
    return HANDLED_SUCCESSFULLY;
  }

  async deleteUnusedCallFlowConfigRecords(accessToken: string, newCallFlowConfig: Array<ActionRecordType>, oldCallFlowConfig: Array<ActionRecordType>): Promise<boolean> {
    // pass a copy of oldCallFlowConfig to removeElementsFromArray to keep that array intact in case we need to add the oldCallFlowConfig
    // back to the sourceRecords in case of batch delete failure.
    const unusedCallFlowConfigRecords: Array<ActionRecordType> = removeElementsFromArray(ACTION_ID, newCallFlowConfig, [ ...oldCallFlowConfig ]);

    if (unusedCallFlowConfigRecords.length > 0) {
      const batchResults: BatchResults<ActionRecordType> = await batchDeleteDynamicActionRecords(accessToken, unusedCallFlowConfigRecords);

      if (batchResults?.hasError) {
        this.dataGridController.alertBarController.graphQLError(batchResults.errors);

        return HANDLED_UNSUCCESSFULLY;
      }
    }

    return HANDLED_SUCCESSFULLY;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleOnDelete(accessToken: string, recordsToDelete: Array<ActionRecordType>): Promise<boolean> {
    throw new Error("Method is required for the interface but not implemented as it is not used.  Call Flow Configs are loaded as a batch and any unused records are deleted");
  }
}

