import { apolloClient } from "components";
import {
  CREATE_USER,
  UMUser
}from "globals";
import {
  mapWorkerFromDbWorker, mapWorkerToDbWorker
} from "utils";

export const createUser = async (worker: Partial<UMUser>): Promise<UMUser> => {
  const {
    errors, data
  }  = await apolloClient.mutate<{ user: UMUser }>({
    mutation: CREATE_USER,
    variables: {
      input: mapWorkerToDbWorker(worker)
    }
  });

  if (errors?.length) {
    throw errors;
  }

  return mapWorkerFromDbWorker(data.user);
};
