import { AzureSPA } from "globals";
import React, { useState } from "react";
import { CustomFlowGridToolBar } from "../CustomActions/CustomFlowGridToolBar";
import {
  Action, DynamicStateVariables, PreviewModalAction
} from "../DynamicFlow.Interfaces";
import { AlertBarProps } from "utils/interfaces";
import { initializedAlertBar } from "utils";
import { PreviewModal } from "../PreviewModal/PreviewModal";

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
  const [selectedList, setSelectedList] = useState<Array<Action>>([]);
  const [alertBar, setAlertBar] = useState(initializedAlertBar);

  const openPreviewModal = (flag: boolean, action: PreviewModalAction) =>{
    setDataFlow((dataFlowProps: DynamicStateVariables) => ({
      ...dataFlowProps,
      isPreviewModalOpen: flag,
      previewModalAction: action
    }));
  };
  const handleOnBulkCreate = async(rows: Array<Action> ) =>{

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