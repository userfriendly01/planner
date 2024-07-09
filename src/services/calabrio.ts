import { apiPaths } from "globals";
import {
  CalabrioGroup,
  CalabrioUser
} from "usermanagement/CallRecording.Interfaces";
import { myAxios } from "utils/myAxios";

export const createCalabrioTeam = async (accessToken: string, payload: any): Promise<CalabrioGroup[]> => {
  return await myAxios.post(apiPaths.CREATE_CALABRIO_TEAM, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const createCalabrioUser = async (accessToken: string, payload: any): Promise<CalabrioGroup[]> => {
  return await myAxios.post(apiPaths.CREATE_CALABRIO_USER, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const updateCalabrioUser = async (accessToken: string, payload: any): Promise<CalabrioUser> => {
  // payload.id = personId;
  return await myAxios.put(apiPaths.UPDATE_CALABRIO_USER, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const getWfmOrg = async (accessToken: string, businessUnitId: string): Promise<CalabrioGroup[]> => {
  const startDate = new Date().toISOString().split("T")[0];
  const endDate = new Date().toISOString().split("T")[0];
  return await myAxios.get(`${apiPaths.GET_CALABRIO_WFM_ORG}?BusinessUnitId=${businessUnitId}&StartDate=${startDate}&EndDate=${endDate}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const getWfmOptions = async (accessToken: string): Promise<CalabrioGroup[]> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_WFM_OPTIONS, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const getWfmTeam = async (accessToken: string, BusinessUnitId: string, TeamId: string): Promise<any> => {
  return await myAxios.get(`${apiPaths.GET_CALABRIO_WFM}`, {
    params: {
      api: "Team",
      BusinessUnitId,
      TeamId
    },
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const getWfmUserByNNumber = async (accessToken: string, nNumber: string): Promise<{
  data: {
    Result: [CalabrioUser] | []
  }
}> => {
  const nNumStringArray = JSON.stringify([nNumber.toLowerCase()]);
  return await myAxios.get(apiPaths.GET_CALABRIO_WFM_USER_BY_NNUMBER(nNumStringArray), {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const getWfmBusinessUnits = async (accessToken: string): Promise<CalabrioGroup[]> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_WFM, {
    params: {
      api: "Business Units"
    },
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const createCalabrioWFMPerson = async (accessToken: string, payload: any): Promise<any> => {
  return await myAxios.post(apiPaths.CREATE_CALABRIO_WFM_PERSON, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

// TODO: any chance that we may have to decompress the response?
export const getCalabrioUsers = async (accessToken: string, includeInactive = false): Promise<any[]> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_USERS, {
    params: {
      includeInactive
    },
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const getCalabrioOrg = async (accessToken: string): Promise<any[]> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_ORG, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const getCalabrioRoles = async (accessToken: string): Promise<CalabrioGroup[]> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_ROLES, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const getCalabrioUser = async (accessToken: string, personId: number): Promise<any> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_USER(personId), {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const getQmUserProfiles = async (accessToken: string, workerSid: string, nNumber: string, email: string, firstName?: string, lastName?: string): Promise<CalabrioUser> => {
  const params: any = {
    acdId: workerSid,
    email,
    nNumber
  };

  if (firstName && lastName) {
    params.firstName = firstName;
    params.lastName = lastName;
  }

  return await myAxios.get(apiPaths.GET_CALABRIO_USER_PROFILES, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};
