import { apiPaths } from "globals";
import { logger } from "utils/logger";
import { myAxios } from "utils/myAxios";

export const deleteDirectory = (directoryId: number) => {
  return myAxios.delete(apiPaths.DIRECTORY_ENTRY(directoryId)).then(res => {
    logger.log(
      `Successfully deleted directory entry with directoryId ${directoryId}`,
      {
        responseData: res.data
      }
    );
    return res;
  });
};

export const insertDirectory = (firstName: string, lastName: string, phoneNumber: string, profileId: string | number) => {
  const requestBody = {
    first_nme: firstName,
    last_nme: lastName,
    phone_num: phoneNumber,
    profile_id: profileId
  };
  return myAxios.post(apiPaths.DIRECTORY, requestBody)
    .then(res => {
      logger.log("Successfully added directory entry", {
        responseData: res.data,
        requestBody
      });
      return res;
    });
};

export const updateDirectory = (directoryId: number, firstName: string, lastName: string, phoneNumber: string) => {
  const requestBody = {
    first_nme: firstName,
    last_nme: lastName,
    phone_num: phoneNumber
  };
  return myAxios.put(apiPaths.DIRECTORY_ENTRY(directoryId), requestBody)
    .then(res => {
      logger.log(`Successfully updated directory entry with directoryId ${directoryId}`, {
        responseData: res.data,
        requestBody
      });
      return res;
    });
};