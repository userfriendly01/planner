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
export const getAllUsers = async (dispatch: (action: Action) => void): Promise<UMUser[]> => {
  dispatch(({
    type: "setLoadingWorkers",
    payload: true
  }));

  let nextToken = "start";
  const firstQuery = new Promise((resolve: (users: UMUser[]) => void, reject) => {
    const getUsers = async () => {
      while (nextToken) {
        try {
          const isFirstQuery = nextToken === "start";
          const response = await listUsers(isFirstQuery ? undefined : nextToken);

          if (isFirstQuery) {
            dispatch(({
              type: "loadWorkers",
              payload: response.items
            }));

            resolve(response.items);
          } else {
            dispatch(({
              type: "addWorkers",
              payload: response.items
            }));
          }

          ({ nextToken } = response);
        } catch(error) {
          return reject(error);
        }
      }

      dispatch(({
        type: "setLoadingWorkers",
        payload: false
      }));
    };

    getUsers();
  });

  return firstQuery;
};

export const listUsers = async (nextToken?: string): Promise<DBList<UMUser>> => {
  try {
    const { data }  = await apolloClient.query<{ users: DBList<UMUser | null> }>({
      query: LIST_USERS,
      variables: {
        nextToken
      }
    });

    const newUsers = [] as UMUser[];
    data.users.items.forEach(user => {
      if (!user?.inactiveDate && !user?.ttl && user?.attributes) {
        newUsers.push(
          mapWorkerFromDbWorker({
            ...user,
            isConsole: false // user.pk.includes("Console")
          })
        );
      }
    });

    return {
      items: newUsers,
      nextToken: data.users.nextToken
    };
  } catch(error) {
    logger.error("Failed to fetch workers from service", { error });

    throw ({
      msg: "Failed to fetch workers from service"
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
