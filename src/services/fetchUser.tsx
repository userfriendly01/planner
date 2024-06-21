import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";

export interface FetchUserResponse {
  email: string;
  firstName: string;
  lastName: string;
  officeName: string;
  officeNumber: string;
  departmentName: string;
  departmentNumber: string;
  isTerminated: boolean;
}

interface MSGraphResponse {
  value: {
    mail: string;
    givenName: string;
    surname: string;
    officeLocation: string;
    extension_128b6233d06d4df391d7de26c982b64e_extensionAttribute1: string;
    department: string;
    extension_128b6233d06d4df391d7de26c982b64e_extensionAttribute2: string;
    accountEnabled: boolean;
  }[]
}

export const fetchUser = async (accessToken: string, nNumber: string): Promise<FetchUserResponse> => {
  const { data } = await myAxios.get<MSGraphResponse>(apiPaths.EMPLOYEE_LOOKUP(nNumber), {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const activeUser =  data.value.length === 1
    ? data.value[0]
    : data.value.find(account => account.accountEnabled);

  if (activeUser) {
    return {
      email: activeUser.mail,
      firstName: activeUser.givenName.trim(),
      lastName: activeUser.surname.trim(),
      officeName: activeUser.officeLocation,
      officeNumber: activeUser.extension_128b6233d06d4df391d7de26c982b64e_extensionAttribute1,
      departmentName: activeUser.department,
      departmentNumber: activeUser.extension_128b6233d06d4df391d7de26c982b64e_extensionAttribute2,
      isTerminated: !activeUser.accountEnabled
    };
  }

  throw "fetchUser employee lookup did not return any data";
};
