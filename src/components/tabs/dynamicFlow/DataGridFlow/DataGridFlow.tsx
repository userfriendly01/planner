import { AzureSPA } from "globals";
import React, {
  useEffect, useState
} from "react";
import { CustomFlowGridToolBar } from "../CustomActions/CustomFlowGridToolBar";
import {
  DynamicAction,
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
  queryFlowData, queryLSCDynamicFlowData, retrieveFlowData
} from "services";
import {
  CctSharedCallFlowDb, FlowAdvanceFilter, FlowStateVariables
} from "components";
import { getDynamicGridMasterData } from "./DynamicGridMaster";


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
  const handleOnBulkCreate = async(rows: Array<DynamicAction> ) =>{

    setAlertBar((alertBarProps: AlertBarProps) => ({
      ...alertBarProps,
      open: true,
      msg: "Dyanmic Flows have been successfully created.",
      severityType: "success"
    }));
  };

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

  return (
    <div className="data-grid-wrapper">
      <div className="data-grid-wrapper">
        <div className="data-grid-wrapper">
          <CustomFlowGridToolBar
            matchedGroups={matchedGroups}
            openPreviewModal={openPreviewModal}
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
