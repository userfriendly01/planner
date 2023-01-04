import { apiPaths } from "globals";
import { myAxios } from "utils";

export interface FetchUserResponse {
  email: string,
  firstName: string,
  lastName: string,
  officeName: string,
  officeNumber: string,
  departmentName: string,
  departmentNumber: string,
  manager: string,
}

export const fetchUser = (nNumber: string): Promise<FetchUserResponse> => myAxios.get(apiPaths.EMPLOYEE_LOOKUP(nNumber.substring(1)))
  .then(res => {
    if (res.data.length !== 0) {
      return {
        email: res.data[0].person.data.Email,
        firstName: res.data[0].person.data.FirstName.trim(),
        lastName: res.data[0].person.data.LastName.trim(),
        officeName: res.data[0].person.data.OfficeName,
        officeNumber: res.data[0].person.data.OfficeNumber,
        departmentName: res.data[0].person.data.DepartmentName,
        departmentNumber: res.data[0].person.data.DepartmentNumber,
        manager: res.data[0].manager?.data && `${res.data[0].manager?.data?.FirstName} ${res.data[0].manager?.data?.LastName}`
      };
    } else {
      throw "fetchUser employee lookup did not return any data";
    }
  });