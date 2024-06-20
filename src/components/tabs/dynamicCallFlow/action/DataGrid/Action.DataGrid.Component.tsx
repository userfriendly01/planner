import React, {
  useContext, useEffect, useRef, useState
} from "react";
import { ActionDataGridToolBar } from "./Action.DataGrid.ToolBar";
import {
  DataGrid, GridCallbackDetails, GridPaginationModel, useGridApiRef
} from "@mui/x-data-grid";
import ActionDataGridColumnDef from "./Action.DataGrid.ColumnDef";
import {
  ActionRecord, ActionRecordType
} from "../GraphQL/Action.Interfaces";
import { batchCreateDynamicActionRecords } from "../GraphQL/Batch.Create.Action.Records.Query";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { actionListRecords } from "../GraphQL/List.Action.Records.Query";
import {
  DataGridStateProps,
  initializeDataGrid,
  sortDataGrid
} from "../../common/DataGrid/DynamicCallFlow.Common.DataGrid";
import { ActionFieldOptionsManager } from "../Form/ActionFieldOptionsManager";
import { FieldOptions } from "../../common/Form/AbstractFormFieldOptionsManager";
import { FieldConfigs } from "../../common/Form/Form.Field.Config";
import { ActionFormFieldConfigs } from "../Form/ActionFieldsConfig";
import { ActionPreviewModal } from "../PreviewModal/Action.Preview.Modal.Component";
import {
  AlertBarController,
  AlertBarProps,
  initialAlertBarProps
} from "../../common/AlertBar.Controller";
import { DynamicCallFlowActionContext } from "../DynamicCallFlow.Action.Container";
import { NotInUseModalType } from "../../common/Modal.Controller";
import { ActionDataGridController } from "./Action.DataGrid.Controller";
import { ActionDataGridFilter } from "./Action.DataGrid.Filter";
import { CustomToast } from "components/CustomToast";
import { ReactSetState } from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces";
import { ActionPreviewModalHandler } from "dynamicCallFlow/PreviewModal/Action.Preview.Modal.Handler";
import { ActionDataGridFilterModal } from "dynamicCallFlow/DataGrid/Action.DataGrid.Filter.Modal";
import { PhoneNumberModalTypeEnum } from "dynamicCallFlow/DynamicCallFlow.PhoneNumber.Container.Modal.Controller";

const DYNAMIC_CALL_FLOW_ACTION_DATA_GRID_PAGE_NUMBER = "dynamicCallFlowActionDataGridPageNumber";
const DYNAMIC_CALL_FLOW_ACTION_DATA_GRID_RECORDS_PER_PAGE = "dynamicCallFlowActionDataGridRecordsPerPage";

export type ActionModalType = "Add" | "Edit" | "Bulk Delete" | "Batch Create" | "Bulk Edit" | "Filter" | NotInUseModalType;

export enum ActionModalTypeEnum {
  BatchCreate = "Batch Create",
  Filter = "Filter"
}

const ActionDataGridComponent = (): JSX.Element => {
  const {
    accessTokenGraph,
    currentOpenModal,
    modalController
  } = useContext(DynamicCallFlowActionContext);

  // sourceRecords is the master list of all records.  It is used to update the data grid records and to update the field options.
  const [sourceRecords, setSourceRecords ] = useState<Array<ActionRecordType>>([]);

  // dataGridRecords is the list of records that are displayed in the data grid.  It contains the results of when a filter is applied to sourceRecords.
  const [dataGridRecords, setDataGridRecords] = useState<Array<ActionRecordType>>([]);

  // dataGridProps stores the state of fetching data, the min and max id, and the max id.
  const [dataGridProps, setDataGridProps] = useState<DataGridStateProps>(initializeDataGrid());
  const dataGridFilter = useRef<ActionDataGridFilter>(new ActionDataGridFilter(setDataGridRecords));

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: sessionStorage.getItem(DYNAMIC_CALL_FLOW_ACTION_DATA_GRID_RECORDS_PER_PAGE) ? +sessionStorage.getItem(DYNAMIC_CALL_FLOW_ACTION_DATA_GRID_RECORDS_PER_PAGE) : 10,
    page: sessionStorage.getItem(DYNAMIC_CALL_FLOW_ACTION_DATA_GRID_PAGE_NUMBER) ? +sessionStorage.getItem(DYNAMIC_CALL_FLOW_ACTION_DATA_GRID_PAGE_NUMBER) : 1
  });

  const [alertBarProps, setAlertBarProps] = useState<AlertBarProps>(initialAlertBarProps);
  const alertBarController = useRef<AlertBarController>(new AlertBarController(setAlertBarProps));

  const [fieldOptions, setFieldOptions ] = useState<FieldOptions>({} as FieldOptions);

  const [actionFieldConfigs, setActionFieldConfigs] = useState<FieldConfigs>(ActionFormFieldConfigs);

  const dataGridApi = useGridApiRef<GridApiCommunity>();
  const dataGridController = useRef(new ActionDataGridController(dataGridApi, dataGridFilter,
    alertBarController));

  const previewModalHandler = useRef(new ActionPreviewModalHandler(dataGridController));

  useEffect(() => {
    const loadDataGrid = async(): Promise<void> => {
      alertBarController.current.info("Call Flow Configurations load in progress. Please wait for the complete set of data to be loaded.");
      let sortedRecords: Array<ActionRecordType>;
      let updatedDataGridProps: DataGridStateProps;

      try {
        const records: Array<ActionRecordType> = await actionListRecords(accessTokenGraph);
        [sortedRecords, updatedDataGridProps] = sortDataGrid<ActionRecordType>(records);
      } catch (error: unknown) {
        console.log(`Error loading dynamic call flow action data: ${(error as Error)?.message}`);
        alertBarController.current.error("Errors loading data.  Please check the console logs.");
      }

      setSourceRecords(sortedRecords);
      setDataGridRecords(sortedRecords);
      setDataGridProps(prevState => ({
        ...prevState,
        ...updatedDataGridProps
      }));

      const actionFieldOptionsManager: ActionFieldOptionsManager = new ActionFieldOptionsManager();
      setFieldOptions(actionFieldOptionsManager.generateOptions(sortedRecords));
      setActionFieldConfigs(actionFieldOptionsManager.updateFieldOptionsOnFieldConfigs(actionFieldConfigs));

      alertBarController.current.success("Call Flow Configurations have been successfully loaded.");
    };

    loadDataGrid();
  }, []);

  useEffect(() => {
    dataGridFilter.current.sourceRecords = sourceRecords;
  }, [sourceRecords]);

  useEffect(() => {
    dataGridController.current.dataGridRecords = dataGridRecords;
  }, [dataGridRecords]);

  useEffect(() => {
    dataGridFilter.current.fieldOptions = fieldOptions;
  }, [fieldOptions]);

  useEffect(() => {
    dataGridController.current.dataGridProps = dataGridProps;
  }, [dataGridProps]);

  const handlePaginationModelChange = (model: GridPaginationModel, details: GridCallbackDetails<any>) =>{
    sessionStorage.setItem(DYNAMIC_CALL_FLOW_ACTION_DATA_GRID_PAGE_NUMBER, model.page.toString());
    sessionStorage.setItem(DYNAMIC_CALL_FLOW_ACTION_DATA_GRID_RECORDS_PER_PAGE, model.pageSize.toString());
    setPaginationModel(model);
  };

  const handleCloseAlertBar = () => {
    setAlertBarProps(initialAlertBarProps);
  };

  const handlePreviewModalOpen = (event: any) => {
    dataGridController.current.sourceRecords = sourceRecords;
    dataGridController.current.dataGridRecords = dataGridRecords;
    modalController.current.openModal(ActionModalTypeEnum.BatchCreate);
  };

  const handlePreviewModalOnClose = () => {
    setSourceRecords([ ...dataGridController.current.sourceRecords ]);
    setDataGridProps( prevState => ({
      ...prevState,
      fetching: false
    }));

    dataGridFilter.current.sourceRecords = dataGridController.current.sourceRecords;
    dataGridFilter.current.applyFilter();
    modalController.current.closeModal();
  };

  function getRowId(row: ActionRecordType) {
    return row.actionId;
  }

  return (
    <div className="data-grid-wrapper">
      <div className="data-grid-wrapper">
        <div className="data-grid-wrapper">
          <ActionDataGridToolBar
            isFilterModalOpen={currentOpenModal === ActionModalTypeEnum.Filter}
            handlePreviewModalOpen={handlePreviewModalOpen}
            dataGridFilter={dataGridFilter}
            dataGridController={dataGridController}
          />
          <DataGrid
            apiRef={dataGridApi}
            rows={dataGridRecords}
            columns={ActionDataGridColumnDef}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[10, 20, 50, 100]}
            paginationMode="client"
            pagination
            loading={dataGridProps.fetching}
            autoHeight
            getRowId={getRowId}
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600
              }
            }}
          />
        </div>
      </div>
      <ActionDataGridFilterModal
        isOpen={currentOpenModal === ActionModalTypeEnum.Filter}
        dataGridFilter={dataGridFilter}
      />
      <ActionPreviewModal
        isOpen={currentOpenModal === ActionModalTypeEnum.BatchCreate}
        dataGridController={dataGridController}
        previewModalHandler={previewModalHandler}
        onClose={handlePreviewModalOnClose}
        modalType={currentOpenModal}
        maxId={dataGridProps.maxId}
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
