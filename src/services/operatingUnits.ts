import { apiPaths } from "globals";
import {
  OperatingUnit, Tokens
} from "globals/interfaces";
import { myAxios } from "utils/myAxios";

export const getOperatingUnits = (tokens: Tokens): Promise<OperatingUnit[]> => {
  const config = {
    headers: {
      Authorization: `Bearer ${tokens.adminService}`
    }
  };
  return myAxios.get(apiPaths.OPERATING_UNITS, config).then(response => {
    return response.data.map((ou: { friendly_name: string; sid: string; }) => {
      const operatingunit: OperatingUnit = {} as OperatingUnit;
      operatingunit.ou_name = ou.friendly_name;
      operatingunit.ou_sid = ou.sid;
      return operatingunit;
    });
  });
};