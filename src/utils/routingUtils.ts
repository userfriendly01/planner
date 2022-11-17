import { RoutingInitState } from "../components/tabs/alohaRouting/AlohaRouting.Interfaces";

export const ROUTING_CACHE_MASTER_DATA: string = "ROUTING_MASTER_DATA";

export const CACHE_FILTER_ROUTING: string = "SEARCH_FILTER_ROUTING";

export const CACHED_CALL_ROUTING_PAGE_NO: string = "CALL_ROUTING_PAGE_NO";

export const CACHED_CALL_ROUTING_PER_PAGE: string = "CALL_ROUTING_PER_PAGE";


export const routingInitState: RoutingInitState = {
    data: [],
    filteredItems: [],
    advanceFilter: {},
    fetching: true,
    selectedRow: undefined,
    isEditModalOpen: false,
    isAddModalOpen: false,
    isAdvanceSearchModalOpen: false,
    idStart: 0,
    idEnd: 0,
    maxId: 0,
    minId: 0,
    saveSuccess: false,
    page: sessionStorage.getItem(CACHED_CALL_ROUTING_PAGE_NO) ? +sessionStorage.getItem(CACHED_CALL_ROUTING_PAGE_NO) : 1,
    perPage: sessionStorage.getItem(CACHED_CALL_ROUTING_PER_PAGE) ? +sessionStorage.getItem(CACHED_CALL_ROUTING_PER_PAGE) : 10,
}