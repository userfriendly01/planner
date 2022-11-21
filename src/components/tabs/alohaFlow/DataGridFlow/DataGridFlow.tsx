/* eslint-disable react/prop-types */
/* class-methods-use-this,
   no-console,
   react/jsx-props-no-spreading
*/

import {
  DataGrid,
  GridToolbar
} from "@mui/x-data-grid";
import React, {
  useEffect, useState
} from "react";
import { retrieveFlowData } from "services";
import {
  getAccessToken,
  getGraphQLEndpoint
} from "utils";
import CustomToast from "../../../core/CustomToast/CustomToast";
import AddFlow from "../AddFlow/AddFlow";
import { CctSharedCallFlowDb } from "../AlohaFlow.Interfaces";
import "./Grid.scss";
import FlowGridColumnDef from "./GridColumnDef";
import { getGridMasterData } from "./GridMaster";
import GridSpinner from "./GridSpinner";
import CustomFlowGridToolBar from "./CustomFlowGridToolBar";

const DataGridFlow = () => {
  const accessToken: string = getAccessToken();
  const graphQlApiUrl: string = getGraphQLEndpoint();
  const [dataFlow, setDataFlow] = useState({
    data: [],
    filteredItems: [],
    advanceFilter: [],
    fetching: true,
    selectedRow: undefined,
    isEditModalOpen: false,
    isAddModalOpen: false,
    isAdvanceSearchModalOpen: false,
    idStart: 0,
    idEnd: 0,
    maxId: 0,
    minId: 0,
    saveSuccess: 0,
    page: 1,
    perPage: 10
  });
  const [alertBar, setAlertBar] = useState({
    open: false,
    msg: "",
    severityType: ""
  });

  useEffect(() => {
    loadDataTable();
    setDataFlow((dataFlowProps: any) => ({
      ...dataFlowProps,
      page: sessionStorage.getItem("CALL_FLOW_PAGE_NO") || 1,
      perPage: sessionStorage.getItem("CALL_FLOW_PER_PAGE") || 10
    }));
  }, []);

  const setPage = (newPage: number) => {
    sessionStorage.setItem("CALL_FLOW_PAGE_NO", newPage.toString());
    setDataFlow(dataFlowProps => ({
      ...dataFlowProps,
      page: newPage
    }));
  };

  const setPerPage = (newPerPage: number) => {
    sessionStorage.setItem("CALL_FLOW_PER_PAGE", newPerPage.toString());
    setDataFlow(dataFlowProps => ({
      ...dataFlowProps,
      perPage: newPerPage
    }));
  };

  const handleClose = (flag: boolean) => {
    setAlertBar(alertBarProps => ({
      ...alertBarProps,
      open: flag
    }));
  };

  const openAddModal = (flag: boolean, ruleType?: number) => {
    if (!flag && ruleType) {
      setAlertBar(alertBarProps => ({
        ...alertBarProps,
        open: flag,
        severityType: "success",
        msg: "New flow has been successfully added!! "
      }));
      loadDataTable();
    }
    setDataFlow(dataFlowProps => ({
      ...dataFlowProps,
      isAddModalOpen: flag
    }));
  };

  const loadDataTable = async () => {
    let result: CctSharedCallFlowDb[] = await retrieveFlowData(
      accessToken,
      graphQlApiUrl
    );
    if (result.length > 0) {
      result = result.sort((a: any, b: any) => a.pkey - b.pkey);
      result = result.map((item: any, index: any) => ({
        ...item,
        id: index + 1
      }));
      const minId = result[0].id;
      const maxId = result[result.length - 1].id;

      setDataFlow((dataFlowProps: any) => ({
        ...dataFlowProps,
        data: result,
        filteredItems: result,
        fetching: false,
        idStart: minId,
        idEnd: maxId,
        maxId: maxId,
        minId: minId
      }));
      const masterData = getGridMasterData(result);
      setDataFlow(dataFlowProps => ({
        ...dataFlowProps,
        masterData: masterData
      }));
    } else {
      setDataFlow((dataFlowProps: any) => ({
        ...dataFlowProps,
        data: result,
        filteredItems: result,
        fetching: false
      }));
      setAlertBar(alertBarProps => ({
        ...alertBarProps,
        open: true,
        msg: "Error in retrieving Flow record. Please check the API Key",
        severityType: "error"
      }));
    }
  };

  return (
    <div className="data-grid-wrapper">
      <div className="data-grid-wrapper">
        <div className="data-grid-wrapper">
          <CustomFlowGridToolBar openAddModal = {openAddModal}></CustomFlowGridToolBar>
          <DataGrid
            rows={dataFlow.filteredItems}
            columns={FlowGridColumnDef}
            page={dataFlow.page}
            pageSize={dataFlow.perPage}
            onPageChange={(newPage: number) => setPage(newPage)}
            onPageSizeChange={(newPageSize: number) => setPerPage(newPageSize)}
            rowsPerPageOptions={[5, 10, 20, 50, 100]}
            paginationMode="client"
            pagination
            loading={dataFlow.fetching}
            checkboxSelection
            autoHeight
            components={
              {
                Toolbar: GridToolbar,
                LoadingOverlay: GridSpinner
              }
            }
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600
              }
            }}
          />
        </div>
      </div>

      <AddFlow
        isOpen={dataFlow.isAddModalOpen}
        newId={dataFlow.maxId + 1}
        openModal={openAddModal}
        onClose={() => {
          openAddModal(false);
          return true;
        }}
      />

      {/*<EditModal
          accessToken={props.accessToken}
          isOpen={dataFlow["isEditModalOpen"]}
          className="data-grid-modal"
          selectedRow={dataFlow["selectedRow"]}
          openModal={openEditModal}
          onClose={() => {
            openEditModal(false);
            return true;
          }}
        />*/}

      {/*<AdvanceSearchModal
          isOpen={dataFlow["isAdvanceSearchModalOpen"]}
          className="data-grid-modal"
          selection={dataFlow["advanceFilter"]}
          openModal={openAdvanceSearchModal}
          handleChange={handleSearchDDChange}
          masterData={dataFlow["masterData"]}
          applyFilter={filterRecords}
          resetMasterData={clearGridMasterData}
          onClose={() => {
            openAdvanceSearchModal(false);
            return true;
          }}
        />*/}

      <CustomToast
        open={alertBar.open}
        onClose={handleClose}
        msg={alertBar.msg}
        severityType={alertBar.severityType}
      />
    </div>
  );
};

export default DataGridFlow;
