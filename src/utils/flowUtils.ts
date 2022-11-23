import { useAdminState } from "context";
import { FlowDropDownList } from "components/tabs/alohaFlow/AlohaFlow.Interfaces";

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
export const CACHE_FILTER_FLOW = "SEARCH_FILTER_FLOW";
export const FLOW_MASTER_DATA = "FLOW_MASTER_DATA";
export const languageOffer = ["English", "Spanish"];
export const userDestination = ["Avaya", "Twilio"];
