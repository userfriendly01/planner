import { useAdminState } from "../context"

/**
 *  This function return graphQL endpoint based on running environment  
 * @returns string: GraphQL Endpoint
 */
export const getGraphQLEndpoint = (): string => {
    const env: string = useAdminState().userContext.pingIdentity.environment;
    return {
        "development": "https://2yooyvouuzeq7evpxtv5ojad3m.appsync-api.us-east-1.amazonaws.com/graphql",
        "test": "TBD",
        "prod": "TBD"
    }[env];

};

