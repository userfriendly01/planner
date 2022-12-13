import React, {
  useEffect, useState
} from "react";
import {
  DataGrid, GridRenderCellParams, GridToolbar
} from "@mui/x-data-grid";
import { RoutingGridColumnDef } from "./GridColumnDef";
import {
  CctSharedCallRoutingDb, RoutingFilter, RoutingInitState, RoutingMasterData
} from "../AlohaRouting.Interfaces";
import { retrieveRoutingData } from "services";
import {
  CACHED_CALL_ROUTING_PAGE_NO,
  CACHED_CALL_ROUTING_PER_PAGE,
  CACHE_FILTER_ROUTING,
  getAccessToken,
  routingInitState,
  getGraphQLEndpoint,
  initializedAlertBar,
  downloadCSV,
  EXPORT_FILE_PREFIX
} from "utils";
import {
  getGridMasterData
} from "./GridMaster";
import { RoutingTableBox } from "../AlohaRouting.Styles";
import GridSpinner from "./GridSpinner";
import { CustomFlowRoutingToolBar } from "../RoutingCustomActions/CustomRoutingGridToolBar";
import { CustomToast } from "components";
import {
  RoutingAdvanceSearch, AddRouting, EditRouting
} from "../RoutingCustomActions";
import { AlertBarProps } from "utils/interfaces";

export const DataGridRouting = (): JSX.Element => {
  const accessToken: string = getAccessToken();
  const graphQlApiUrl: string = getGraphQLEndpoint();
  const reducer = (state: RoutingInitState, updatedState: RoutingInitState): RoutingInitState => {
    return {
      ...state,
      ...updatedState
    };
  };
  const [state, dispatch] = React.useReducer(reducer, routingInitState);
  const [alertBar, setAlertBar] = useState(initializedAlertBar);

  useEffect(() => {
    dispatch({ advanceFilter: getAdvanceFilter() });
    loadDataTable().then(() => {
      // nothing
    });
  }, []);

  const getAdvanceFilter = (): RoutingFilter => {
    try {
      const cachedFilter: string | undefined = localStorage.getItem(CACHE_FILTER_ROUTING);
      const advanceFilter: RoutingFilter = JSON.parse(cachedFilter) || {};
      Object.keys(advanceFilter).forEach((key: keyof RoutingFilter) => {
        if (advanceFilter[key] === "") {
          delete advanceFilter[key];
        }
      });
      dispatch({ advanceFilter: advanceFilter });
      return advanceFilter;
    } catch (e) {
      console.log(e);
    }
    return {};
  };

  const handleSearchDDChange = (event: any) => {
    dispatch({
      advanceFilter: {
        ...state.advanceFilter,
        [event.target.name]: event.target.value
      }
    });
  };

  const filterRecords = (dataRec?: CctSharedCallRoutingDb[], minId?: number, maxId?: number) => {
    let {
      data, idStart, idEnd
    } = state;
    if (dataRec && dataRec !== undefined) {
      data = dataRec;
      idStart = minId;
      idEnd = maxId;
    }
    const result: CctSharedCallRoutingDb[] = data.filter(item => item.id >= idStart && item.id <= idEnd);
    const advanceFilter: RoutingFilter = getAdvanceFilter();
    const advanceFilterLength: number = Object.keys(advanceFilter).length;
    if (advanceFilterLength > 0) {
      const advanceFilteredArray: Array<CctSharedCallRoutingDb> = [];
      result.forEach(item => {
        let matched = 0;
        Object.keys(advanceFilter).forEach((key: keyof RoutingFilter) => {
          if (item[key] === advanceFilter[key]) {
            matched += 1;
          }
        });
        if (advanceFilterLength === matched) {
          advanceFilteredArray.push(item);
        }
      });
      dispatch({ filteredItems: advanceFilteredArray });
    } else {
      dispatch({ filteredItems: result });
    }
  };

  const loadDataTable = async () => {
    const result: CctSharedCallRoutingDb[] = await retrieveRoutingData(accessToken, graphQlApiUrl);
    if (result.length > 0) {
      const sortedResult: CctSharedCallRoutingDb[] = result.sort(((a: CctSharedCallRoutingDb, b: CctSharedCallRoutingDb) => a.id - b.id));
      const minId: number = sortedResult[0].id;
      const maxId: number = sortedResult[result.length - 1].id;
      dispatch({
        data: result,
        filteredItems: result,
        fetching: false,
        idStart: minId,
        idEnd: maxId,
        maxId,
        minId
      });
      const masterData: RoutingMasterData = getGridMasterData(result);
      const advanceFilter: RoutingFilter = getAdvanceFilter();
      const advanceFilterLength: number = Object.keys(advanceFilter).length;
      if (advanceFilterLength > 0) {
        filterRecords(result, minId, maxId);
      }
      dispatch({ masterData });
    } else {
      dispatch({
        data: result,
        filteredItems: result,
        fetching: false
      });
    }
  };


  const openAddModal = (flag: boolean) => {
    if (!flag) {
      setAlertBar(alertBarProps => ({
        ...alertBarProps,
        open: flag,
        severityType: "success",
        msg: "New flow has been successfully added!! "
      }));
      loadDataTable();
    }
    dispatch({ isAddModalOpen: flag });
  };

  const setPerPage = (newPageSize: number) => {
    sessionStorage.setItem(CACHED_CALL_ROUTING_PER_PAGE, newPageSize.toString());
    dispatch({ perPage: newPageSize });
  };

  const setPage = (newPage: number) => {
    sessionStorage.setItem(CACHED_CALL_ROUTING_PAGE_NO, newPage.toString());
    dispatch({ page: newPage });
  };

  const handleClose = (flag: boolean) => {
    setAlertBar(alertBarProps => ({
      ...alertBarProps,
      open: flag
    }));
  };

  const openAdvanceSearchModal = (flag: boolean) => {
    if (state.advanceFilter && flag) {
      localStorage.setItem(CACHE_FILTER_ROUTING, JSON.stringify(state.advanceFilter));
    }
    dispatch({ isAdvanceSearchModalOpen: flag });
  };

  const openEditModal = (flag: boolean, isSubmitted?: boolean, row?: CctSharedCallRoutingDb, message?: string) => {
    if (!flag && isSubmitted) {
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        msg: message,
        severityType: "success"
      }));
      loadDataTable();
    }
    dispatch({
      isEditModalOpen: flag,
      selectedRow: row
    });
  };

  const exportDataFile = () =>{
    downloadCSV(EXPORT_FILE_PREFIX.ROUTING, state.filteredItems);
  };

  RoutingGridColumnDef[0].renderCell = (params: GridRenderCellParams<CctSharedCallRoutingDb>) => (<a href="#" onClick={() => openEditModal(true, false, params.row)}>{`${params.value}`}</a>);

  return (
    <div>
      <CustomFlowRoutingToolBar
        openAddModal={openAddModal}
        openAdvanceSearchModal={openAdvanceSearchModal}
        exportDataFile={exportDataFile}
      />
      <RoutingTableBox>
        <DataGrid
          rows={state.filteredItems}
          columns={RoutingGridColumnDef}
          page={state.page}
          pageSize={state.perPage}
          onPageChange={(newPage: number) => setPage(newPage)}
          onPageSizeChange={(newPageSize: number) => setPerPage(newPageSize)}
          rowsPerPageOptions={[10, 20, 50, 100]}
          paginationMode="client"
          pagination
          loading={state.fetching}
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
      </RoutingTableBox>
      <AddRouting
        isOpen={state.isAddModalOpen}
        newId={state.maxId + 1}
        openModal={openAddModal}
        onClose={() => openAddModal(false)}
      />
      <EditRouting
        isOpen={state.isEditModalOpen}
        selectedRow={state.selectedRow}
        openEditModal={openEditModal}
      />
      <RoutingAdvanceSearch
        isOpen={state.isAdvanceSearchModalOpen}
        selection={state.advanceFilter}
        openModal={openAdvanceSearchModal}
        handleChange={handleSearchDDChange}
        masterData={state.masterData}
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
