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
  Department: string,
  Manager: string,
  Location: string
}

export const fetchUser = (nNumber: string): Promise<FetchUserResponse> => myAxios.get(apiPaths.EMPLOYEE_LOOKUP(nNumber.substring(1)))
  .then(res => {
    console.log("WHAT IS RES?!?!!!", res);
    if (res.data.length !== 0) {
      return {
        email: res.data[0].person.data.Email,
        firstName: res.data[0].person.data.FirstName,
        lastName: res.data[0].person.data.LastName,
        officeName: res.data[0].person.data.OfficeName,
        officeNumber: res.data[0].person.data.OfficeNumber,
        departmentName: res.data[0].person.data.DepartmentName,
        departmentNumber: res.data[0].person.data.DepartmentNumber,
        Department: res.data[0].person.data.DepartmentName,
        Manager: `${res.data[0].manager.data.FirstName} ${res.data[0].manager.data.LastName}`,
        Location: res.data[0].person.data.OfficeName
      };
    } else {
      throw "fetchUser employee lookup did not return any data";
    }
  });