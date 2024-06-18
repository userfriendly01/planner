import { ActionRecordType } from "../GraphQL/Action.Interfaces";
import {
  AbstractPreviewModalHandler, HANDLED_SUCCESSFULLY,
  HANDLED_UNSUCCESSFULLY
} from "../../common/Preview/Abstract.Preview.Modal.Handler";
import { batchCreateDynamicActionRecords } from "../GraphQL/Batch.Create.Action.Records.Query";
import { batchDeleteDynamicActionRecords } from "../GraphQL/Batch.Delete.Action.Records.Query";
import { removeElementsFromArray } from "components/tabs/dynamicCallFlow/common/Util/Array.Util";
import { ACTION_ID } from "dynamicCallFlow/Form/ActionFields";

export class ActionPreviewModalHandler extends AbstractPreviewModalHandler<ActionRecordType> {

  async handleOnCreate(accessToken: string, newCallFlowConfig: Array<ActionRecordType>): Promise<boolean> {
    if (newCallFlowConfig?.length > 0) {
      const callFlowName = newCallFlowConfig[0].callFlowName;
      const oldCallFlowConfig = [ ...this.dataGridController.sourceRecords.filter(sourceRecord => sourceRecord.callFlowName === callFlowName) ];

      //Remove old call flow config records from the source records
      this.dataGridController.removeRecordsFromSourceRecords(oldCallFlowConfig);

      const batchResults = await batchCreateDynamicActionRecords(accessToken, newCallFlowConfig);

      if (batchResults?.hasError) {
        // if newCallFlowConfig failed to create, add the oldCallFlowConfig back to the ActionDataGridComponent sourceRecords
        this.dataGridController.addRecordsToSourceRecords(oldCallFlowConfig);

        return HANDLED_UNSUCCESSFULLY;
      } else {
        if (HANDLED_SUCCESSFULLY === await this.deleteUnusedCallFlowConfigRecords(accessToken, newCallFlowConfig, oldCallFlowConfig)) {
          // Remove the old call flow config records from the source records
          this.dataGridController.addRecordsToSourceRecords(newCallFlowConfig);
        } else {
          return;
        }

      }
    }

    this.dataGridController.alertBarController.success("Call Flow Config successfully loaded.");
    return HANDLED_SUCCESSFULLY;
  }

  async deleteUnusedCallFlowConfigRecords(accessToken: string, newCallFlowConfig: Array<ActionRecordType>, oldCallFlowConfig: Array<ActionRecordType>): Promise<boolean> {
    // pass a copy of oldCallFlowConfig to removeElementsFromArray to keep that array intact in case we need to add the oldCallFlowConfig
    // back to the sourceRecords in case of batch delete failure.
    const unusedCallFlowConfigRecords = removeElementsFromArray(ACTION_ID, newCallFlowConfig, [ ...oldCallFlowConfig ]);

    if (unusedCallFlowConfigRecords.length > 0) {
      const batchResults = await batchDeleteDynamicActionRecords(accessToken, unusedCallFlowConfigRecords);

      if (batchResults?.hasError) {
        this.dataGridController.alertBarController.graphQLError(batchResults.errors);
        this.dataGridController.addRecordsToSourceRecords(oldCallFlowConfig);

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

