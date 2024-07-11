import {
  createCalabrioTeam,
  createCalabrioUser,
  createCalabrioWFMPerson,
  getWfmBusinessUnits,
  getCalabrioUsers,
  getCalabrioOrg,
  getCalabrioRoles,
  getCalabrioUser,
  getQmUserProfiles,
  getWfmOrg,
  getWfmOptions,
  getWfmUserByNNumber,
  updateCalabrioUser,
  getWfmTeam
} from "../calabrio";
import MockAdapter from "axios-mock-adapter";
import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";

const axiosMock = new MockAdapter(myAxios);
const user = {
  acdID: "noob",
  groupId: 215
};

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

describe("createCalabrioUser", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onPost(apiPaths.CREATE_CALABRIO_USER).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      createCalabrioUser("Access Token", user)
        .then(resolvedValue => {
          expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(user);
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onPost(apiPaths.CREATE_CALABRIO_USER).replyOnce(500, badResponse));
    test("should reject with error", done => {
      createCalabrioUser("Access Token", user).catch(rejectedVal => {
        expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(user);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("createCalabrioTeam", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onPost(apiPaths.CREATE_CALABRIO_TEAM).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      createCalabrioTeam("Access Token", user)
        .then(resolvedValue => {
          expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(user);
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onPost(apiPaths.CREATE_CALABRIO_TEAM).replyOnce(500, badResponse));
    test("should reject with error", done => {
      createCalabrioTeam("Access Token", user).catch(rejectedVal => {
        expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(user);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("createCalabrioWFMPerson", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onPost(apiPaths.CREATE_CALABRIO_WFM_PERSON).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      createCalabrioWFMPerson("token", user)
        .then(resolvedValue => {
          expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(user);
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onPost(apiPaths.CREATE_CALABRIO_WFM_PERSON).replyOnce(500, badResponse));
    test("should reject with error", done => {
      createCalabrioWFMPerson("token", user).catch(rejectedVal => {
        expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(user);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("getWfmOrg", () => {
  const businessUnitId = "123-321";
  const fakeDate = "2023-07-01";
  const url = `https://calabrio-service.com/wfm/org/people?BusinessUnitId=${businessUnitId}&StartDate=${fakeDate}&EndDate=${fakeDate}`;

  beforeAll(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date(2023, 6, 1));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(url).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      getWfmOrg("token", businessUnitId)
        .then(resolvedValue => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onGet(url).replyOnce(500, badResponse));
    test("should reject with error", done => {
      getWfmOrg("token", businessUnitId).catch(rejectedVal => {
        expect(axiosMock.history.get.length).toEqual(1);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("getWfmOptions", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_WFM_OPTIONS).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      getWfmOptions("token")
        .then(resolvedValue => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_WFM_OPTIONS).replyOnce(500, badResponse));
    test("should reject with error", done => {
      getWfmOptions("token").catch(rejectedVal => {
        expect(axiosMock.history.get.length).toEqual(1);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("getCalabrioUsers", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_USERS).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      getCalabrioUsers("token")
        .then(resolvedValue => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_USERS).replyOnce(500, badResponse));
    test("should reject with error", done => {
      getCalabrioUsers("token").catch(rejectedVal => {
        expect(axiosMock.history.get.length).toEqual(1);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("getCalabrioOrg", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_ORG).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      getCalabrioOrg("token")
        .then(resolvedValue => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_ORG).replyOnce(500, badResponse));
    test("should reject with error", done => {
      getCalabrioOrg("token").catch(rejectedVal => {
        expect(axiosMock.history.get.length).toEqual(1);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("getWfmBusinessUnits", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_WFM).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      getWfmBusinessUnits("token")
        .then(resolvedValue => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(axiosMock.history.get[0].params).toStrictEqual({ api: "Business Units" });
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_WFM).replyOnce(500, badResponse));
    test("should reject with error", done => {
      getWfmBusinessUnits("token").catch(rejectedVal => {
        expect(axiosMock.history.get.length).toEqual(1);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("getWfmTeam", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_WFM).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      const BusinessUnitId = "123-321";
      const TeamId = "987-456";
      getWfmTeam("token", BusinessUnitId, TeamId)
        .then(resolvedValue => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(axiosMock.history.get[0].params).toStrictEqual({
            api: "Team",
            BusinessUnitId,
            TeamId
          });
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_WFM).replyOnce(500, badResponse));
    test("should reject with error", done => {
      const BusinessUnitId = "123-321";
      const TeamId = "987-456";
      getWfmTeam("token", BusinessUnitId, TeamId).catch(rejectedVal => {
        expect(axiosMock.history.get.length).toEqual(1);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("getCalabrioRoles", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_ROLES).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      getCalabrioRoles("token")
        .then(resolvedValue => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_ROLES).replyOnce(500, badResponse));
    test("should reject with error", done => {
      getCalabrioRoles("token").catch(rejectedVal => {
        expect(axiosMock.history.get.length).toEqual(1);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("getCalabrioUser", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_USER(67)).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      getCalabrioUser("token", 67)
        .then(resolvedValue => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_USER(67)).replyOnce(500, badResponse));
    test("should reject with error", done => {
      getCalabrioUser("token", 67).catch(rejectedVal => {
        expect(axiosMock.history.get.length).toEqual(1);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("updateCalabrioUser", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onPut(apiPaths.UPDATE_CALABRIO_USER).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      updateCalabrioUser("token", 67)
        .then(resolvedValue => {
          expect(axiosMock.history.put.length).toEqual(1);
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onPut(apiPaths.UPDATE_CALABRIO_USER).replyOnce(500, badResponse));
    test("should reject with error", done => {
      updateCalabrioUser("token", 67).catch(rejectedVal => {
        expect(axiosMock.history.put.length).toEqual(1);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("getWfmUserByNNumber", () => {
  const nNumber = "n0263786";

  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_WFM_USER_BY_NNUMBER(JSON.stringify([nNumber]))).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      getWfmUserByNNumber("token", nNumber)
        .then(resolvedValue => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_WFM_USER_BY_NNUMBER(JSON.stringify([nNumber]))).replyOnce(500, badResponse));
    test("should reject with error", done => {
      getWfmUserByNNumber("token", nNumber).catch(rejectedVal => {
        expect(axiosMock.history.get.length).toEqual(1);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("getQmUserProfiles", () => {
  const workerSid = "WK2342";
  const nNumber = "n0263786";
  const email = "faith.cuneo@libertymutual.com";
  const firstName = "Faith";
  const lastName = "Cuneo";

  const axiosUrl = "https://calabrio-service.com/qm?api=Get%20All%20Profiles&includeInactive=true";
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(axiosUrl).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      getQmUserProfiles("Access token", workerSid, nNumber, email)
        .then(resolvedValue => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(resolvedValue.data).toEqual(data);
          expect(axiosMock.history.get[0].params).toEqual({
            acdId: workerSid,
            email,
            nNumber
          });
          done();
        });
    });
    describe("first & last name are included", () => {
      const data = { huzzah: "you are winner" };
      const axiosUrl = `${apiPaths.GET_CALABRIO_USER_PROFILES}/${workerSid}/${nNumber}/${email}/Faith/Cuneo`;
      beforeEach(() => axiosMock.onGet(axiosUrl).replyOnce(200, data));
      test("should resolve with any successful response", done => {
        getQmUserProfiles("Access token", workerSid, nNumber, email, firstName, lastName)
          .then(resolvedValue => {
            expect(axiosMock.history.get.length).toEqual(1);
            expect(resolvedValue.data).toEqual(data);
            expect(axiosMock.history.get[0].params).toEqual({
              acdId: workerSid,
              email,
              nNumber,
              firstName,
              lastName
            });
            done();
          });
      });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onGet(axiosUrl).replyOnce(500, badResponse));
    test("should reject with error", done => {
      getQmUserProfiles("Access token", workerSid, nNumber, email).catch(rejectedVal => {
        expect(axiosMock.history.get.length).toEqual(1);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

