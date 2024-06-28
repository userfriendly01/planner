import { fetchUser } from "../fetchUser";
import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils/myAxios";

const axiosMock = new MockAdapter(myAxios);

jest.mock("globals", () => ({
  apiPaths: {
    EMPLOYEE_LOOKUP: jest.fn().mockReturnValue("/service/employeelookup/n01234567")
  },
  formModes: {
    INSERT: "insert",
    UPDATE: "update",
    DELETE: "delete"
  }
}));

describe("fetchUser", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
  });

  describe("service call to EMPLOYEE_LOOKUP succeeds", () => {
    const fetchUserRes = {
      value: [
        {
          mail: "email",
          givenName: "FirstName  ",
          surname: "LastName  ",
          officeLocation: "OfficeName",
          extension_128b6233d06d4df391d7de26c982b64e_extensionAttribute1: "OfficeNumber",
          department: "DepartmentName",
          extension_128b6233d06d4df391d7de26c982b64e_extensionAttribute2: "DepartmentNumber",
          accountEnabled: true
        }
      ]
    };
    beforeEach(() => {
      axiosMock.onGet("/service/employeelookup/n01234567").reply(200, fetchUserRes);
    });
    test("should resolve with formatted data", done => {
      const nNum = "n01234567";
      fetchUser("", nNum).then(resolvedVal => {
        expect(axiosMock.history.get[0].url).toBe("/service/employeelookup/n01234567");
        expect(resolvedVal).toEqual({
          email: fetchUserRes.value[0].mail,
          firstName: fetchUserRes.value[0].givenName.trim(),
          lastName: fetchUserRes.value[0].surname.trim(),
          officeName: fetchUserRes.value[0].officeLocation,
          officeNumber: fetchUserRes.value[0].extension_128b6233d06d4df391d7de26c982b64e_extensionAttribute1,
          departmentName: fetchUserRes.value[0].department,
          departmentNumber: fetchUserRes.value[0].extension_128b6233d06d4df391d7de26c982b64e_extensionAttribute2,
          isTerminated: false
        });
        done();
      });
    });
    test("should resolve with correct formatted data when more than one value returned", done => {
      const multipleValRes = {
        value: [
          {
            mail: "email",
            givenName: null,
            surname: null,
            officeLocation: null,
            department: "Liberty Pending Worker",
            accountEnabled: true
          },
          fetchUserRes.value[0]

        ]
      };
      axiosMock.onGet("/service/employeelookup/n01234567").reply(200, multipleValRes);

      const nNum = "n01234567";
      fetchUser("", nNum).then(resolvedVal => {
        expect(axiosMock.history.get[0].url).toBe("/service/employeelookup/n01234567");
        expect(resolvedVal).toEqual({
          email: fetchUserRes.value[0].mail,
          firstName: fetchUserRes.value[0].givenName.trim(),
          lastName: fetchUserRes.value[0].surname.trim(),
          officeName: fetchUserRes.value[0].officeLocation,
          officeNumber: fetchUserRes.value[0].extension_128b6233d06d4df391d7de26c982b64e_extensionAttribute1,
          departmentName: fetchUserRes.value[0].department,
          departmentNumber: fetchUserRes.value[0].extension_128b6233d06d4df391d7de26c982b64e_extensionAttribute2,
          isTerminated: false
        });
        done();
      });
    });
  });

  describe("service call to EMPLOYEE_LOOKUP returns nothing", () => {
    const fetchUserRes = { value: []};
    beforeEach(() => {
      axiosMock.onGet("/service/employeelookup/n01234567").reply(200, fetchUserRes);
    });
    test("should reject", done => {
      const nNum = "n01234567";
      fetchUser("", nNum).catch(rejectedVal => {
        expect(axiosMock.history.get[0].url).toBe("/service/employeelookup/n01234567");
        expect(rejectedVal).toEqual("fetchUser employee lookup did not return any data");
        done();
      });
    });
  });
});