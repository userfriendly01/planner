import { fetchUser } from "../fetchUser";
import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);

jest.mock("components");
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
      results: [
        {
          employee_email_address: "email",
          first_name: "FirstName  ",
          last_name: "LastName  ",
          preferred_name: null,
          office_name: "OfficeName",
          office_code: "OfficeNumber",
          dept_name: "DepartmentName",
          dept_code: "DepartmentNumber"
        }
      ]
    };
    beforeEach(() => {
      axiosMock.onGet("/service/employeelookup/n01234567").reply(200, fetchUserRes);
    });
    test("should resolve with formatted data", done => {
      const nNum = "n01234567";
      fetchUser(nNum).then(resolvedVal => {
        expect(axiosMock.history.get[0].url).toBe("/service/employeelookup/n01234567");
        expect(resolvedVal).toEqual({
          email: fetchUserRes.results[0].employee_email_address,
          firstName: fetchUserRes.results[0].first_name.trim(),
          lastName: fetchUserRes.results[0].last_name.trim(),
          officeName: fetchUserRes.results[0].office_name,
          officeNumber: fetchUserRes.results[0].office_code,
          departmentName: fetchUserRes.results[0].dept_name,
          departmentNumber: fetchUserRes.results[0].dept_code
        });
        done();
      });
    });
  });

  describe("service call to EMPLOYEE_LOOKUP returns nothing", () => {
    const fetchUserRes = [];
    beforeEach(() => {
      axiosMock.onGet("/service/employeelookup/n01234567").reply(200, fetchUserRes);
    });
    test("should reject", done => {
      const nNum = "n01234567";
      fetchUser(nNum).catch(rejectedVal => {
        expect(axiosMock.history.get[0].url).toBe("/service/employeelookup/n01234567");
        expect(rejectedVal).toEqual("fetchUser employee lookup did not return any data");
        done();
      });
    });
  });
});