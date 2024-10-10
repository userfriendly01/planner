//This is interface name matches what is defined in GraphQL schema

export type ActionType = "ANNOUNCEMENT" | "CAPTURE" | "MENU" | "MENUOPTIONS" | "REDIRECT" | "TRANSFER" | "HANGUP" ;

export enum ActionTypeEnum {
  ANNOUNCEMENT = "ANNOUNCEMENT",
  CAPTURE = "CAPTURE",
  MENU = "MENU",
  MENU_OPTIONS = "MENUOPTIONS",
  MENUOPTIONS = "MENUOPTIONS",
  REDIRECT = "REDIRECT",
  TRANSFER = "TRANSFER",
  HANGUP = "HANGUP"
}

// This copies the naming from shared-graph-api.  Some places in shared-graph-api uses this name, other areas call it GraphQLDeleteRequest.
// sometimes input has an extra level of nesting, like in BatchCallFlowDeleteInput, others do not.  Should refactor shared-graph-api to
// be consistent.  Will allow more consolidation of code on the client side.
export interface CallFlowDeleteBatchInput {
  input: {
    batchDeleteInput: CallFlowDeleteInput[]
  }
}

export interface CallFlowDeleteInput {
  id: string;
  actionType?: ActionType
}

export interface BatchCallFlowDeleteResponse {
  items: CallFlowDeleteResponse[];
}

export interface CallFlowDeleteResponse {
  id: string;
}

export interface GraphQLInputVariables<InputVariables> {
  input: InputVariables;
}

export interface GraphQLLocation {
  line: number;
  column: number;
}

export interface GraphQLError {
  message: string;
  locations?: GraphQLLocation[];
  path?: string[];
  data?: any;
  errorType?: string;
  errorInfo?: string;
  extensions?: {
    classification?: string;
  };
}

export interface GraphQLResponse<GraphQLDataType> {
  hasResults: boolean;
  data: GraphQLDataType | null;
  errors: GraphQLError[];
}