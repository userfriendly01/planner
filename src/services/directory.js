import { apiPaths } from "globals";
import {
  logger, myAxios
} from "utils";

export const deleteDirectory = directoryId => {
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

export const insertDirectory = (firstName, lastName, phoneNumber, profileId) => {
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

export const updateDirectory = (directoryId, firstName, lastName, phoneNumber) => {
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