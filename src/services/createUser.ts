import { apolloClient } from "components";
import {
  CREATE_USER,
  UMUser
}from "globals";
import { mapWorkerToDbWorker } from "utils";

export const createUser = async (worker: Partial<UMUser>): Promise<UMUser> => {
  const {
    data, error
  } = await apolloClient.query<{ user: UMUser }>({
    query: CREATE_USER,
    variables: {
      jj: "te",
      input: mapWorkerToDbWorker(worker)
    }
  });

  if (error) {
    throw error;
  }

  return data.user;
};
