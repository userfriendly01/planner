import { apolloClient } from "components";
import {
  Action,
  CREATE_USER,
  DBList,
  GET_USER,
  LIST_USERS,
  UMUser,
  UPDATE_USER
}from "globals";
import {
  getPaginatedResults,
  logger,
  mapWorkerFromDbWorker,
  mapWorkerToDbWorker
} from "utils";

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
    payload: true
  }));

  const formatUsers = (users: UMUser[]) => {
    const newUsers = [] as UMUser[];
    users.forEach(user => {
      if (!user?.inactiveDate && !user?.ttl && user?.attributes) {
        newUsers.push(
          mapWorkerFromDbWorker({
            ...user,
            isConsole: false // user.pk.includes("Console")
          })
        );
      }
    });
    return newUsers;
  };

  try {
    await getPaginatedResults("UMUser", dispatch, formatUsers);

    dispatch(({
      type: "setLoadingWorkers",
      payload: false
    }));

    return;
  } catch(error) {
    logger.error("Failed to fetch users from graph", { error });

    throw ({
      msg: "Failed to fetch users from graph"
    });
  }
};

export const getUser = async (identifier: string): Promise<UMUser> => {
  const {
    errors, data
  }  = await apolloClient.query<{ user: UMUser }>({
    query: GET_USER,
    variables: {
      identifier
    }
  });

  if (errors?.length) {
    throw errors;
  }

  return data.user;
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
    throw errors;
  }

  return mapWorkerFromDbWorker(data.user);
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
    throw errors;
  }

  return mapWorkerFromDbWorker(data.user);
};
