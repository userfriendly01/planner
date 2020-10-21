import { apiPaths } from "globals";
import { myAxios } from "utils";

export const deleteDirectory = directoryId =>
  myAxios.delete(apiPaths.DIRECTORY_ENTRY(directoryId)).then(res => {
    console.log(
      `Successfully deleted directory entry with directoryId ${directoryId}`,
      {
        responseData: res.data
      }
    );
  });

export const insertDirectory = (firstName, lastName, phoneNumber, profileId) => {
  const requestBody = {
    first_nme: firstName,
    last_nme: lastName,
    phone_num: phoneNumber,
    profile_id: profileId
  };
  return myAxios.post(apiPaths.DIRECTORY, requestBody)
    .then(res => {
      console.log("Successfully added directory entry", {
        responseData: res.data,
        requestBody
      });
    }).catch(err => {
      console.error("Failed to insert directory entry", {
        err,
        requestBody
      });
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
      console.log(`Successfully updated directory entry with directoryId ${directoryId}`, {
        responseData: res.data,
        requestBody
      });
    }).catch(err => {
      console.error(`Failed to update directory entry with directoryId ${directoryId}`, {
        err,
        requestBody
      });
    });
};