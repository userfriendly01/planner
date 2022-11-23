import { useAdminState } from "context";
import { FlowDropDownList } from "components/tabs/alohaFlow/AlohaFlow.Interfaces";

export const FLOW_MASTER_DATA = "FLOW_MASTER_DATA";
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

export const flowDropDownList: FlowDropDownList = {
    "brand": [],
    "languageOffer": [],
    "channel": [],
    "userDestination": []
}
