import {
  apiPaths,
  OperatingUnit
} from "globals";
import { myAxios } from "utils";


export const getOperatingUnits = (): Promise<OperatingUnit[]> =>
  myAxios.get(apiPaths.GET_OU).then(response => {
    return response.data.map((ou: { friendly_name: string; sid: string; }) => {
      const operatingunit: OperatingUnit = {} as OperatingUnit;
      operatingunit.ou_name = ou.friendly_name;
      operatingunit.ou_sid = ou.sid;
      return operatingunit;
    });
  });