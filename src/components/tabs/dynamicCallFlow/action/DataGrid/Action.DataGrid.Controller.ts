import { AbstractDataGridController } from "components/tabs/dynamicCallFlow/common//DataGrid/Abstract.DataGrid.Controller";
import { ACTION_ID } from "components/tabs/dynamicCallFlow/action//Form/ActionFields";
import { ActionRecordType } from "components/tabs/dynamicCallFlow/action//GraphQL/Action.Interfaces";

/**
 * Controller used to manage the Action.DataGrid.Component.
 */
export class ActionDataGridController extends AbstractDataGridController<ActionRecordType> {
  protected recordKey(): string {
    return ACTION_ID;
  }
}