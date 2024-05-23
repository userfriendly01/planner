export interface GraphQLVariables {
    id?: number;
}

export interface GraphQLRecord {
    id?: number;
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