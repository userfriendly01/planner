import { AzureSPA } from "globals";
import React, {
  useEffect, useState
} from "react";
import { CustomFlowGridToolBar } from "../CustomActions/CustomFlowGridToolBar";
import {
  DynamicAction, DynamicFlowStateVariables,
  ActionPreview,
  DynamicStateVariables,
  PreviewModalAction
} from "../DynamicFlow.Interfaces";
import { AlertBarProps } from "utils/interfaces";
import {
  initializedAlertBar
} from "utils";
import { PreviewModal } from "../PreviewModal/PreviewModal";
import {
  batchDynamicFlowCreate,
  queryDynamicFlowData
} from "services";
import { getDynamicGridMasterData } from "./DynamicGridMaster";
import {
  DataGrid, useGridApiRef
} from "@mui/x-data-grid";
import DynamicFlowGridColumnDef from "./DynamicGridColumnDef";
import { CustomToast } from "components";


const DataGridFlow = (props: AzureSPA): JSX.Element => {
  const {
    accessToken,
    matchedGroups
  } = props;

  const flowInitState: DynamicStateVariables = {
    data: [],
    filteredItems: [] ,
    fetching: false,
    selectedRow: undefined,
    isPreviewModalOpen: false,
    saveSuccess: 0
  };
  const [dataFlow, setDataFlow] = useState(flowInitState);
  const [selectedList, setSelectedList] = useState<Array<ActionPreview>>([]);
  const [alertBar, setAlertBar] = useState(initializedAlertBar);
  const openPreviewModal = (flag: boolean, action: PreviewModalAction) =>{
    setDataFlow((dataFlowProps: DynamicStateVariables) => ({
      ...dataFlowProps,
      isPreviewModalOpen: flag,
      previewModalAction: action
    }));
  };

  const apiRef = useGridApiRef();
  /**
   * Below function Query new Dynamo db (V1) table
   * and prepare array to display in the data grid
   */
  useEffect(() => {
    const getTableData = async()=>{

      // GraphQL Query
      const firstChunkData:any = await queryDynamicFlowData(accessToken);

      // Build an array from objects return from dynamo.
      const listItems = firstChunkData?.data?.getCallFlowConfig?.items || [];
      let counter =1;
      const dynamicFlowData: DynamicAction[] = [];
      listItems.forEach((item: DynamicAction) => {
        if (item) {
          dynamicFlowData.push({
            ...item,
            id: counter++
          });
        }
      });

      await loadDataTable(dynamicFlowData);

      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        severityType: "info",
        msg: "Data loading in progress. Please wait for the complete set of data to be loaded.",
        duration: 15000
      }));

      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        severityType: "success",
        msg: "Successfully loaded the dynamic flow data!!"
      }));
    };
    getTableData();
  }, []);

  const loadDataTable = async (result?: DynamicAction[]) => {
    if (result?.length > 0) {
      result = result.sort((a: DynamicAction, b: DynamicAction) => (a.id - b.id));
      result = result.map((item: DynamicAction, index: number) => ({
        ...item,
        id: index + 1
      }));
      const minId: number = result[0].id;
      const maxId: number = result[result.length - 1].id;
      const masterData = getDynamicGridMasterData(result);

      // Set Data Flow
      setDataFlow((dynamicDataFlowProps: DynamicFlowStateVariables) => ({
        ...dynamicDataFlowProps,
        data: result,
        filteredItems: result,
        fetching: false,
        idStart: minId,
        idEnd: maxId,
        maxId,
        minId,
        masterData
      }));

    } else {
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        msg: "Error in retrieving Flow record. Please check the API Key",
        severityType: "error"
      }));
    }
  };

  const handleClose = (flag: boolean) => {
    setAlertBar((alertBarProps: AlertBarProps) => ({
      ...alertBarProps,
      open: flag
    }));
  };

  const handlePreviewModalOnClose = () =>{
    setDataFlow((dataFlowProps: DynamicStateVariables) => ({
      ...dataFlowProps,
      isPreviewModalOpen: false
    }));
  };

  const handleOnBulkCreate = async(rows: Array<DynamicAction> ) =>{
    const response = await batchDynamicFlowCreate(rows, accessToken);
    if(response?.flag) {
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        msg: response?.alertMsg || "Error while creating the records.",
        severityType: "error"
      }));
    } else {
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        msg: "Dynamic Flow Rules have been successfully created.",
        severityType: "success"
      }));
    }
    setSelectedList([...response.failure]);
    const SuccessObj: any = { };
    response.success.forEach((x: any) => SuccessObj[x.actionId] = x);
    const filteredItems = dataFlow.filteredItems.map( x=> SuccessObj[x.actionId] || x);
    const filteredData = dataFlow.data.map(y => SuccessObj[y.actionId] || y);
    setDataFlow({
      ...dataFlow,
      ...filteredItems && { filteredItems },
      data: filteredData,
      isPreviewModalOpen: false
    });
    apiRef.current.setRowSelectionModel([]);
  };

  return (
    <div className="data-grid-wrapper">
      <div className="data-grid-wrapper">
        <div className="data-grid-wrapper">
          <CustomFlowGridToolBar
            matchedGroups={matchedGroups}
            openPreviewModal={openPreviewModal}
          />
          <DataGrid
            apiRef={apiRef}
            rows={dataFlow.filteredItems}
            columns={DynamicFlowGridColumnDef}
            loading={dataFlow.fetching}
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight
            getRowId={(row: DynamicAction)=>row.actionId}
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600
              }
            }}
          />

        </div>
      </div>
      <CustomToast
        open={alertBar.open}
        onClose={handleClose}
        msg={alertBar.msg}
        severityType={alertBar.severityType}
        duration={alertBar.duration}
      />
      <PreviewModal
        action={dataFlow.previewModalAction}
        isOpen={dataFlow.isPreviewModalOpen}
        loading={dataFlow.fetching}
        onClose={handlePreviewModalOnClose}
        onCreate={handleOnBulkCreate}
        rows={selectedList}
      />
    </div>
  );
};

export default DataGridFlow;
