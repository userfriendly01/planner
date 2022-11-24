/* eslint-disable react/prop-types */
/* class-methods-use-this,
   no-console,
   react/jsx-props-no-spreading
*/
import React, {
  useEffect, useState
} from "react";
import {
  DataGrid, GridRenderCellParams, GridToolbar
} from "@mui/x-data-grid";
import { retrieveFlowData } from "services";
import {
  getAccessToken,
  getGraphQLEndpoint,
  initializedAlertBar
} from "utils";
import CustomToast from "../../../core/CustomToast/CustomToast";
import {
  CctSharedCallFlowDb, FlowAdvanceFilter, FlowStateVariables
} from "../AlohaFlow.Interfaces";
import AddFlow from "../CustomActions/AddFlow/AddFlow";
import AdvanceSearchFlow from "../CustomActions/AdvanceSearch/AdvanceSearch";
import CustomFlowGridToolBar from "../CustomActions/CustomFlowGridToolBar";
import "./Grid.scss";
import FlowGridColumnDef from "./GridColumnDef";
import {
  getGridMasterData
} from "./GridMaster";
import GridSpinner from "./GridSpinner";
import { CACHE_FILTER_FLOW } from "../../../../utils/flowUtils";
import { EditFlow } from "../EditFlow"
import { AlertBarProps } from "utils/interfaces";


const DataGridFlow = (): JSX.Element => {
  const accessToken: string = getAccessToken();
  const graphQlApiUrl: string = getGraphQLEndpoint();
  const flowInitState: FlowStateVariables = {
    data: [],
    filteredItems: [],
    advanceFilter: {},
    masterData: getGridMasterData(),
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
  };
  const [dataFlow, setDataFlow] = useState(flowInitState);
  const [alertBar, setAlertBar] = useState(initializedAlertBar);

  useEffect(() => {
    loadDataTable();
    setDataFlow((dataFlowProps: FlowStateVariables) => ({
      ...dataFlowProps,
      page: +sessionStorage.getItem("CALL_FLOW_PAGE_NO") || 1,
      perPage: +sessionStorage.getItem("CALL_FLOW_PER_PAGE") || 10
    }));
  }, []);

  const setPage = (newPage: number) => {
    sessionStorage.setItem("CALL_FLOW_PAGE_NO", newPage.toString());
    setDataFlow((dataFlowProps: FlowStateVariables) => ({
      ...dataFlowProps,
      page: newPage
    }));
  };

  const setPerPage = (newPerPage: number) => {
    sessionStorage.setItem("CALL_FLOW_PER_PAGE", newPerPage.toString());
    setDataFlow((dataFlowProps: FlowStateVariables) => ({
      ...dataFlowProps,
      perPage: newPerPage
    }));
  };

  const handleClose = (flag: boolean) => {
    setAlertBar((alertBarProps: AlertBarProps) => ({
      ...alertBarProps,
      open: flag
    }));
  };

  const handleSearchDDChange = (event: any) => {
    setDataFlow((dataFlowProps: FlowStateVariables) => ({
      ...dataFlowProps,
      advanceFilter: {
        ...dataFlowProps.advanceFilter,
        [event.target.name]: event.target.value
      }
    }));
  };

  const openAddModal = (flag: boolean, ruleType?: number) => {
    if (!flag && ruleType) {
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: flag,
        severityType: "success",
        msg: "New flow has been successfully added!! "
      }));
      loadDataTable();
    }
    setDataFlow((dataFlowProps: FlowStateVariables) => ({
      ...dataFlowProps,
      isAddModalOpen: flag
    }));
  };

  const openAdvanceSearchModal = (flag: boolean, advanceFilter?: FlowAdvanceFilter) => {
    if (advanceFilter) {
      localStorage.setItem(CACHE_FILTER_FLOW, JSON.stringify(dataFlow?.advanceFilter));
      setDataFlow((dataFlowProps: FlowStateVariables) => ({
        ...dataFlowProps,
        advanceFilter
      }));
    }
    setDataFlow((dataFlowProps: FlowStateVariables) => ({
      ...dataFlowProps,
      isAdvanceSearchModalOpen: flag
    }));
  };

  const getAdvanceFilter = () => {
    let advanceFilter: { [key: string]: undefined; };
    try {
      const cachedFilter: string = localStorage.getItem(CACHE_FILTER_FLOW);
      advanceFilter = JSON.parse(cachedFilter) || {};
      Object.keys(advanceFilter).forEach(key => {
        if (advanceFilter[key] === "") {
          delete advanceFilter[key];
        }
      });
    } catch (e) {
      advanceFilter = {};
    }
    return advanceFilter;
  };

  const filterRecords = () => {
    const {
      data, idStart, idEnd
    } = dataFlow;
    const result = data.filter(
      (item: CctSharedCallFlowDb) => item.id >= idStart && item.id <= idEnd
    );
    const advanceFilter = getAdvanceFilter();
    const advanceFilterLength: number = Object.keys(advanceFilter).length;
    if (advanceFilterLength > 0) {
      const advanceFilteredArray: FlowAdvanceFilter[] = [];
      result.forEach(item => {
        let matched: number = 0;
        Object.keys(advanceFilter).forEach(key => {
          let tempItem: any = item;
          if (key === "callFlowRoute") {
            tempItem = tempItem.content;
          }
          if (key === "pkey" && tempItem && tempItem[key]) {
            if (tempItem[key].includes(advanceFilter[key])) {
              matched += 1;
            }
          } else if (tempItem && tempItem[key] === advanceFilter[key]) {
            matched += 1;
          }
        });
        if (advanceFilterLength === matched) {
          advanceFilteredArray.push(item);
        }
      });
      setDataFlow((dataFlowProps: FlowStateVariables) => ({
        ...dataFlowProps,
        filteredItems: advanceFilteredArray
      }));
    } else {
      setDataFlow((dataFlowProps: FlowStateVariables) => ({
        ...dataFlowProps,
        filteredItems: result
      }));
    }
  };


  const loadDataTable = async () => {
    let result: CctSharedCallFlowDb[] = await retrieveFlowData(
      accessToken,
      graphQlApiUrl
    );
    if (result.length > 0) {
      result = result.sort((a: CctSharedCallFlowDb, b: CctSharedCallFlowDb) => (a.id - b.id));
      result = result.map((item: CctSharedCallFlowDb, index: number) => ({
        ...item,
        id: index + 1
      }));
      const minId: number = result[0].id;
      const maxId: number = result[result.length - 1].id;

      const masterData = getGridMasterData(result);
      setDataFlow((dataFlowProps: FlowStateVariables) => ({
        ...dataFlowProps,
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
      setDataFlow((dataFlowProps: FlowStateVariables) => ({
        ...dataFlowProps,
        data: result,
        filteredItems: result,
        fetching: false
      }));
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        msg: "Error in retrieving Flow record. Please check the API Key",
        severityType: "error"
      }));
    }
  };

  const openEditModal = (flag: boolean, isSubmitted?: boolean, row?: CctSharedCallFlowDb, message?: string) => {
    if (!flag && isSubmitted) {
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        msg: message,
        severityType: "success"
      }));
      loadDataTable();
    }
    setDataFlow((currentDataFlow: FlowStateVariables) => (
      { ...currentDataFlow, isEditModalOpen: flag, selectedRow: row }
    ));
  }

  FlowGridColumnDef[0].renderCell = (params: GridRenderCellParams<CctSharedCallFlowDb>) => (<a href="#" onClick={() => openEditModal(true, false, params.row)}>{`${params.value}`}</a>);


  return (
    <div className="data-grid-wrapper">
      <div className="data-grid-wrapper">
        <div className="data-grid-wrapper">
          <CustomFlowGridToolBar
            openAddModal={openAddModal}
            openAdvanceSearchModal={openAdvanceSearchModal} ></CustomFlowGridToolBar>
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
            disableSelectionOnClick
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
        }}
      />

      <EditFlow
        isOpen={dataFlow.isEditModalOpen}
        selectedRow={dataFlow.selectedRow}
        openEditModal={openEditModal}
      />

      <AdvanceSearchFlow
        isOpen={dataFlow.isAdvanceSearchModalOpen}
        selection={dataFlow.advanceFilter}
        openModal={openAdvanceSearchModal}
        handleChange={handleSearchDDChange}
        masterData={dataFlow.masterData}
        applyFilter={filterRecords}
        onClose={() => {
          openAdvanceSearchModal(false);
          return true;
        }}
      />

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

