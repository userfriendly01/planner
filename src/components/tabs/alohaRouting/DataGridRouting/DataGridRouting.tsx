import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { RoutingGridColumnDef } from "./GridColumnDef"
import { CctSharedCallRoutingGlobalDb, RoutingFilter, RoutingMasterData } from "../AlohaRouting.Interfaces";
import { retrieveRoutingData } from "services";
import { CACHED_CALL_ROUTING_PER_PAGE, CACHE_FILTER_ROUTING, getAccessToken, routingInitState } from "utils";
import { getGridMasterData } from "./GridMaster";

export const DataGridRouting = () => {
    const accessToken: string = getAccessToken();
    const [state, setState] = useState(routingInitState);

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
            console.log('filterRecords>', advanceFilteredArray);

            setState({ ...state, filteredItems: advanceFilteredArray });
        } else {
            setState({ ...state, filteredItems: result });
        }
    }

    const loadDataTable = async () => {
        const result: CctSharedCallRoutingGlobalDb[] = await retrieveRoutingData(accessToken);
        if (result.length > 0) {
            const sortedResult = result.sort(((a, b) => a.id - b.id));
            const minId = sortedResult[0].id;
            const maxId = sortedResult[result.length - 1].id;
            setState({
                ...state,
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
            setState({ ...state, masterData });
        } else {
            setState({
                ...state,
                data: result,
                filteredItems: result,
                fetching: false,
            });
            // this.showToastMessage('error', 'Error in retriving Routing Rule. Please check the API Key ');
        }
    }
    const setPerPage = (newPageSize: number) => {
        sessionStorage.setItem(CACHED_CALL_ROUTING_PER_PAGE, newPageSize.toString());
        setState({ ...state, perPage: newPageSize });
    }

    useEffect(() => {
        loadDataTable();
    })

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={state.filteredItems}
                columns={RoutingGridColumnDef}
                pageSize={5}
                onPageSizeChange={(newPageSize: number) => setPerPage(newPageSize)}
                rowsPerPageOptions={[10, 20, 50, 100]}
            />
        </div>
    )
}