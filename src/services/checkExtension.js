import { myAxios } from "./myAxios";
import { apiPaths } from "globals";

export const checkExtension = extension => myAxios.post(apiPaths.CHECK_EXTENSION, { extension })
  .then(res => {
    return res.data.isValid !== undefined ? res.data.isValid : false;
  });