import React, {
  useEffect, useState
} from "react";
import { AzureSPA } from "../../../../../globals";
import { ActionDataGridToolBar } from "./ActionDataGridToolBar";
import {
  downloadCSV,
  EXPORT_FILE_PREFIX
} from "utils";
import { PreviewModal } from "../PreviewModal/PreviewModal";
import {
  DataGrid, useGridApiRef
} from "@mui/x-data-grid";
import { CustomToast } from "components";
import ActionDataGridColumnDef from "./ActionDataGridColumnDef";
import {DataGridStateDeprecated, DataGridStateOld} from "../../common/DataGrid/DataGrid.State.Deprecated";
import {AlertBarState, AlertBarStateOld} from "../../common/StateManager/AlertBar.State";
import {
  ActionRecord,
  ActionRecordType
} from "../GraphQL/DynamicCallFlowActionGraphQL.Interfaces";
import { ActionDataGridManager } from "./ActionDataGrid.Manager";
import { batchCreateDynamicActionRecords } from "../GraphQL/BatchCreateDynamicActionQuery";
import { PreviewModalActionType } from "../../common/Preview/Preview.Interface";

const ActionDataGrid = (props: AzureSPA): JSX.Element => {
  const {
    accessToken,
    matchedGroups
  } = props;

  const dataGridState: DataGridStateDeprecated<ActionRecord> = new DataGridStateOld<ActionRecord>();
  const alertBarState: AlertBarState = new AlertBarStateOld();
  const actionDataGridManager: ActionDataGridManager = new ActionDataGridManager(dataGridState, alertBarState);
  const [selectedList, setSelectedList] = useState<Array<ActionRecord>>([]);

  useEffect(() => {
    //TODO:  Rename this function, it's not returning any values, it's loading the table
    const loadDataGrid = async()=> {
      // alertBarState.info("Data loading in progress. Please wait for the complete set of data to be loaded.");
      console.log("Loading call flow data.");
      try {
        // console.log("Loading call flow data.");
        // const phoneNumberRecords: Array<PhoneNumberRecordType> = await listPhoneNumberRecords(accessToken);
        await actionDataGridManager.loadDataGrid(accessToken);
      } catch (error: unknown) {
        // TODO: Log error
        alertBarState.error("Errors loading data.  Please check the console logs.");
      }
      console.log("done call flow data load.");

    };

    loadDataGrid();
    // setDataGrid((dg: DataGridStateProps<PhoneNumberRecordType>) => ({
    //   ...dg,
    //   ...dataGrid
    // }));
  }, []);

  const openPreviewModal = (openPreviewModal: boolean, previewModelAction: PreviewModalActionType) => {
    actionDataGridManager.dataGrid.state.isPreviewModalOpen = openPreviewModal;
    actionDataGridManager.dataGrid.state.previewModalAction = previewModelAction;
  };

  const apiRef = useGridApiRef();

  const exportDataFile = () =>{
    // downloadCSV(EXPORT_FILE_PREFIX.DYNAMIC_FLOW, actionDataGridManager.dataGrid.filteredData.map((action: ActionRecord) =>  {
    //   return {
    //     actionId: action.actionId,
    //     actionType: action.actionType,
    //     callFlowName: action.callFlowName,
    //     speech: action.speech,
    //     options: action.options,
    //     repeat: action.repeat,
    //     timeout: action.timeout,
    //     finishOnKey: action.finishOnKey,
    //     minDigits: action.minDigits,
    //     maxDigits: action.maxDigits,
    //     nextActionId: action.nextActionId,
    //     nextActionType: action.nextActionType,
    //     createTime: action.createTime,
    //     updateTime: action.updateTime
    //   };
    // }
    // ));
  };

  const handleClose = (flag: boolean) => {
    alertBarState.open = flag;
  };

  const handlePreviewModalOnClose = () => {
    actionDataGridManager.dataGrid.state.isPreviewModalOpen = false;
  };

  const handleOnBulkCreate = async(actionRecords: Array<ActionRecordType> ) =>{
    const graphQLResponse = await batchCreateDynamicActionRecords(accessToken, actionRecords);

    if (graphQLResponse?.errors.length > 0) {
      alertBarState.graphQLError(graphQLResponse.errors);
    } else {
      alertBarState.success("Call Flow Actions have been successfully loaded.");
    }

    actionDataGridManager.dataGrid.state.isPreviewModalOpen = false;
    apiRef.current.setRowSelectionModel([]);
  };

  return (
    <div className="data-grid-wrapper">
      <div className="data-grid-wrapper">
        <div className="data-grid-wrapper">
          <ActionDataGridToolBar
            exportDataFile={exportDataFile}
            matchedGroups={matchedGroups}
            openPreviewModal={openPreviewModal}
          />
          <DataGrid
            apiRef={apiRef}
            rows={actionDataGridManager.dataGrid.state.filteredData}
            columns={ActionDataGridColumnDef}
            loading={actionDataGridManager.dataGrid.state.fetching}
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight
            getRowId={(actionRecord: ActionRecordType) => actionRecord.actionId}
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600
              }
            }}
          />

        </div>
      </div>
      <CustomToast
        open={alertBarState.open}
        onClose={handleClose}
        msg={alertBarState.msg}
        severityType={alertBarState.severityType}
        duration={alertBarState.duration}
      />
      <PreviewModal
        action={actionDataGridManager.dataGrid.previewModalAction}
        isOpen={actionDataGridManager.dataGrid.isPreviewModalOpen}
        loading={actionDataGridManager.dataGrid.fetching}
        onClose={handlePreviewModalOnClose}
        onCreate={handleOnBulkCreate}
        rows={selectedList}
      />
    </div>
  );
};

export default ActionDataGrid;
