import { RoutingInitState, RoutingDropDownList, AddPageFieldConfigProps as AddRoutingFieldConfigProps, RoutingInitRule } from "../components/tabs/alohaRouting/AlohaRouting.Interfaces";

export const ROUTING_CACHE_MASTER_DATA = "ROUTING_MASTER_DATA";

export const CACHE_FILTER_ROUTING = "SEARCH_FILTER_ROUTING";

export const CACHED_CALL_ROUTING_PAGE_NO = "CALL_ROUTING_PAGE_NO";

export const CACHED_CALL_ROUTING_PER_PAGE = "CALL_ROUTING_PER_PAGE";


export const numbersOnlyFields: string[] = ["percentOfCallers"];

export const emptyInitFields: string[] = ["transferMessage", "twilioSkill", "dayOfWeek", "transferDestination"];

export const dayOfWeek: string[] = ["ALL", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY", "WEEKDAY", "WEEKEND", "HOLIDAY"];


export const routingDropDownList: RoutingDropDownList = {
    brand: [],
    language: [],
    dayOfWeek,
    channel: [],
    policyType: []
}

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

export const routeFields: AddRoutingFieldConfigProps[] = [
    {
        label: "ID",
        key: "id",
        control: "input",
        required: true
    },
    {
        label: "Partition Key",
        key: "pkey",
        control: "input",
        disableEdit: true

    },
    {
        label: "Sort Key",
        key: "skey",
        control: "input",
        disableEdit: true
    },
    {
        label: "Brand",
        key: "brand",
        control: "select",
        required: true
    },
    {
        label: "Caller State",
        key: "callerState",
        control: "input",
        required: true
    },
    {
        label: "Caller Type",
        key: "callerType",
        control: "input",
        required: true
    },
    {
        label: "Call Intent",
        key: "callIntent",
        control: "input",
        required: true
    },
    {
        label: "Channel",
        key: "channel",
        control: "select",
        required: true
    },
    {
        label: "Day Of Week",
        key: "dayOfWeek",
        control: "select",
        required: true
    },
    {
        label: "Transfer Destination",
        key: "transferDestination",
        control: "input"
    },
    {
        label: "Twilio Skill",
        key: "twilioSkill",
        control: "input"
    },
    {
        label: "CRC Skill",
        key: "crcSkill",
        control: "input"
    },
    {
        label: "Percent Of Callers",
        key: "percentOfCallers",
        control: "input",
        required: true
    },
    {
        label: "Start Time - EST",
        key: "startTime",
        control: "timePicker",
        required: true
    },
    {
        label: "End Time",
        key: "endTime",
        control: "timePicker",
        required: true
    },
    {
        label: "Policy Type",
        key: "policyType",
        control: "select",
        required: true
    },
    {
        label: "Transfer Message",
        key: "transferMessage",
        control: "input"
    },
];



export const routingInitRule: RoutingInitRule = routeFields.reduce((a: RoutingInitRule, v: AddRoutingFieldConfigProps) => ({ ...a, [v.key]: { error: false, value: '', required: v.required || false } }), {});

