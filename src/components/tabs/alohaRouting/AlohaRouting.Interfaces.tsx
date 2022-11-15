export interface CctSharedCallRoutingGlobalDb {
    id: number;
    all?: string;
    brand?: string;
    callIntent?: string;
    callerState?: string;
    callerType?: string;
    channel?: string;
    dayOfWeek?: string;
    endTime?: string;
    percentOfCallers?: string;
    pkey: string;
    policyType?: string;
    skey: string;
    startTime?: string;
    transferDestination?: string;
    transferMessage?: string;
    twilioSkill?: string;
    crcSkill?: string;
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
    masterData?: RoutingMasterData;
}
