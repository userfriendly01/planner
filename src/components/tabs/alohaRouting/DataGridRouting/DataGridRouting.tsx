import React, {
  useEffect, useState
} from "react";
import {
  DataGrid, GridToolbar
} from "@mui/x-data-grid";
import { RoutingGridColumnDef } from "./GridColumnDef";
import {
  CctSharedCallRoutingGlobalDb, RoutingFilter, RoutingInitState, RoutingMasterData
} from "../AlohaRouting.Interfaces";
import { retrieveRoutingData } from "services";
import {
  CACHED_CALL_ROUTING_PAGE_NO, CACHED_CALL_ROUTING_PER_PAGE, CACHE_FILTER_ROUTING, getAccessToken, routingInitState, getGraphQLEndpoint
} from "utils";
import {
  getGridMasterData
} from "./GridMaster";
import { RoutingTableBox } from "../AlohaRouting.Styles";
import GridSpinner from "./GridSpinner";
import { CustomFlowRoutingToolBar } from "../RoutingCustomActions/CustomRoutingGridToolBar";
import { CustomToast } from "components";
import {
  RoutingAdvanceSearch, AddRouting
} from "../RoutingCustomActions";

export const DataGridRouting = ():JSX.Element => {
  const accessToken: string = getAccessToken();
  const graphQlApiUrl: string = getGraphQLEndpoint();
  const reducer = (state: RoutingInitState, updatedState: RoutingInitState): RoutingInitState => {
    return {
      ...state,
      ...updatedState
    };
  };
  const [state, dispatch] = React.useReducer(reducer, routingInitState);

  const [alertBar, setAlertBar] = useState({
    open: false,
    msg: "",
    severityType: ""
  });
  useEffect(()=>{
    dispatch({ advanceFilter: getAdvanceFilter() });
  },[]);
  useEffect(() => {
    loadDataTable().then(() => {
      console.log("Data Table:", state.filteredItems);
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

  const handleSearchDDChange = (event:any)=> {
    dispatch({
      advanceFilter: {
        ...state.advanceFilter,
        [event.target.name]: event.target.value
      }
    });
  };

  const filterRecords = (dataRec?:CctSharedCallRoutingGlobalDb[], minId?:number, maxId?:number) => {
    let {
      data, idStart, idEnd
    } = state;
    if(dataRec && dataRec !== undefined) {
      data = dataRec;
      idStart = minId;
      idEnd = maxId;
    }
    const result: CctSharedCallRoutingGlobalDb[] = data.filter(item => item.id >= idStart && item.id <= idEnd);
    const advanceFilter: RoutingFilter = getAdvanceFilter();
    const advanceFilterLength: number = Object.keys(advanceFilter).length;
    if (advanceFilterLength > 0) {
      const advanceFilteredArray: Array<CctSharedCallRoutingGlobalDb> = [];
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
      console.log("filterRecords>", advanceFilteredArray);
      dispatch({ filteredItems: advanceFilteredArray });
    } else {
      dispatch({ filteredItems: result });
    }
  };

  const loadDataTable = async () => {
    const result: CctSharedCallRoutingGlobalDb[] = await retrieveRoutingData(accessToken, graphQlApiUrl);
    if (result.length > 0) {
      const sortedResult: CctSharedCallRoutingGlobalDb[] = result.sort(((a: CctSharedCallRoutingGlobalDb, b: CctSharedCallRoutingGlobalDb) => a.id - b.id));
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

  const openAdvanceSearchModal = (flag:boolean)=> {
    if (state.advanceFilter && flag) {
      localStorage.setItem(CACHE_FILTER_ROUTING, JSON.stringify(state.advanceFilter));
    }
    dispatch({ isAdvanceSearchModalOpen: flag });
  };

  return (
    <div>
      <CustomFlowRoutingToolBar openAddModal={openAddModal} openAdvanceSearchModal ={openAdvanceSearchModal} />
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