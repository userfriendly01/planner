import {
  getUpdateTemplates,
  getCreateTemplates
} from "../../BulkTemplates";
import {
  createUser,
  createCalabrioUser,
  getCalabrioUser,
  updateCalabrioUser,
  updateUser
} from "services";
import { initialTestState } from "testUtils";

jest.mock("services", () => ({
  createUser: jest.fn(),
  createCalabrioUser: jest.fn(),
  getCalabrioUser: jest.fn(),
  updateCalabrioUser: jest.fn(),
  updateUser: jest.fn()
}));

const createTemplates = getCreateTemplates(initialTestState);
const updateTemplates = getUpdateTemplates(initialTestState);

describe("CREATE_TRITON_USER", () => {
  beforeEach(() => jest.clearAllMocks());
  const createTritonProcessFunction = createTemplates.CREATE_TRITON_USER.processFunction;
  describe("createUser is successful", () => {
    beforeEach(() => createUser.mockResolvedValue({ workerSid: "WK123456" }));
    describe("user is DID user", () => {
      const row = {
        "Did User": "y",
        attributes: {
          n_number: "n0263445",
          did: "+16038518200"
        },
        directDialNum: "+16038518200",
        zeroOutEnabled: true
      };
      test("should populate with DID body", async () => {
        const results = await createTritonProcessFunction(row, 2, initialTestState);
        expect(createUser).toHaveBeenCalledTimes(1);
        expect(createUser).toHaveBeenCalledWith({
          activateEp: true,
          alternateDid: "+16038518200",
          attributes: {
            did: "+16038518200",
            n_number: "n0263445"
          },
          directDialNum: "+16038518200",
          zeroOutEnabled: true
        });
        expect(results).toBe("WK123456 created in Triton for n0263445 for row 2");
      });
    });
    describe("user is not DID user", () => {
      const row = {
        "Did User": "n",
        attributes: {
          n_number: "n0263445"
        }
      };
      test("should populate with non DID body", async () => {
        const results = await createTritonProcessFunction(row, 2, initialTestState);
        expect(createUser).toHaveBeenCalledTimes(1);
        expect(createUser).toHaveBeenCalledWith({
          activateEp: false,
          attributes: {
            n_number: "n0263445"
          }
        });
        expect(results).toBe("WK123456 created in Triton for n0263445 for row 2");
      });
    });
  });
  describe("error is thrown on createUser", () => {
    beforeEach(() => createUser.mockRejectedValue("aww"));
    const row = {
      "Did User": "n",
      attributes: {
        n_number: "n0263445"
      }
    };
    test("should reject with err", async () => {
      try {
        await createTritonProcessFunction(row, 2, initialTestState);
      } catch(err){
        expect(createUser).toHaveBeenCalledTimes(1);
        expect(createUser).toHaveBeenCalledWith({
          activateEp: false,
          attributes: {
            n_number: "n0263445"
          }
        });
        expect(err).toBe("Failed to create Triton user for row 2. aww");
      }
    });
  });
});
describe("CREATE_CALABRIO_QM_USER", () => {
  const createCalabrioProcessFunction = createTemplates.CREATE_CALABRIO_QM_USER.processFunction;
  beforeEach(() => jest.clearAllMocks());
  const row = {
    acdId: "WK13248",
    attributes: {
      n_number: "n0263445",
      email: "e.mail@lm.com",
      firstName: "Michael",
      lastName: "Scott"
    },
    groupId: 109,
    timeZone: "Americas",
    roles: [{ name: "role1" }],
    scope: {
      groups: [],
      teams: [102]
    }
  };
  describe("acdId is not on row or existing triton user", () => {
    test("should reject with err", async () => {
      const missingAcdId = { ...row };
      delete missingAcdId.acdId;
      try {
        await createCalabrioProcessFunction(missingAcdId, 2, initialTestState);
      } catch(err){
        expect(createCalabrioUser).toHaveBeenCalledTimes(0);
        expect(err).toBe("Failed to create Calabrio user for row 2. Missing ACD Id, validate this user already exists in Triton");
      }
    });
  });
  describe("createUser is successful", () => {
    beforeEach(() => createUser.mockResolvedValue({ workerSid: "WK123456" }));
    test("should resolve", async () => {
      const results = await createCalabrioProcessFunction(row, 2, initialTestState);
      expect(createCalabrioUser).toHaveBeenCalledTimes(1);
      expect(createCalabrioUser).toHaveBeenCalledWith({
        acdId: "WK13248",
        adLogin: "LM\\n0263445",
        email: "e.mail@lm.com",
        firstName: "Michael",
        lastName: "Scott",
        groupId: 109,
        timeZone: "Americas",
        roles: [{ name: "role1" }],
        scope: {
          groups: [],
          teams: [102]
        }
      });
      expect(results).toBe("User created in Calabrio for n0263445 for row 2");
    });
    describe("acdId is not on row but triton worker is found", () => {
      beforeEach(() => createUser.mockResolvedValue({ workerSid: "WK123456" }));
      test("should resolve", async () => {
        const missingAcdId = {
          ...row,
          attributes: {
            ...row.attributes,
            n_number: "n0000000"
          }
        };
        delete missingAcdId.acdId;
        const results = await createCalabrioProcessFunction(missingAcdId, 2, initialTestState);
        expect(createCalabrioUser).toHaveBeenCalledTimes(1);
        expect(createCalabrioUser).toHaveBeenCalledWith({
          acdId: "WK1234",
          adLogin: "LM\\n0000000",
          email: "e.mail@lm.com",
          firstName: "Michael",
          lastName: "Scott",
          groupId: 109,
          timeZone: "Americas",
          roles: [{ name: "role1" }],
          scope: {
            groups: [],
            teams: [102]
          }
        });
        expect(results).toBe("User created in Calabrio for n0000000 for row 2");
      });
    });
  });
  describe("error is thrown on createUser", () => {
    beforeEach(() => createCalabrioUser.mockRejectedValue("aww"));
    test("should reject with err", async () => {
      try {
        await createCalabrioProcessFunction(row, 2, initialTestState);
      } catch(err){
        expect(createCalabrioUser).toHaveBeenCalledTimes(1);
        expect(createCalabrioUser).toHaveBeenCalledWith({
          acdId: "WK13248",
          adLogin: "LM\\n0263445",
          email: "e.mail@lm.com",
          firstName: "Michael",
          lastName: "Scott",
          groupId: 109,
          timeZone: "Americas",
          roles: [{ name: "role1" }],
          scope: {
            groups: [],
            teams: [102]
          }
        });
        expect(err).toBe("Failed to create Calabrio user for row 2. aww");
      }
    });
  });
});
describe("UPDATE_WORKER_ATTRIBUTE", () => {
  const updateWorkerAttributesProcessFunction = updateTemplates.UPDATE_WORKER_ATTRIBUTE.processFunction;
  beforeEach(() => jest.clearAllMocks());
  describe("updateUser is successful", () => {
    beforeEach(() => updateUser.mockResolvedValue("Yay!"));
    describe("key === profile_id", () => {
      const template = {
        data: {
          key: "profile_id",
          value: "3",
          location: "attributes"
        }
      };
      const row = { workerSid: "WK1234" };
      test("should call update user with correct body", async () => {
        const result = await updateWorkerAttributesProcessFunction(row, 4, template);
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith("WK1234", {
          attributes: {
            agent_attribute_1: 3,
            profile_id: 3
          }
        });
        expect(result).toBe("WK1234 - Worker Attributes updated for row 4");
      });
    });
    describe("location === attributes", () => {
      const template = {
        data: {
          key: "did",
          value: "+16038518200",
          location: "attributes"
        }
      };
      const row = { workerSid: "WK1234" };
      test("should call update user with correct body", async () => {
        const result = await updateWorkerAttributesProcessFunction(row, 4, template);
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith("WK1234", {
          attributes: {
            did: "+16038518200"
          }
        });
        expect(result).toBe("WK1234 - Worker Attributes updated for row 4");
      });
    });
    describe("location is null && key !== profile_id", () => {
      const template = {
        data: {
          key: "selfServiceAtt",
          value: true,
          location: null
        }
      };
      const row = { workerSid: "WK1234" };
      test("should call update user with correct body", async () => {
        const result = await updateWorkerAttributesProcessFunction(row, 4, template);
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith("WK1234", {
          selfServiceAtt: true
        });
        expect(result).toBe("WK1234 - Worker Attributes updated for row 4");
      });
    });
  });
  describe("updateUser throws an error", () => {
    beforeEach(() => updateUser.mockRejectedValue("Aww"));
    test("should reject", async () => {
      const row = { workerSid: "WK1234" };
      const template = {
        data: {}
      };
      try {
        await updateWorkerAttributesProcessFunction(row, 4, template);
      } catch(err){
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith("WK1234", {});
        expect(err).toBe("Failed to update Triton Worker Attributes for row 4. Aww");
      }
    });
  });

});
describe("UPDATE_USERS_MANAGER", () => {
  const updateUsersManagerProcessFunction = updateTemplates.UPDATE_USERS_MANAGER.processFunction;
  beforeEach(() => {
    jest.clearAllMocks();
    getCalabrioUser.mockResolvedValue({ data: initialTestState.calabrioContext.users[0] });
  });
  describe("managerObject is null", () => {
    test("should reject", async () => {
      const row = { workerSid: "WK1234" };
      const template = {
        data: {
          nNumber: "n2222224"
        }
      };
      try {
        await updateUsersManagerProcessFunction(row, 4, template, initialTestState);
      } catch(err){
        expect(updateUser).toHaveBeenCalledTimes(0);
        expect(err).toBe("n2222224 is not a valid manager nNumber for row 4");
      }
    });
  });
  describe("error is thrown", () => {
    test("should reject", async () => {
      const row = { workerSid: "WK1234" };
      try {
        await updateUsersManagerProcessFunction(row, 4, null);
      } catch(err){
        expect(updateUser).toHaveBeenCalledTimes(0);
        expect(err).toContain("Failed to update Manager and Calabrio Team for user for row 4.");
      }
    });
  });
  describe("service calls are all successful", () => {
    beforeEach(() => {
      updateUser.mockResolvedValue("yay!");
      updateCalabrioUser.mockResolvedValue("yay!");
    });
    describe("userTritonRecord is null", () => {
      test("manager will be updated, calabrio team will not", async () => {
        const row = {
          n_number: "n13548",
          workerSid: "WK1234"
        };
        const template = {
          data: {
            nNumber: "n1234567",
            calabrioTeamId: 105
          }
        };
        const results = await updateUsersManagerProcessFunction(row, 4, template, initialTestState);
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith("WK1234", {
          attributes: {
            manager_first_name: "John",
            manager_last_name: "Wick",
            manager_n_number: "n1234567",
            manager: "John Wick"
          }
        });
        expect(updateCalabrioUser).toHaveBeenCalledTimes(0);
        expect(results).toBe("n13548 - Manager & Calabrio Team updated for row 4");
      });
    });
    describe("userCalabrioRecord is null", () => {
      test("manager will be updated, calabrio team will not", async () => {
        const row = {
          n_number: "n1111111",
          workerSid: "WK1234"
        };
        const template = {
          data: {
            nNumber: "n1234567",
            calabrioTeamId: 105
          }
        };
        const results = await updateUsersManagerProcessFunction(row, 4, template, initialTestState);
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith("WK1234", {
          attributes: {
            manager_first_name: "John",
            manager_last_name: "Wick",
            manager_n_number: "n1234567",
            manager: "John Wick"
          }
        });
        expect(updateCalabrioUser).toHaveBeenCalledTimes(0);
        expect(results).toBe("n1111111 - Manager & Calabrio Team updated for row 4");
      });
    });
    describe("calabrioTeamId is null", () => {
      test("manager will be updated, calabrio team will not", async () => {
        const row = {
          n_number: "n1111111",
          workerSid: "WK1234"
        };
        const template = {
          data: {
            nNumber: "n1234567"
          }
        };
        const results = await updateUsersManagerProcessFunction(row, 4, template, initialTestState);
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith("WK1234", {
          attributes: {
            manager_first_name: "John",
            manager_last_name: "Wick",
            manager_n_number: "n1234567",
            manager: "John Wick"
          }
        });
        expect(updateCalabrioUser).toHaveBeenCalledTimes(0);
        expect(results).toBe("n1111111 - Manager & Calabrio Team updated for row 4");
      });
    });
    describe("userTritonRecord && userCalabrioRecord are not null", () => {
      test("manager will be updated, calabrio team will not", async () => {
        const row = {
          n_number: "n0000000",
          workerSid: "WK1234"
        };
        const template = {
          data: {
            nNumber: "n1234567",
            calabrioTeamId: 105
          }
        };
        const results = await updateUsersManagerProcessFunction(row, 4, template, initialTestState);
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith("WK1234", {
          attributes: {
            manager_first_name: "John",
            manager_last_name: "Wick",
            manager_n_number: "n1234567",
            manager: "John Wick"
          }
        });
        expect(updateCalabrioUser).toHaveBeenCalledTimes(1);
        expect(updateCalabrioUser).toHaveBeenCalledWith(200, {
          id: 200,
          acdId: "WK1234",
          firstName: "Brittany",
          lastName: "Magee",
          groupId: 105,
          adLogin: "LM\\n0222444",
          email: "Brittany.Magee@libertymutual.com"
        });
        expect(results).toBe("n0000000 - Manager & Calabrio Team updated for row 4");
      });
    });
  });
  describe("updateUser fails", () => {
    beforeEach(() => {
      updateUser.mockRejectedValue("boo");
      updateCalabrioUser.mockResolvedValue("yay!");
    });
    test("should reject", async () => {
      const row = {
        n_number: "n0000000",
        workerSid: "WK1234"
      };
      const template = {
        data: {
          nNumber: "n1234567",
          calabrioTeamId: 105
        }
      };
      try {
        await updateUsersManagerProcessFunction(row, 4, template, initialTestState);
      } catch(err){
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith("WK1234", {
          attributes: {
            manager_first_name: "John",
            manager_last_name: "Wick",
            manager_n_number: "n1234567",
            manager: "John Wick"
          }
        });
        expect(updateCalabrioUser).toHaveBeenCalledTimes(1);
        expect(updateCalabrioUser).toHaveBeenCalledWith(200, {
          id: 200,
          acdId: "WK1234",
          firstName: "Brittany",
          lastName: "Magee",
          groupId: 105,
          adLogin: "LM\\n0222444",
          email: "Brittany.Magee@libertymutual.com"
        });
        expect(err).toBe("Failed to update for row 4. boo");
      }
    });
  });
  describe("updateCalabrioUser fails", () => {
    beforeEach(() => {
      updateUser.mockResolvedValue("yay!");
      updateCalabrioUser.mockRejectedValue("boo");
    });
    test("should reject", async () => {
      const row = {
        n_number: "n0000000",
        workerSid: "WK1234"
      };
      const template = {
        data: {
          nNumber: "n1234567",
          calabrioTeamId: 105
        }
      };
      try {
        await updateUsersManagerProcessFunction(row, 4, template, initialTestState);
      } catch(err){
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith("WK1234", {
          attributes: {
            manager_first_name: "John",
            manager_last_name: "Wick",
            manager_n_number: "n1234567",
            manager: "John Wick"
          }
        });
        expect(updateCalabrioUser).toHaveBeenCalledTimes(1);
        expect(updateCalabrioUser).toHaveBeenCalledWith(200, {
          id: 200,
          acdId: "WK1234",
          firstName: "Brittany",
          lastName: "Magee",
          groupId: 105,
          adLogin: "LM\\n0222444",
          email: "Brittany.Magee@libertymutual.com"
        });
        expect(err).toBe("Failed to update for row 4. boo");
      }
    });
  });
});