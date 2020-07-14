import { apiPaths } from "globals";
import { myAxios } from "utils";

export const checkExtension = extension => myAxios.post(apiPaths.CHECK_EXTENSION, { extension })
  .then(res => {
    return res.data.isValid !== undefined ? res.data.isValid : false;
  });