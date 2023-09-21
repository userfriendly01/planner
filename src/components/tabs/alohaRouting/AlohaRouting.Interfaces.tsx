import { Control } from "globals";
import { MultiFieldContainerFormProps } from "components/core/SharedComponents/MultiFieldContainer";
import { FormValidationRule } from "utils/interfaces";

export type PreviewModalAction = "add" | "edit" | "delete"
export interface RoutingOccupancyCheck {
    team: string;
    percentage: number;
  }
export interface RoutingStep {
    callerState: string;
    teams: Array<string>;
    time: number;
  }

export interface CctSharedCallRoutingDb {
    id?: number;
    all?: string;
    brand?: string;
    callIntent?: string;
    callerState?: string;
    callerType?: string;
    channel?: string;
    dayOfWeek?: string;
    endTime?: string;
    percentOfCallers?: string;
    pkey?: string;
    policyType?: string;
    skey?: string;
    startTime?: string;
    transferDestination?: string;
    transferMessage?: string;
    twilioSkill?: string;
    crcSkill?: string;
    priority?: string;
    occupancyCheck?: Array<RoutingOccupancyCheck>;
    routingSteps?: Array<RoutingStep>;
    alternateTransferDestination?: string;
}
export interface RoutingMasterData {
    channel?: Array<string>;
    brand?: Array<string>;
    callerType?: Array<string>;
    callerState?: Array<string>;
    callIntent?: Array<string>;
    policyType?: Array<string>;
    priority?: Array<string>;
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
    id?: number;
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
    isBulkEditModalOpen?: boolean;
    isPreviewModalOpen?: boolean;
    masterData?: RoutingMasterData;
    maxId?: number;
    minId?: number;
    previewModalAction?: PreviewModalAction;
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
    callerState?: string[];
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
    dynamicFieldConditionCheck?: (params: FormValidationRule) => boolean;
}
export interface AddRoutingModalProps {
    isOpen: boolean;
    newId: number;
    openModal: (flag: boolean, addCloneRule?: boolean, row?: CctSharedCallRoutingDb) => void;
    cloneRouteRule?: boolean;
    routeRule?: FormValidationRule;
}

export interface AutocompleteOptions {
    id: string;
    label: string;
}
