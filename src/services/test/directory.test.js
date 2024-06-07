import {
  deleteDirectory,
  insertDirectory,
  updateDirectory
} from "../directory";
import MockAdapter from "axios-mock-adapter";
import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";

const axiosMock = new MockAdapter(myAxios);

const directoryId = 48;
const firstName = "Slim";
const lastName = "Pickens";
const phoneNumber = "18001235667";
const profileId = 7;
const successRes = { hooray: "it worked" };
const failRes = { boo: "waaaaah" };

describe("directory", () => {

  beforeEach(() => axiosMock.reset());

  describe("deleteDirectory", () => {
    describe("service call succeeds", () => {
      beforeEach(() => {
        axiosMock.onDelete(apiPaths.DIRECTORY_ENTRY(directoryId)).reply(200, successRes);
      });
      test("should resolve with success response", done => {
        deleteDirectory(directoryId).then(res => {
          expect(res.status).toEqual(200);
          expect(res.data).toEqual(successRes);
          done();
        });
      });
    });
    describe("service call fails", () => {
      beforeEach(() => axiosMock.onDelete(apiPaths.DIRECTORY_ENTRY(directoryId)).reply(500, failRes));
      test("should reject with error", done => {
        deleteDirectory(directoryId).catch(rejectedVal => {
          expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
          done();
        });
      });
    });
  });

  describe("insertDirectory", () => {
    describe("service call succeeds", () => {
      beforeEach(() => axiosMock.onPost(apiPaths.DIRECTORY).reply(200, successRes));
      test("should resolve with success response", done => {
        insertDirectory(firstName, lastName, phoneNumber, profileId).then(res => {
          expect(res.status).toEqual(200);
          expect(res.data).toEqual(successRes);
          done();
        });
      });
    });
    describe("service call fails", () => {
      beforeEach(() => axiosMock.onPost(apiPaths.DIRECTORY).reply(500, failRes));
      test("should reject with error", done => {
        insertDirectory(firstName, lastName, phoneNumber, profileId).catch(rejectedVal => {
          expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
          done();
        });
      });
    });
  });

  describe("updateDirectory", () => {
    const requestBody = {
      first_nme: firstName,
      last_nme: lastName,
      phone_num: phoneNumber
    };
    describe("service call succeeds", () => {
      beforeEach(() => axiosMock.onPut(apiPaths.DIRECTORY_ENTRY(directoryId, requestBody)).reply(200, successRes));
      test("should resolve with success response", done => {
        updateDirectory(directoryId, firstName, lastName, phoneNumber).then(res => {
          expect(res.status).toEqual(200);
          expect(res.data).toEqual(successRes);
          done();
        });
      });
    });
    describe("service call fails", () => {
      beforeEach(() => axiosMock.onPut(apiPaths.DIRECTORY_ENTRY(directoryId, requestBody)).reply(500, failRes));
      test("should reject with error", done => {
        updateDirectory(directoryId, firstName, lastName, phoneNumber).catch(rejectedVal => {
          expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
          done();
        });
      });
    });
  });
});
