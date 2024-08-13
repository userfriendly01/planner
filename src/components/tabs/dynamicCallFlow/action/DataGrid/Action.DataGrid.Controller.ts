import { AbstractDataGridController } from "components/tabs/dynamicCallFlow/common//DataGrid/Abstract.DataGrid.Controller";
import { ACTION_ID } from "components/tabs/dynamicCallFlow/action//Form/ActionFields";
import { ActionRecordType } from "components/tabs/dynamicCallFlow/action//GraphQL/Action.Interfaces";
import { MatchFilter } from "dynamicCallFlowCommon/Util/Array.Util";

export const actionMatchFilter: MatchFilter<ActionRecordType> = (actionRecord1: ActionRecordType, actionRecord2: ActionRecordType): boolean => {
  if (!actionRecord1 && actionRecord2) {
    return false;
  }

  if (actionRecord1 && !actionRecord2) {
    return false;
  }

  if (!actionRecord1 && !actionRecord2) {
    return true;
  }

  return actionRecord1 && actionRecord2
    && actionRecord1[ACTION_ID] === actionRecord2[ACTION_ID];
};

/**
 * Controller used to manage the Action.DataGrid.Component.
 */
export class ActionDataGridController extends AbstractDataGridController<ActionRecordType> {
  matchFilter(): MatchFilter<ActionRecordType> {
    return actionMatchFilter;
  }
}