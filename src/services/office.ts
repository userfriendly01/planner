import {
  getPaginatedResults, logger
} from "utils";
import {
  Action,
  CREATE_OFFICE,
  DBList,
  UMOffice
}from "globals";
import { apolloClient } from "../components/core/Auth/SharedGraphAPIProvider";

export const listUMOffices = async (dispatch: (action: Action) => void): Promise<DBList<UMOffice>> => {
  try {
    await getPaginatedResults("UMOffice", dispatch);
    return;
  } catch(error) {
    logger.error("Failed to fetch offices from graph", { error });
    throw ({
      msg: "Failed to fetch offices from graph"
    });
  }
};

export const addOffice = async (office: Partial<UMOffice>): Promise<UMOffice> => {
  const {
    errors, data
  }  = await apolloClient.mutate<{ office: UMOffice }>({
    mutation: CREATE_OFFICE,
    variables: {
      input: office
    }
  });

  if (errors?.length) {
    throw errors;
  }

  return data?.office;
};


