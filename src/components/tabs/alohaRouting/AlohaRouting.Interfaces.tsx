export interface CctSharedCallRoutingGlobalDb {
    id: number;
    all?: String;
    brand?: String;
    callIntent?: String;
    callerState?: String;
    callerType?: String;
    channel?: String;
    dayOfWeek?: String;
    endTime?: String;
    percentOfCallers?: String;
    pkey: String;
    policyType?: String;
    skey: String;
    startTime?: String;
    transferDestination?: String;
    transferMessage?: String;
    twilioSkill?: String;
    crcSkill?: String;
}
export interface RoutingMasterData {
    channel?: Array<string>;
    brand?: Array<string>;
    callerType?: Array<string>;
    callerState?: Array<string>;
    callIntent?: Array<string>;
    policyType?: Array<string>;
    transferDestination?: Array<string>;
    twilioSkill?: Array<string>;
}

export interface RoutingFilter {
    channel?: string;
    brand?: string;
    callerType?: string;
    callerState?: string;
    callIntent?: string;
    policyType?: string;
    transferDestination?: string;
    twilioSkill?: string;
}

export interface RoutingInitState {
    data?: Array<CctSharedCallRoutingGlobalDb>;
    filteredItems?: Array<CctSharedCallRoutingGlobalDb>;
    advanceFilter?: RoutingFilter;
    fetching?: boolean;
    selectedRow?: undefined;
    isEditModalOpen?: boolean;
    isAddModalOpen?: boolean;
    isAdvanceSearchModalOpen?: boolean;
    idStart?: number;
    idEnd?: number;
    maxId?: number;
    minId?: number;
    saveSuccess?: boolean;
    page?: number;
    perPage?: number;
    masterData? : RoutingMasterData;
}