import { apiPaths } from "globals";
import { myAxios } from "utils";

export const fetchUser = nNumber => myAxios.get(apiPaths.EMPLOYEE_LOOKUP(nNumber.substring(1)))
  .then(res => {
    if (res.data.length !== 0) {
      return {
        email: res.data[0].person.data.Email,
        firstName: res.data[0].person.data.FirstName,
        lastName: res.data[0].person.data.LastName,
        officeName: res.data[0].person.data.OfficeName,
        officeNumber: res.data[0].person.data.OfficeNumber,
        departmentName: res.data[0].person.data.DepartmentName,
        departmentNumber: res.data[0].person.data.DepartmentNumber
      };
    } else {
      return null;
    }
  });