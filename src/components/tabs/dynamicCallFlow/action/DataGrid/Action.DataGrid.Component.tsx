import React, {
  useContext, useEffect, useRef, useState
} from "react";
import { ActionDataGridToolBar } from "./Action.DataGrid.ToolBar";
import {
  DataGrid, GridCallbackDetails, GridPaginationModel, useGridApiRef
} from "@mui/x-data-grid";
import { CustomToast } from "components";
import ActionDataGridColumnDef from "./Action.DataGrid.ColumnDef";
import {
  ActionRecord, ActionRecordType
} from "../GraphQL/DynamicCallFlowActionGraphQL.Interfaces";
import { batchCreateDynamicActionRecords } from "../GraphQL/Batch.Create.Action.Record.Query";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { actionListRecords } from "../GraphQL/List.Action.Records.Query";
import {
  DataGridStateProps,
  initializeDataGrid,
  sortDataGrid
} from "../../common/DataGrid/DynamicCallFlow.Common.DataGrid";
import { ActionFieldOptionsManager } from "../Field/ActionFieldOptionsManager";
import { FieldOptions } from "../../common/Form/AbstractFormFieldOptionsManager";
import { FieldConfigs } from "../../common/Form/Form.Field.Config";
import { ActionFormFieldConfigs } from "../Field/ActionFieldsConfig";
import { ActionPreviewModal } from "../PreviewModal";
import {
  AlertBarController,
  AlertBarProps,
  initialAlertBarProps
} from "../../common/AlertBar.Controller";
import { DynamicCallFlowActionContext } from "../DynamicCallFlow.Action.Container";
import { NotInUseModalType } from "../../common/Modal.Controller";

const DYNAMIC_CALL_FLOW_ACTION_DATA_GRID_PAGE_NUMBER = "dynamicCallFlowActionDataGridPageNumber";
const DYNAMIC_CALL_FLOW_ACTION_DATA_GRID_RECORDS_PER_PAGE = "dynamicCallFlowActionDataGridRecordsPerPage";

export type ActionModalType = "Add" | "Edit" | "Bulk Delete" | "Bulk Add" | "Bulk Edit" | "Filter" | NotInUseModalType;

export enum ActionModalTypeEnum {
  Add = "Add",
  BulkAdd = "Bulk Add",
  Edit = "Edit",
  BulkEdit = "Bulk Edit",
  BulkDelete = "Bulk Delete",
  Filter = "Filter"
}

const ActionDataGridComponent = (): JSX.Element => {
  const {
    currentOpenModal,
    accessToken
  } = useContext(DynamicCallFlowActionContext);

  const allRecords = useRef<Array<ActionRecordType>>([]);

  const [dataGridRecords, setDataGridRecords] = useState<Array<ActionRecordType>>([]);
  const [dataGridProps, setDataGridProps] = useState<DataGridStateProps>(initializeDataGrid());

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: sessionStorage.getItem(DYNAMIC_CALL_FLOW_ACTION_DATA_GRID_PAGE_NUMBER) ? +sessionStorage.getItem(DYNAMIC_CALL_FLOW_ACTION_DATA_GRID_PAGE_NUMBER) : 10,
    page: sessionStorage.getItem(DYNAMIC_CALL_FLOW_ACTION_DATA_GRID_RECORDS_PER_PAGE) ? +sessionStorage.getItem(DYNAMIC_CALL_FLOW_ACTION_DATA_GRID_RECORDS_PER_PAGE) : 1
  });

  const [selectedList, setSelectedList] = useState<Array<ActionRecordType>>([]);
  const [selectedRow, setSelectedRow] = useState<ActionRecordType | null>({} as ActionRecord);

  const [alertBarProps, setAlertBarProps] = useState<AlertBarProps>(initialAlertBarProps);
  const alertBarController = useRef<AlertBarController>(new AlertBarController(setAlertBarProps));

  const fieldOptions = useRef<FieldOptions>({} as FieldOptions);

  const [actionFieldConfigs, setActionFieldConfigs] = useState<FieldConfigs>(ActionFormFieldConfigs);

  const apiRef = useGridApiRef<GridApiCommunity>();

  useEffect(() => {
    //TODO:  Rename this function, it's not returning any values, it's loading the table
    const loadDataGrid = async()=> {
      alertBarController.current.info("Data loading in progress. Please wait for the complete set of data to be loaded.");
      console.log("Loading call flow data.");

      try {
        allRecords.current = await actionListRecords(accessToken);
      } catch (error: unknown) {
        // TODO: Log error
        alertBarController.current.error("Errors loading data.  Please check the console logs.");
      }

      const [sortedDataGridRecords, updatedDataGridProps] = sortDataGrid(allRecords.current);

      setDataGridRecords(sortedDataGridRecords);
      setDataGridProps(prevState => ({
        ...prevState,
        ...updatedDataGridProps
      }));

      const actionFieldOptionsManager = new ActionFieldOptionsManager();
      fieldOptions.current = actionFieldOptionsManager.generateOptions(allRecords.current);
      setActionFieldConfigs(actionFieldOptionsManager.updateFieldOptionsOnFieldConfigs(actionFieldConfigs));
    };

    loadDataGrid();
  }, []);

  const handlePaginationModelChange = (model: GridPaginationModel, details: GridCallbackDetails<any>) =>{
    sessionStorage.setItem(DYNAMIC_CALL_FLOW_ACTION_DATA_GRID_PAGE_NUMBER, model.page.toString());
    sessionStorage.setItem(DYNAMIC_CALL_FLOW_ACTION_DATA_GRID_RECORDS_PER_PAGE, model.pageSize.toString());
    setPaginationModel(model);
  };

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

  const handleOnBacthCreate = async(actionRecords: Array<ActionRecordType> ) =>{
    const graphQLResponse = await batchCreateDynamicActionRecords(accessToken, actionRecords);

    if (graphQLResponse?.errors.length > 0) {
      alertBarController.current.graphQLError(graphQLResponse.errors);
    } else {
      alertBarController.current.success("Call Flow Actions have been successfully loaded.");
    }

    // closeModal();

    apiRef.current.setRowSelectionModel([]);
  };

  const handleOnBatchUpdate = async(actionRecords: Array<ActionRecordType>) => {
    //
  };

  const handleOnBatchDelete = async(actionRecords: Array<ActionRecordType>) => {
    //
  };

  const updateDataGridRecords = (updatedDataGridRecord: Array<ActionRecordType>): void => {
    setDataGridRecords(updatedDataGridRecord);
  };

  const handleCloseAlertBar = () => {
    // do something
  };

  const handlePreviewModalOnClose = () =>{
    apiRef.current.setRowSelectionModel([]);
  };

  return (
    <div className="data-grid-wrapper">
      <div className="data-grid-wrapper">
        <div className="data-grid-wrapper">
          <ActionDataGridToolBar
            isFilterModalOpen={currentOpenModal === ActionModalTypeEnum.Filter}
            exportDataFile={exportDataFile}
          />
          <DataGrid
            apiRef={apiRef}
            rows={dataGridRecords}
            columns={ActionDataGridColumnDef}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[10, 20, 50, 100]}
            paginationMode="client"
            pagination
            loading={dataGridProps.fetching}
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
      <ActionPreviewModal
        isOpen={currentOpenModal === ActionModalTypeEnum.BulkAdd}
        records={selectedList}
        onClose={handlePreviewModalOnClose}
        modalType={currentOpenModal}
        maxId={dataGridProps.maxId}
        onCreate={handleOnBacthCreate}
        onUpdate={handleOnBatchUpdate}
        onDelete={handleOnBatchDelete}
        loading={dataGridProps.fetching}
      />
      <CustomToast
        open={alertBarProps.open}
        onClose={handleCloseAlertBar}
        msg={alertBarProps.msg}
        severityType={alertBarProps.severityType}
        duration={alertBarProps.duration}
      />
    </div>
  );
};

export default ActionDataGridComponent;
