import { AbstractDataGridController } from "../../common/DataGrid/Abstract.DataGrid.Controller";
import { ACTION_ID } from "../Form/ActionFields";
import { ActionRecordType } from "../GraphQL/Action.Interfaces";

/**
 * Controller used to manage the Action.DataGrid.Component.
 */
export class ActionDataGridController extends AbstractDataGridController<ActionRecordType> {
  protected recordKey(): string {
    return ACTION_ID;
  }
}