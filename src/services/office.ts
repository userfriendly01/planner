import {
  UMOffice, apiPaths
}from "globals";
import {
  myAxios, getPaginatedResults, logger
} from "utils";
import {
  Action,
  DBList
}from "globals";

export const addOffice = (office: Partial<UMOffice>): Promise<any> =>
  myAxios.post(apiPaths.OFFICES, office).then(response => response.data);

// export const listOffices = (): Promise<DbOffice[]> =>
//   myAxios.get(apiPaths.OFFICES).then(response => response.data);

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
