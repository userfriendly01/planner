import React, {
  useEffect, useState, useRef
} from "react";
import {
  DataGrid, GridRenderCellParams, GridToolbar
} from "@mui/x-data-grid";
import { RoutingGridColumnDef } from "./GridColumnDef";
import {
  CctSharedCallRoutingDb, RoutingFilter, RoutingStateVariables, RoutingMasterData, AddPageFieldConfigProps
} from "../AlohaRouting.Interfaces";
import { retrieveRoutingData } from "services";
import {
  CACHED_CALL_ROUTING_PAGE_NO,
  CACHED_CALL_ROUTING_PER_PAGE,
  CACHE_FILTER_ROUTING,
  routingInitState,
  getGraphQLEndpoint,
  initializedAlertBar,
  downloadCSV,
  EXPORT_FILE_PREFIX,
  routingInitRule,
  routingFields
} from "utils";
import {
  getGridMasterData
} from "./GridMaster";
import { RoutingTableBox } from "../AlohaRouting.Styles";
import GridSpinner from "./GridSpinner";
import { CustomToast } from "components";
import {
  RoutingAdvanceSearch, AddRouting, EditRouting, CustomRoutingGridToolBar
} from "../RoutingCustomActions";
import {
  AlertBarProps, FormValidationRule
} from "utils/interfaces";
import { AzureSPA } from "globals";

export const DataGridRouting = (props: AzureSPA ): JSX.Element => {
  const {
    accessToken,
    matchedGroups
  } = props;

  const graphQlApiUrl: string = getGraphQLEndpoint();
  const [state, setState] = useState<RoutingStateVariables>(routingInitState);
  const [alertBar, setAlertBar] = useState(initializedAlertBar);
  const [routingRule, setRoutingRule] = useState({ ...routingInitRule });
  const [clonedRule, setClonedRule] = useState(false);
  const maxRef = useRef(0);
  useEffect(() => {
    const getTableData = async () =>{
      const result: CctSharedCallRoutingDb[] = await retrieveRoutingData(accessToken, graphQlApiUrl);
      loadDataTable(result);
    };
    getTableData();
  }, []);

  const getAdvanceFilter = (): RoutingFilter => {
    try {
      const cachedFilter: string | null = localStorage.getItem(CACHE_FILTER_ROUTING);
      const advanceFilter: RoutingFilter = JSON.parse(cachedFilter) || {};
      Object.keys(advanceFilter).forEach((key: keyof RoutingFilter) => {
        if (advanceFilter[key] === "" || advanceFilter[key] === null) {
          delete advanceFilter[key];
        }
      });
      return advanceFilter;
    } catch (e) {
      console.log(e);
    }
    return {};
  };

  const handleSearchDDChange = (event: any) => {
    setState(
      {
        ...state,
        advanceFilter: {
          ...state.advanceFilter,
          [event.target.name]: event.target.value
        }
      });
  };


  const filterRecords = (dataRec?: CctSharedCallRoutingDb[], minId?: number, maxId?: number): CctSharedCallRoutingDb[] => {
    let {
      data, idStart, idEnd
    } = state;
    if (dataRec && dataRec !== undefined) {
      data = dataRec;
      idStart = minId;
      idEnd = maxId;
    }
    const result: CctSharedCallRoutingDb[] = data.filter((item: CctSharedCallRoutingDb) => item.id >= idStart && item.id <= idEnd);
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
      return advanceFilteredArray;
    } else {
      return result;
    }
  };

  const applyFilter = (): void =>{
    const filteredItems: CctSharedCallRoutingDb[] = filterRecords();
    setState({
      ...state,
      filteredItems,
      isAdvanceSearchModalOpen: false,
      advanceFilter: getAdvanceFilter()
    });
  };

  const loadDataTable = (result?: CctSharedCallRoutingDb[]) => {
    if (result?.length > 0) {
      const sortedResult: CctSharedCallRoutingDb[] = result.sort(((a: CctSharedCallRoutingDb, b: CctSharedCallRoutingDb) => a.id - b.id));
      const minId: number = sortedResult[0].id;
      const maxId: number = sortedResult[result.length - 1].id;
      const masterData: RoutingMasterData = getGridMasterData(result);
      const advanceFilter: RoutingFilter = getAdvanceFilter();
      const filteredItems: CctSharedCallRoutingDb[] = filterRecords(result, minId, maxId);
      maxRef.current = maxId;
      setState({
        ...state,
        maxId: maxId,
        advanceFilter,
        filteredItems,
        data: result,
        fetching: false,
        idStart: minId,
        idEnd: maxId,
        minId: minId,
        masterData,
        isAddModalOpen: false,
        isEditModalOpen: false,
        isAdvanceSearchModalOpen: false
      });
    } else {
      setState({
        ...state,
        ...(result) && {
          data: result,
          filteredItems: result
        },
        fetching: false,
        isAddModalOpen: false,
        isEditModalOpen: false,
        isAdvanceSearchModalOpen: false
      });
    }
  };


  const openAddModal = (flag: boolean,openAddModal?:boolean, row?: CctSharedCallRoutingDb) => {
    let newData;
    if(!openAddModal){
      setClonedRule(openAddModal);
    }
    if (!flag) {
      newData = row? state.data.concat(row) : undefined;

      setAlertBar(alertBarProps => ({
        ...alertBarProps,
        open: flag,
        severityType: "success",
        msg: "New flow has been successfully added!! "
      }));
    }
    loadDataTable(newData);
    setState({
      ...state,
      isAddModalOpen: flag
    });
  };

  const setPerPage = (newPageSize: number) => {
    sessionStorage.setItem(CACHED_CALL_ROUTING_PER_PAGE, newPageSize.toString());
    setState({
      ...state,
      perPage: newPageSize
    });
  };

  const setPage = (newPage: number) => {
    sessionStorage.setItem(CACHED_CALL_ROUTING_PAGE_NO, newPage.toString());
    setState({
      ...state ,
      page: newPage
    });
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
    setState({
      ...state,
      isAdvanceSearchModalOpen: flag
    });
  };

  const cloneRule = (flag: boolean, row: CctSharedCallRoutingDb) => {
    setClonedRule(!flag);
    row.id = maxRef.current + 1;
    const skey = row.brand+"__"+row.channel+"__"+row.id;
    row.skey = skey;
    const routeInitRule = routingFields.reduce((a: FormValidationRule, v: AddPageFieldConfigProps) => ({
      ...a,
      [v.key]: {
        error: false,
        value: v.valueGetter(row),
        required: v.required || false
      }
    }), {});
    setRoutingRule({ ...routeInitRule });
    setState((currentDataRouting: RoutingStateVariables)=>({
      ...currentDataRouting,
      isEditModalOpen: flag,
      isAddModalOpen: !flag
    }));
  };

  const openEditModal = (flag: boolean, isSubmitted?: boolean, row?: CctSharedCallRoutingDb, message?: string, deleteRow?: boolean,type?: boolean) => {
    let newData;
    if(type){
      cloneRule(flag,row);
    }
    else if (!flag && isSubmitted) {
      if(deleteRow) {
        newData = state.data.filter(x=> x.skey !== row.skey);
      } else {
        newData = row ? state.data.map(x=> x.skey === row.skey ? row : x) : undefined;
      }
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        msg: message,
        severityType: "success"
      }));
      loadDataTable(newData);
    }
    setState((currentDataRouting: RoutingStateVariables)=>({
      ...currentDataRouting,
      isEditModalOpen: flag,
      selectedRow: row
    }));
  };

  const exportDataFile = () =>{
    downloadCSV(EXPORT_FILE_PREFIX.ROUTING, state.filteredItems);
  };

  RoutingGridColumnDef[0].renderCell = (params: GridRenderCellParams<CctSharedCallRoutingDb>) => (<a href="#" onClick={() => openEditModal(true, false, params.row)}>{`${params.value}`}</a>);

  return (
    <div>
      <CustomRoutingGridToolBar
        openAddModal={openAddModal}
        openAdvanceSearchModal={openAdvanceSearchModal}
        exportDataFile={exportDataFile}
        applyFilter={applyFilter}
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
        accessToken={accessToken}
        matchedGroups={matchedGroups}
        isOpen={state.isAddModalOpen}
        newId={maxRef.current + 1}
        openModal={openAddModal}
        cloneRouteRule = {clonedRule}
        routeRule = {routingRule}
      />
      <EditRouting
        accessToken={accessToken}
        matchedGroups={matchedGroups}
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
        applyFilter={applyFilter}
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
