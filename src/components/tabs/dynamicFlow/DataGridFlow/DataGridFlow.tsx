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
  getGraphQLEndpoint, initializedAlertBar
} from "utils";
import { PreviewModal } from "../PreviewModal/PreviewModal";
import {
  queryFlowData, queryLSCDynamicFlowData, retrieveFlowData
} from "services";
import { CctSharedCallFlowDb } from "components";

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

    // const response = await batchFlowCreate(rows, accessToken, graphQLEndpoint);
    // if(response?.flag) {
    //   setAlertBar((alertBarProps: AlertBarProps) => ({
    //     ...alertBarProps,
    //     open: true,
    //     msg: response?.alertMsg || "Error while creating the records.",
    //     severityType: "error"
    //   }));
    // } else {
    setAlertBar((alertBarProps: AlertBarProps) => ({
      ...alertBarProps,
      open: true,
      msg: "Dyanmic Flows have been successfully created.",
      severityType: "success"
    }));
    // }
    //setSelectedList([...response.failure]);
    // const filteredItems = [...dataFlow.filteredItems, ...response.success];
    // const filteredData = [...dataFlow.data, ...response.success];
    // setDataFlow({
    //   ...dataFlow,
    //   ...filteredItems && { filteredItems },
    //   data: filteredData,
    //   isPreviewModalOpen: false
    // });
    // apiRef.current.setRowSelectionModel([]);
  };

  useEffect(() => {
    const getTableData = async()=>{
      const firstChunkData:any = await queryLSCDynamicFlowData(accessToken,  graphQLEndpoint);
      const listItems = firstChunkData?.data?.getCallFlowConfig?.items || [];
      let counter =1;
      const flowData: Action[] = [];
      listItems.forEach((item: Action) => {
        if (item) {
          flowData.push({
            ...item,
            id: counter++
          });
        }
      });

      await loadDataTable(flowData);
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        severityType: "info",
        msg: "Data loading in progress. Please wait for the complete set of data to be loaded.",
        duration: 15000
      }));
      const result: CctSharedCallFlowDb[] = await retrieveFlowData(
        accessToken,
        graphQLEndpoint,
        firstChunkData
      );
      await loadDataTable(result);
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        severityType: "success",
        msg: "Successfully loaded the flow data!!"
      }));
    };
    getTableData();
  }, []);

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
