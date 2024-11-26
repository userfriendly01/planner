import { apolloClient } from "../components/core/Auth/SharedGraphAPIProvider";
import {
  Action,
  DBList,
  LoadStatuses,
  UMUser
}from "globals/interfaces";
import {
  CREATE_USER,
  GET_USER,
  LIST_INACTIVE_USERS,
  LIST_USER_RECORDS,
  UPDATE_USER
}from "globals/user";
import {
  getPaginatedResults,
  mapWorkerFromDbWorker,
  mapWorkerToDbWorker
} from "utils/graphUtils";
import {
  sortGraphObjectsByPk
} from "utils/_sortUtils";
import { logger } from "utils/logger";
import { formatUsers } from "utils/usermanagementUtils";

/**
 * This helper function gets all the workers, which now that they are paginated, takes a little bit
 * of time. This returns a promise for the first network call, allowing an array of roughly ~700 workers
 * to be used in the application.
 * 
 * @param dispatch - AppState Dispatch function
 * @returns - The first query's promise
 */

export const listUMUsers = async (dispatch: (action: Action) => void): Promise<DBList<UMUser>> => {
  dispatch(({
    type: "setLoadingWorkers",
    payload: LoadStatuses.LOADING
  }));

  try {
    await getPaginatedResults(LIST_INACTIVE_USERS.type, dispatch, { users: formatUsers });
    dispatch(({
      type: "setLoadingWorkers",
      payload: LoadStatuses.SUCCESS
    }));
  } catch(error) {
    logger.error("Failed to fetch users from graph", { error });
    dispatch(({
      type: "setLoadingWorkers",
      payload: LoadStatuses.FAIL
    }));
  }
  return;
};

export const listInactiveUMUsers = async (dispatch: (action: Action) => void): Promise<UMUser[]> => {
  try {
    const results = await getPaginatedResults(LIST_INACTIVE_USERS.type, dispatch, { users: formatUsers });
    return results as unknown as UMUser[];
  } catch(error) {
    logger.error("Failed to fetch inactive users from graph", { error });
  }
  return;
};

export const listUMUserRecords = async (n_number: string): Promise<UMUser[]> => {

  const {
    errors, data
  }: any = await apolloClient.query<{ results: DBList<UMUser | null> }>({
    query: LIST_USER_RECORDS.query,
    variables: {
      n_number
    }
  });

  if (errors?.length) {
    logger.error("Failed to fetch user records from graph", { errors });
    throw errors;
  }

  /*
  Sorting the users will allow for the primary user to be the SSO user but if they only have
  a console worker, they will work just fine
  */

  return data[LIST_USER_RECORDS.responsePaths[0]]?.items
    .filter((i: UMUser) => !i.inactiveDate)
    .sort(sortGraphObjectsByPk);
};

export const createUser = async (user: Partial<UMUser>): Promise<UMUser> => {
  const {
    errors, data
  }  = await apolloClient.mutate<{ user: UMUser }>({
    mutation: CREATE_USER,
    variables: {
      input: mapWorkerToDbWorker(user)
    }
  });

  if (errors?.length) {
    logger.error("Failed to create user from graph", { errors });
    throw errors;
  }

  return mapWorkerFromDbWorker(data.user);
};

export const updateUser = async (identifier: string, user: Partial<UMUser>): Promise<UMUser> => {
  const {
    errors, data
  }  = await apolloClient.mutate<{ user: UMUser }>({
    mutation: UPDATE_USER,
    variables: {
      identifier,
      input: mapWorkerToDbWorker(user)
    }
  });

  if (errors?.length) {
    logger.error("Failed to update user from graph", { errors });
    throw errors;
  }

  return mapWorkerFromDbWorker(data.user);
};