import { AbstractDataGridController } from "dynamicCallFlowCommon/DataGrid/Abstract.DataGrid.Controller";
import { ACTION_ID } from "dynamicCallFlowAction/Form/ActionFields";
import { ActionRecordType } from "dynamicCallFlowAction/GraphQL/Action.Interfaces";

/**
 * Controller used to manage the Action.DataGrid.Component.
 */
export class ActionDataGridController extends AbstractDataGridController<ActionRecordType> {
  protected recordKey(): string {
    return ACTION_ID;
  }
}