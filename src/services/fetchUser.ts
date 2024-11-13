import { apiPaths } from "globals";
import { logger } from "utils/logger";
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

interface MSGraphUser {
  mail: string;
  givenName: string;
  surname: string;
  officeLocation: string;
  extension_128b6233d06d4df391d7de26c982b64e_extensionAttribute1: string;
  department: string;
  extension_128b6233d06d4df391d7de26c982b64e_extensionAttribute2: string;
  accountEnabled: boolean;
}

interface MSGraphResponse {
  value: MSGraphUser[]
}

const formatUser = (msGraphUser: MSGraphUser): FetchUserResponse => {
  return {
    email: msGraphUser.mail,
    firstName: msGraphUser.givenName.trim(),
    lastName: msGraphUser.surname.trim(),
    officeName: msGraphUser.officeLocation,
    officeNumber: msGraphUser.extension_128b6233d06d4df391d7de26c982b64e_extensionAttribute1,
    departmentName: msGraphUser.department,
    departmentNumber: msGraphUser.extension_128b6233d06d4df391d7de26c982b64e_extensionAttribute2,
    isTerminated: !msGraphUser.accountEnabled
  };
};

export const fetchUserByEmail = async (accessToken: string, email: string): Promise<FetchUserResponse> => {
  try {
    const { data } = await myAxios.get<MSGraphUser>(apiPaths.EMPLOYEE_LOOKUP_BY_EMAIL(email), {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return formatUser(data);
  } catch(_) {
    logger.error("fetchUserByEmail employee lookup did not return any data", { email });

    return null;
  }

};

export const fetchUser = async (accessToken: string, nNumber: string): Promise<FetchUserResponse> => {
  const { data } = await myAxios.get<MSGraphResponse>(apiPaths.EMPLOYEE_LOOKUP(nNumber), {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const activeUser =  data.value.length === 1
    ? data.value[0]
    : data.value.find(account => account.officeLocation && account.accountEnabled);

  if (activeUser) {
    return formatUser(activeUser);
  }

  throw "fetchUser employee lookup did not return any data";
};
