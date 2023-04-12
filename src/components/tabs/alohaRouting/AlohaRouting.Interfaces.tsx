import { Control } from "globals";
import { MultiFieldContainerFormProps } from "components/core/SharedComponents/MultiFieldContainer";

interface RoutingOccupancyCheck {
    team: string;
    percentage: number;
  }
  interface RoutingStep {
    team: string;
    time: number;
  }
export interface CctSharedCallRoutingDb {
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
    priority?: string;
    occupancyCheck?: Array<RoutingOccupancyCheck>;
    routingSteps?: Array<RoutingStep>;
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

export interface RoutingStateVariables {
    advanceFilter?: RoutingFilter;
    data?: Array<CctSharedCallRoutingDb>;
    fetching?: boolean;
    filteredItems?: Array<CctSharedCallRoutingDb>;
    idEnd?: number;
    idStart?: number;
    isAddModalOpen?: boolean;
    isAdvanceSearchModalOpen?: boolean;
    isEditModalOpen?: boolean;
    masterData?: RoutingMasterData;
    maxId?: number;
    minId?: number;
    page?: number;
    perPage?: number;
    saveSuccess?: boolean;
    selectedRow?: CctSharedCallRoutingDb;
}

export interface RoutingDropDownList {
    brand?: string[];
    language?: string[];
    dayOfWeek?: string[];
    channel?: string[];
    policyType?: string[];
    priority?: string[];
}

export interface AddPageFieldConfigProps {
    label: string,
    key: string,
    control: Control,
    required?: boolean,
    disableAdd?: boolean,
    disableEdit?: boolean,
    isBlankFirstValue?: boolean
    valueGetter?: (params: CctSharedCallRoutingDb, defaultValue?: any) => any;
    valueSetter?: (currentValue: CctSharedCallRoutingDb, newValue: any) => CctSharedCallRoutingDb;
    formFields?: Array<MultiFieldContainerFormProps>
}
export interface AddRoutingModalProps {
    isOpen: boolean;
    newId: number;
    openModal: (flag: boolean, row?: CctSharedCallRoutingDb) => void;
}