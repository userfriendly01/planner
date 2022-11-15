import React, { useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { RoutingGridColumnDef } from "./GridColumnDef"
import { CctSharedCallRoutingGlobalDb, RoutingFilter, RoutingInitState, RoutingMasterData } from "../AlohaRouting.Interfaces";
import { retrieveRoutingData } from "services";
import { CACHED_CALL_ROUTING_PAGE_NO, CACHED_CALL_ROUTING_PER_PAGE, CACHE_FILTER_ROUTING, getAccessToken, routingInitState } from "utils";
import { getGridMasterData } from "./GridMaster";
import { RoutingTableBox } from "../AlohaRouting.Styles";
import GridSpinner from "./GridSpinner";

export const DataGridRouting = () => {
    const accessToken: string = getAccessToken();
    const reducer = (state: RoutingInitState, updatedState: RoutingInitState): RoutingInitState => {
        return { ...state, ...updatedState }
    }
    const [state, dispatch] = React.useReducer(reducer, routingInitState);

    const getAdvanceFilter = (): RoutingFilter => {
        try {
            const cachedFilter: string = localStorage.getItem(CACHE_FILTER_ROUTING);
            const advanceFilter: RoutingFilter = JSON.parse(cachedFilter);
            Object.keys(advanceFilter).forEach((key: keyof RoutingFilter) => {
                if (advanceFilter[key] === '') {
                    delete advanceFilter[key];
                }
            });
            return advanceFilter;
        } catch (e) {
            console.log(e);
        }
        return {};
    }

    const filterRecords = () => {
        const {
            data, idStart, idEnd,
        } = state;
        const result: CctSharedCallRoutingGlobalDb[] = data.filter((item) => item.id >= idStart && item.id <= idEnd);
        const advanceFilter: RoutingFilter = getAdvanceFilter();
        const advanceFilterLength: number = Object.keys(advanceFilter).length;
        if (advanceFilterLength > 0) {
            const advanceFilteredArray: Array<CctSharedCallRoutingGlobalDb> = [];
            result.forEach((item) => {
                let matched: number = 0;
                Object.keys(advanceFilter).forEach((key: keyof RoutingFilter) => {
                    if (item[key] === advanceFilter[key]) {
                        matched += 1;
                    }
                });
                if (advanceFilterLength === matched) {
                    advanceFilteredArray.push(item);
                }
            });
            console.log('filterRecords>', advanceFilteredArray);

            dispatch({ filteredItems: advanceFilteredArray });
        } else {
            dispatch({ filteredItems: result });
        }
    }

    const loadDataTable = async () => {
        const result: CctSharedCallRoutingGlobalDb[] = await retrieveRoutingData(accessToken);
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
                minId,
            });
            const masterData: RoutingMasterData = getGridMasterData(result);
            const advanceFilter: RoutingFilter = getAdvanceFilter();
            const advanceFilterLength: number = Object.keys(advanceFilter).length;
            if (advanceFilterLength > 0) {
                filterRecords();
            }
            dispatch({ masterData });
        } else {
            dispatch({
                data: result,
                filteredItems: result,
                fetching: false,
            });
            // this.showToastMessage('error', 'Error in retriving Routing Rule. Please check the API Key ');
        }
    }
    const setPerPage = (newPageSize: number) => {
        sessionStorage.setItem(CACHED_CALL_ROUTING_PER_PAGE, newPageSize.toString());
        dispatch({ perPage: newPageSize });
    }

    const setPage = (newPage: number) => {
        sessionStorage.setItem(CACHED_CALL_ROUTING_PAGE_NO, newPage.toString());
        dispatch({ page: newPage });
    }

    useEffect(() => {
        loadDataTable().then(() => {
            console.log("Data Table:", state.filteredItems);
        });
    }, [dispatch])

    return (
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
                    '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 600
                    }
                }}
            />
        </RoutingTableBox>
    )
}