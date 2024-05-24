import { apolloClient } from "components";
import {
  Action,
  CREATE_USER,
  DBList,
  GET_USER,
  LIST_MANAGERS,
  LIST_OFFICES,
  LIST_USERS,
  UMOffice,
  UMManager,
  UMUser,
  UPDATE_USER,
  GraphData
}from "globals";
import {
  listUMManagers, listUMOffices, listUMUsers
} from "services";
import {
  logger,
  mapWorkerFromDbWorker,
  mapWorkerToDbWorker
} from "utils";

type PaginationType = UMOffice | UMManager | UMUser;

const getGraphData = (type: string) => {
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

export const getPaginatedResults = async (type: string, dispatch: (action: Action) => void, formatResults?: (items: PaginationType[]) => PaginationType[]): Promise<void> => {

  const getPageResults = async (nextToken?: string): Promise<VoidFunction> => {
    try {
      const graph: GraphData = getGraphData(type);
      // const response: DBList<PaginationType> = await listQuery(nextToken);

      const { data }: any  = await apolloClient.query<{ results: DBList<PaginationType | null> }>({
        query: graph.query,
        variables: {
          nextToken
        }
      });

      console.log("Faith! what does the paginated response look like", data);
      const items = data[graph.responsePath].items;
      const formattedData = formatResults ? formatResults(items) : items;

      dispatch(({
        type: `load${type}s`,
        payload: formattedData
      }));

      if(data[graph.responsePath].nextToken){
        return getPageResults(data[graph.responsePath].nextToken);
      } else {
        return;
      }
    } catch(error) {
      logger.error(`Error thrown getting paginated results for ${type}`, error);
      return Promise.reject(error);
    }
  };

  getPageResults();

  return;
};