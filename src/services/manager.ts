import { apolloClient } from "../components/core/Auth/SharedGraphAPIProvider";
import {
  Action,
  CREATE_MANAGER,
  DBList,
  DELETE_MANAGER,
  UMManager,
  UPDATE_MANAGER
}from "globals";
import {
  getPaginatedResults,
  logger
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
    logger.error("Failed to fetch managers from graph", { error });
    throw ({
      error,
      msg: "Failed to fetch managers from graph"
    });
  }
};

export const addManager = async (manager: Partial<UMManager>) => {
  const {
    errors, data
  }  = await apolloClient.mutate<{ manager: UMManager }>({
    mutation: CREATE_MANAGER,
    variables: {
      input: manager
    }
  });

  if (errors?.length) {
    logger.error("Failed to add manager from graph", { errors } );
    throw errors;
  }

  return data.manager;
};

export const editManager = async (n_number: string, manager: Partial<UMManager>) => {
  const {
    errors
  }  = await apolloClient.mutate<{ manager: UMManager }>({
    mutation: UPDATE_MANAGER,
    variables: {
      n_number,
      input: manager
    }
  });

  if (errors?.length) {
    logger.error("Failed to edit manager from graph", { errors } );
    throw errors;
  }

  return;
};

export const deleteManager = async (n_number: string) => {
  const {
    errors
  }  = await apolloClient.mutate<{ manager: UMManager }>({
    mutation: DELETE_MANAGER,
    variables: {
      n_number
    }
  });

  if (errors?.length) {
    logger.error("Failed to delete manager from graph", { errors } );
    throw errors;
  }

  return;
};