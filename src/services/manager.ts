import { apolloClient } from "components";
import {
  Action,
  CREATE_USER,
  DBList,
  GET_USER,
  LIST_MANAGERS,
  LIST_USERS,
  UMManager,
  UPDATE_USER
}from "globals";
import {
  getPaginatedResults,
  logger,
  mapWorkerFromDbWorker,
  mapWorkerToDbWorker,
  formatManagersResponse
} from "utils";

/**
 * This helper function gets all the managers using pagination. If there's a next token, it will
 * concatenate all the managers
 * 
 * @param dispatch - AppState Dispatch function
 * @returns - The first query's promise
 */

export const listUMManagers = async (dispatch: (action: Action) => void): Promise<DBList<UMManager>> => {
  try {
    await getPaginatedResults("UMManager", dispatch);
    return;
  } catch(error) {
    logger.error("Failed to fetch offices from graph", { error });
    throw ({
      msg: "Failed to fetch offices from graph"
    });
  }
};

export const addManager = async (manager: Partial<UMManager>) => {
  console.log("dummy");
};

export const editManager = async (nNumber: string, manager: Partial<UMManager>) => {
  console.log("dummy");
};

export const deleteManager = async (nNumber: string) => {
  console.log("dummy");
};