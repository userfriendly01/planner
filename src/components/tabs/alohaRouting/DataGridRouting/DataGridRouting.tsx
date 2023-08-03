import {
  AddPageFieldConfigProps,
  CctSharedCallRoutingDb,
  PreviewModalAction,
  RoutingFilter,
  RoutingMasterData,
  RoutingStateVariables
} from "../AlohaRouting.Interfaces";
import {
  AddRouting,
  CustomRoutingGridToolBar,
  EditRouting,
  RoutingAdvanceSearch
} from "../RoutingCustomActions";
import {
  AlertBarProps,
  FormValidationRule
} from "utils/interfaces";
import {
  CACHED_CALL_ROUTING_PAGE_NO,
  CACHED_CALL_ROUTING_PER_PAGE,
  CACHE_FILTER_ROUTING,
  EXPORT_FILE_PREFIX,
  downloadCSV,
  getGraphQLEndpoint,
  initializedAlertBar,
  routingFields,
  routingInitRule,
  routingInitState
} from "utils";
import {
  DataGrid,
  GridCallbackDetails,
  GridPaginationModel,
  GridRenderCellParams
} from "@mui/x-data-grid";
import React, {
  useEffect,
  useRef,
  useState
} from "react";
import {
  queryRoutingData,
  retrieveRoutingData
} from "services";
import { AzureSPA } from "globals";
import { CustomToast } from "components";
import { PreviewModal } from "../PreviewModal";
import { RoutingGridColumnDef } from "./GridColumnDef";
import { RoutingTableBox } from "../AlohaRouting.Styles";
import { getGridMasterData } from "./GridMaster";

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
    let value = event.target.value;
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
          if(key === "id" && item && item[key]){
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
        advanceFilter,
        data: result,
        fetching: false,
        filteredItems,
        idEnd: maxId,
        idStart: minId,
        isAddModalOpen: false,
        isAdvanceSearchModalOpen: false,
        isBulkEditModalOpen: false,
        isEditModalOpen: false,
        isPreviewModalOpen: false,
        masterData,
        maxId: maxId,
        minId: minId,
        saveSuccess: false
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
        isBulkEditModalOpen: false,
        isAdvanceSearchModalOpen: false
      });
    }
  };

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: sessionStorage.getItem(CACHED_CALL_ROUTING_PER_PAGE) ? +sessionStorage.getItem(CACHED_CALL_ROUTING_PER_PAGE) : 10,
    page: sessionStorage.getItem(CACHED_CALL_ROUTING_PAGE_NO) ? +sessionStorage.getItem(CACHED_CALL_ROUTING_PAGE_NO) : 1
  });

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
    row.skey = skey.split(" ").join("").toLocaleLowerCase();
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

  const openBulkEditModal = (flag: boolean) =>{
    setState((dataFlowProps: RoutingStateVariables) => ({
      ...dataFlowProps,
      isBulkEditModalOpen: flag
    }));
  };

  const openEditModal = (flag: boolean, isSubmitted?: boolean, rows?: CctSharedCallRoutingDb[], message?: string, deleteRow?: boolean,type?: boolean) => {
    let newData;
    if(type){
      cloneRule(flag,rows && rows[0]);
    }
    else if (!flag && isSubmitted) {
      const rowIds = rows.map(x => x.id);
      newData = state.data.filter(x=> !rowIds.includes(x.id));
      if(!deleteRow) {
        newData.concat(rows);
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
      selectedRow: rows[0]
    }));
  };

  const openPreviewModal = (flag: boolean, action: PreviewModalAction) =>{
    setState((dataFlowProps: RoutingStateVariables) => ({
      ...dataFlowProps,
      isPreviewModalOpen: flag,
      previewModalAction: action
    }));
  };

  const exportDataFile = () =>{
    downloadCSV(EXPORT_FILE_PREFIX.ROUTING, state.filteredItems);
  };

  const handlePreviewModalOnClose = () =>{
    setState((dataFlowProps: RoutingStateVariables) => ({
      ...dataFlowProps,
      isPreviewModalOpen: false
    }));
  };

  const handleOnBulkCreate = (rows: Array<CctSharedCallRoutingDb> ) =>{
    console.log("Bulk Create: ", rows);
  };

  const handleOnBulkUpdate = (rows: Array<CctSharedCallRoutingDb> ) =>{
    console.log("Bulk Update: ", rows);
  };

  const handleOnBulkDelete = (rows: Array<CctSharedCallRoutingDb> ) =>{
    console.log("Bulk Delete: ", rows);
  };

  RoutingGridColumnDef[0].renderCell = (params: GridRenderCellParams<CctSharedCallRoutingDb>) => (<a href="#" onClick={() => openEditModal(true, false, [params.row])}>{`${params.value}`}</a>);

  const handlePaginationModelChange = (model: GridPaginationModel, details:GridCallbackDetails<any>) =>{
    sessionStorage.setItem(CACHED_CALL_ROUTING_PAGE_NO, model.page.toString());
    sessionStorage.setItem(CACHED_CALL_ROUTING_PER_PAGE, model.pageSize.toString());
    setPaginationModel(model);
  };

  return (
    <div>
      <CustomRoutingGridToolBar
        applyFilter={applyFilter}
        exportDataFile={exportDataFile}
        isAdvanceSearchOpen={state.isAdvanceSearchModalOpen}
        openAddModal={openAddModal}
        openAdvanceSearchModal={openAdvanceSearchModal}
        openEditModal={openBulkEditModal}
        openPreviewModal={openPreviewModal}
      />
      <RoutingTableBox>
        <DataGrid
          autoHeight
          checkboxSelection
          columns={RoutingGridColumnDef}
          disableRowSelectionOnClick
          getRowId={(row: CctSharedCallRoutingDb)=>row.id}
          loading={state.fetching}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[10, 20, 50, 100]}
          pagination
          paginationMode="client"
          paginationModel={paginationModel}
          rows={state.filteredItems}
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
      <PreviewModal
        accessToken={accessToken}
        action={state.previewModalAction}
        isOpen={state.isPreviewModalOpen}
        onClose={handlePreviewModalOnClose}
        onCreate={handleOnBulkCreate}
        onDelete={handleOnBulkDelete}
        onUpdate={handleOnBulkUpdate}
        rows={state.filteredItems}
      />
    </div>
  );
};
