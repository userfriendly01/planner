import {
  DynamicCallFlowItem,
  DBExclusiveProps,
  GraphQLExclusivePhoneNumberProps,
  GraphQLExclusiveProps,
  ACTION_TYPE,
  TYPENAME,
  TYPE
} from "./DynamicIndex";

export enum BRAND {
  LIBERTY_MUTUAL = "Liberty Mutual",
  SAFECO = "Safeco",
  COMPARION = "Comparion",
}

export enum PHONE_NUMBER_TYPE {
  TFN = "TFN",
  DID = "DID",
}

export enum CALL_FLOW_TYPE {
  DTMF = "DTMF",
  SELF_SERVICE = "SELFSERVICE",
}

export enum CHANNEL {
  SALES = "Sales",
  SERVICE = "Service",
  CLAIMS = "Claims",
}

export enum LANGUAGE {
  ENGLISH = "English",
  SPANISH = "Spanish",
}

type PhoneNumberItem = DynamicCallFlowItem & {
  nextActionType: ACTION_TYPE;
  nextActionId: string;
  callFlowTemplate: string;
  dialedDescription: string;
  phoneNumberType: PHONE_NUMBER_TYPE;
  tfnRoutingGroup?: string;
  brand: BRAND;
  dataRequests?: string[];
  greetingMessages: string;
  languageOffer: LANGUAGE;
  transferDestination: string;
  callerType?: string;
  callFlowRoute?: string;
  callIntent?: string;
  callFlowType: CALL_FLOW_TYPE;
  channel: CHANNEL;
  predictiveCaller?: boolean;
  employeeId?: string;
  callTypeDescription?: string;
  internetPlacement?: string;
  lineOfBusiness?: string;
  marketingChannel?: string;
  rangeIndicator?: string;
  requestID?: string;
  tollFreeNumber?: string;
  transferCode?: string;
  whisper?: string;
  officeNumbers?: string[];
};

export type PhoneNumberDBItem = DBExclusiveProps<TYPE.PHONE_NUMBER> & PhoneNumberItem;

export type PhoneNumberGraphQLItem = GraphQLExclusiveProps<TYPENAME.PHONE_NUMBER> &
  GraphQLExclusivePhoneNumberProps &
  PhoneNumberItem;