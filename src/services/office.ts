import {
  CREATE_OFFICE, GET_OFFICE
} from "globals/graphql";
import {
  UMOffice
}from "globals/interfaces";
import { logger } from "utils/logger";
import { apolloClient } from "../components/core/Auth/SharedGraphAPIProvider";

export const getOffice = async (office_num: string): Promise<UMOffice> => {
  try {
    const { data }  = await apolloClient.query<{ office: UMOffice }>({
      query: GET_OFFICE,
      variables: {
        office_num
      }
    });

    return data.office;
  } catch(error) {
    logger.error("Failed to fetch offices from graph", { error });
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


