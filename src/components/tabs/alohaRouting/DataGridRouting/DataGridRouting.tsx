import {
  DataGrid, GridRenderCellParams
} from "@mui/x-data-grid";
import { CustomToast } from "components";
import { AzureSPA } from "globals";
import React, {
  useEffect, useRef, useState
} from "react";
import { queryRoutingData, retrieveRoutingData } from "services";
import {
  CACHED_CALL_ROUTING_PAGE_NO,
  CACHED_CALL_ROUTING_PER_PAGE,
  CACHE_FILTER_ROUTING, downloadCSV,
  EXPORT_FILE_PREFIX, getGraphQLEndpoint,
  initializedAlertBar, routingFields, routingInitRule, routingInitState
} from "utils";
import {
  AlertBarProps, FormValidationRule
} from "utils/interfaces";
import { AddPageFieldConfigProps, CctSharedCallRoutingDb, RoutingFilter, RoutingMasterData, RoutingStateVariables } from "../AlohaRouting.Interfaces";
import { RoutingTableBox } from "../AlohaRouting.Styles";
import { AddRouting, CustomRoutingGridToolBar, EditRouting, RoutingAdvanceSearch } from "../RoutingCustomActions";
import { RoutingGridColumnDef } from "./GridColumnDef";
import {
  getGridMasterData
} from "./GridMaster";
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
    const getTableData = async()=>{
      const routingData: CctSharedCallRoutingDb[] = [];
      const firstChunkData:any = await queryRoutingData(accessToken, null, graphQlApiUrl);
      const listItems = firstChunkData.data?.listCctSharedCallRoutingGlobalDbs?.items || [];
      listItems.map((item:CctSharedCallRoutingDb) => routingData.push({
        ...item,
        id: item &&
            item.skey &&
            parseInt(item.skey.split("__")[2], 10)
      }) ) || [];
      loadDataTable(routingData);
      const result: CctSharedCallRoutingDb[] = await retrieveRoutingData(accessToken, graphQlApiUrl,firstChunkData);
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
  };

  const handleSearchDDChange = (event: any) => {
    const name = event.target.name;
    var value = event.target.value;
    if(name === "id"){
      value = parseInt(event.target.value);
    }
    setState(
      {
        ...state,
        advanceFilter: {
          ...state.advanceFilter,
          [name]: value
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
          if(key == "id" && item && item[key]){
            const itemId = item?.id.toLocaleString().toString().replace(",","");
            const advanceKey = advanceFilter[key].toString().replace(",","");
            if (itemId.includes(advanceKey)) {
              matched += 1;
            }
          }
          else if (item[key] === advanceFilter[key]) {
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
        isAdvanceSearchOpen={state.isAdvanceSearchModalOpen}
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
