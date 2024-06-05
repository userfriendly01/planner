import { apolloClient } from "../components/core/Auth/SharedGraphAPIProvider";
import {
  Action,
  DBList,
  UMOffice,
  UMManager,
  UMUser,
  GraphData
}from "globals/interfaces";
import {
  LIST_MANAGERS,
  LIST_OFFICES,
  LIST_USERS
}from "globals/graphql";
import {
  logger
} from "utils/logger";

type PaginationType = UMOffice | UMManager | UMUser;

export const getGraphData = (type: string) => {
  switch (type) {
    case "UMUser":
      return LIST_USERS;
    case "UMManager":
      return LIST_MANAGERS;
    case "UMOffice":
      return LIST_OFFICES;
    default:
      throw `Type of ${type} is not a valid list type`;
  }
};

export const getPaginatedResults = async (type: string, dispatch: (action: Action) => void, formatResults?: (items: PaginationType[]) => PaginationType[], callBack?: VoidFunction): Promise<void> => {
  const graph: GraphData = getGraphData(type);

  const getPageResults = async (nextToken?: string): Promise<VoidFunction> => {
    try {
      const { data }: any  = await apolloClient.query<{ results: DBList<PaginationType | null> }>({
        query: graph.query,
        variables: {
          nextToken
        }
      });

      const items = data[graph.responsePath]?.items;
      const formattedData = formatResults ? formatResults(items) : items;

      dispatch(({
        type: "loadPaginatedResults",
        payload: {
          type,
          results: formattedData
        }
      }));

      if(data[graph.responsePath]?.nextToken){
        return getPageResults(data[graph.responsePath]?.nextToken);
      } else {
        if(callBack) {
          callBack();
        }
        return;
      }
    } catch(error) {
      logger.error(`Error thrown getting paginated results for ${type}`, error);
      return Promise.reject(error);
    }
  };

  await getPageResults();

  return;
};