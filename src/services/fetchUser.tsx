import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";

export interface FetchUserResponse {
  email: string,
  firstName: string,
  lastName: string,
  officeName: string,
  officeNumber: string,
  departmentName: string,
  departmentNumber: string
}

export const fetchUser = (nNumber: string): Promise<FetchUserResponse> => myAxios.get(apiPaths.EMPLOYEE_LOOKUP(nNumber))
  .then(res => {
    if (res?.data?.results?.length) {
      const {
        preferred_name: preferredName,
        first_name: firstName,
        last_name: lastName,
        employee_email_address: email,
        office_name: officeName,
        office_code: officeNumber,
        dept_name: departmentName,
        dept_code: departmentNumber
      } = res.data.results[0];

      return {
        email,
        firstName: (preferredName || firstName)?.trim(),
        lastName: lastName?.trim(),
        officeName,
        officeNumber,
        departmentName,
        departmentNumber
      };
    } else {
      throw "fetchUser employee lookup did not return any data";
    }
  });