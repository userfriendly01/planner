import { fetchUser } from "../fetchUser";
import MockAdapter from "axios-mock-adapter";
import { apiPaths } from "globals";
import { myAxios } from "utils";

jest.mock("globals", () => ({
  __esModule: true,
  apiPaths: {
    EMPLOYEE_LOOKUP: jest.fn()
  }
}));

const axiosMock = new MockAdapter(myAxios);

describe("fetchUser", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
  });

  describe("service call to EMPLOYEE_LOOKUP succeeds", () => {
    const fetchUserRes = [
      {
        person: {
          data: {
            Email: "email",
            FirstName: "FirstName",
            LastName: "LastName",
            OfficeName: "OfficeName",
            OfficeNumber: "OfficeNumber",
            DepartmentName: "DepartmentName",
            DepartmentNumber: "DepartmentNumber"
          }
        },
        manager: {
          data: {
            FirstName: "ManagerFirstName",
            LastName: "ManagerLastName"
          }
        }
      }
    ];
    beforeEach(() => {
      axiosMock.onGet("/service/employeelookup/01234567").reply(200, fetchUserRes);
      apiPaths.EMPLOYEE_LOOKUP.mockReturnValue("/service/employeelookup/01234567");
    });
    test("should resolve with formatted data", done => {
      const nNum = "n01234567";
      fetchUser(nNum).then(resolvedVal => {
        expect(axiosMock.history.get[0].url).toBe("/service/employeelookup/01234567");
        expect(resolvedVal).toEqual({
          email: fetchUserRes[0].person.data.Email,
          firstName: fetchUserRes[0].person.data.FirstName,
          lastName: fetchUserRes[0].person.data.LastName,
          officeName: fetchUserRes[0].person.data.OfficeName,
          officeNumber: fetchUserRes[0].person.data.OfficeNumber,
          departmentName: fetchUserRes[0].person.data.DepartmentName,
          departmentNumber: fetchUserRes[0].person.data.DepartmentNumber,
          manager: `${fetchUserRes[0].manager.data.FirstName} ${fetchUserRes[0].manager.data.LastName}`
        });
        done();
      });
    });
  });

  describe("service call to EMPLOYEE_LOOKUP returns noting", () => {
    const fetchUserRes = [];
    beforeEach(() => {
      axiosMock.onGet("/service/employeelookup/01234567").reply(200, fetchUserRes);
      apiPaths.EMPLOYEE_LOOKUP.mockReturnValue("/service/employeelookup/01234567");
    });
    test("should reject", done => {
      const nNum = "n01234567";
      fetchUser(nNum).catch(rejectedVal => {
        expect(axiosMock.history.get[0].url).toBe("/service/employeelookup/01234567");
        expect(rejectedVal).toEqual("fetchUser employee lookup did not return any data");
        done();
      });
    });
  });

  // describe("postToTransferApi fails", () => {
  //   const badResponse = { wahh: "Failed transfer to VDN" };
  //   const status = 500;
  //   beforeEach(() => ( axiosMock.onPost(postToTransferApiUrl).reply(status, badResponse)));
  //   test("should reject with error", done => {
  //     postToTransferApi(vdn, fromNumber).catch(rejectedVal => {
  //       expect(axiosMock.history.post[0].url).toBe(postToTransferApiUrl);
  //       expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(postToTransferApiRequest);
  //       expect(rejectedVal).toEqual({
  //         data: badResponse,
  //         status
  //       });
  //       expect(getElevenDigitNumber).toHaveBeenCalledWith(fromNumber);
  //       done();
  //     });
  //   });
  // });
});