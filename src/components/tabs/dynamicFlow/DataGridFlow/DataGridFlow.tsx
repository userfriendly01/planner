import { AzureSPA } from "globals";
import React, {
  useEffect, useState
} from "react";
import { CustomFlowGridToolBar } from "../CustomActions/CustomFlowGridToolBar";
import {
  DynamicAction, DynamicFlowStateVariables,
  DynamicStateVariables,
  PreviewModalAction
} from "../DynamicFlow.Interfaces";
import { AlertBarProps } from "utils/interfaces";
import {
  CACHE_FILTER_FLOW,
  getAdvanceFilter,
  getGraphQLEndpoint, initializedAlertBar
} from "utils";
import { PreviewModal } from "../PreviewModal/PreviewModal";
import {
  batchDynamicFlowCreate,
  queryLSCDynamicFlowData,
} from "services";
import { getDynamicGridMasterData } from "./DynamicGridMaster";
import {
  DataGrid, useGridApiRef
} from "@mui/x-data-grid";
import FlowGridColumnDef from "../../alohaFlow/DataGridFlow/GridColumnDef";
import DynamicFlowGridColumnDef from "./DynamicGridColumnDef";


const DataGridFlow = (props: AzureSPA): JSX.Element => {
  const {
    accessToken,
    matchedGroups
  } = props;

  const flowInitState: DynamicStateVariables = {
    data: [],
    filteredItems: [] ,
    fetching: true,
    selectedRow: undefined,
    isPreviewModalOpen: false,
    saveSuccess: 0
  };
  const [dataFlow, setDataFlow] = useState(flowInitState);
  const [selectedList, setSelectedList] = useState<Array<DynamicAction>>([]);
  const [alertBar, setAlertBar] = useState(initializedAlertBar);
  // Get GraphQL Endpoint. TODO check url
  const graphQLEndpoint = getGraphQLEndpoint();
  const openPreviewModal = (flag: boolean, action: PreviewModalAction) =>{
    setDataFlow((dataFlowProps: DynamicStateVariables) => ({
      ...dataFlowProps,
      isPreviewModalOpen: flag,
      previewModalAction: action
    }));
  };
  // const handleOnBulkCreate = async(rows: Array<DynamicAction> ) =>{
  //
  //   setAlertBar((alertBarProps: AlertBarProps) => ({
  //     ...alertBarProps,
  //     open: true,
  //     msg: "Dyanmic Flows have been successfully created.",
  //     severityType: "success"
  //   }));
  // };
  const apiRef = useGridApiRef();
  useEffect(() => {
    const getTableData = async()=>{

      // Dynamodb GraphQl Query
      const firstChunkData:any = await queryLSCDynamicFlowData(accessToken,  graphQLEndpoint);

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

      // Load Table Data into grid
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
        msg: "Successfully loaded the flow data!!"
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

  const handlePreviewModalOnClose = () =>{
    setDataFlow((dataFlowProps: DynamicStateVariables) => ({
      ...dataFlowProps,
      isPreviewModalOpen: false
    }));
  };

  const handleOnBulkCreate = async(rows: Array<DynamicAction> ) =>{
     const response = await batchDynamicFlowCreate(rows, accessToken, graphQLEndpoint);
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
        msg: "Flow Rules have been successfully created.",
        severityType: "success"
      }));
    }
    setSelectedList([...response.failure]);
    const filteredItems = [...dataFlow.filteredItems, ...response.success];
    const filteredData = [...dataFlow.data, ...response.success];
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
