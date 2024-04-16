import {
  getUpdateTemplates,
  getCreateTemplates
} from "../../BulkTemplates";
import {
  addManager,
  createUser,
  createCalabrioUser,
  createCalabrioWFMPerson,
  createCalabrioTeam,
  getCalabrioUser,
  updateCalabrioUser,
  updateUser
} from "services";
import { initialTestState } from "testUtils";
import { CallerStateAttrDropDownOptions } from "../../../OnboardNewUser/RoutingAttributes/RoutingAttributesDropDown";
import { env } from "globals";

const createTemplates = getCreateTemplates(initialTestState);
const updateTemplates = getUpdateTemplates(initialTestState);

describe("CREATE_TRITON_USER", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete env.APP_ENV;
  });
  const createTritonProcessFunction = createTemplates.CREATE_TRITON_USER.processFunction;
  describe("createUser is successful", () => {
    beforeEach(() => createUser.mockResolvedValue({ sid: "WK123456" }));
    describe("user is DID user", () => {
      const row = {
        rowNumber: 2,
        "Did User": "y",
        attributes: {
          profile_id: 1,
          n_number: "n0263445",
          did: "+16038518200"
        },
        operatingUnitSid: "operatingUnitSid1",
        directDialNum: "+16038518200",
        zeroOutEnabled: true,
        selfServiceInd: true
      };
      test("should populate with DID body", async () => {
        const results = await createTritonProcessFunction(row, initialTestState);
        expect(createUser).toHaveBeenCalledTimes(1);
        expect(createUser).toHaveBeenCalledWith({
          alternateDid: "+16038518200",
          attributes: {
            profile_id: 1,
            did: "+16038518200",
            n_number: "n0263445"
          },
          operatingUnitSid: "operatingUnitSid1",
          directDialNum: "+16038518200",
          zeroOutEnabled: true,
          selfServiceInd: true
        });
        expect(results).toBe("WK123456 created in Triton for n0263445 for row 2");
      });
    });
    describe("user is not DID user", () => {
      const row = {
        rowNumber: 2,
        "Did User": "n",
        attributes: {
          profile_id: 1,
          n_number: "n0263445"
        },
        operatingUnitSid: "operatingUnitSid1"
      };
      test("should populate with non DID body", async () => {
        const results = await createTritonProcessFunction(row, initialTestState);
        expect(createUser).toHaveBeenCalledTimes(1);
        expect(createUser).toHaveBeenCalledWith({
          attributes: {
            profile_id: 1,
            n_number: "n0263445"
          },
          operatingUnitSid: "operatingUnitSid1"
        });
        expect(results).toBe("WK123456 created in Triton for n0263445 for row 2");
      });
    });
  });
  describe("error is thrown on createUser", () => {
    beforeEach(() => createUser.mockRejectedValue("aww"));
    const row = {
      rowNumber: 4,
      "Did User": "n",
      attributes: {
        profile_id: 1,
        n_number: "n0263445"
      },
      operatingUnitSid: "operatingUnitSid1"
    };
    test("should reject with err", async () => {
      try {
        await createTritonProcessFunction(row, initialTestState);
      } catch (err) {
        expect(createUser).toHaveBeenCalledTimes(1);
        expect(createUser).toHaveBeenCalledWith({
          attributes: {
            profile_id: 1,
            n_number: "n0263445"
          },
          operatingUnitSid: "operatingUnitSid1"
        });
        expect(err).toBe(JSON.stringify({
          rowNumber: 4,
          error: "Failed to create Triton user for row 4. aww"
        }));
      }
    });
  });
});
describe("CREATE_CALABRIO_QM_USER", () => {
  const createCalabrioProcessFunction = createTemplates.CREATE_CALABRIO_QM_USER.processFunction;
  beforeEach(() => jest.clearAllMocks());
  const row = {
    rowNumber: 2,
    acdId: "WK13248",
    attributes: {
      profile_id: 1,
      n_number: "n0263445",
      email: "e.mail@lm.com",
      emp_first_name: "Michael",
      emp_last_name: "Scott"
    },
    operatingUnitSid: "operatingUnitSid1",
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
        await createCalabrioProcessFunction(missingAcdId, initialTestState);
      } catch (err) {
        expect(createCalabrioUser).toHaveBeenCalledTimes(0);
        expect(err).toBe(JSON.stringify({
          rowNumber: 2,
          error: "Failed to create Calabrio user for row 2. Missing ACD Id, validate this user already exists in Triton"
        }));
      }
    });
  });
  describe("createUser is successful", () => {
    beforeEach(() => createUser.mockResolvedValue({ workerSid: "WK123456" }));
    test("should resolve", async () => {
      const results = await createCalabrioProcessFunction(row, initialTestState);
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
            profile_id: 1,
            ...row.attributes,
            n_number: "n0000000"
          }
        };
        delete missingAcdId.acdId;
        const results = await createCalabrioProcessFunction(missingAcdId, initialTestState);
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
        await createCalabrioProcessFunction(row, initialTestState);
      } catch (err) {
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
        expect(err).toBe(JSON.stringify({
          rowNumber: 2,
          error: "Failed to create Calabrio user for row 2. aww"
        }));
      }
    });
  });
});
describe("CREATE_CALABRIO_WFM_PERSON", () => {
  const createWFMProcessFunction = createTemplates.CREATE_CALABRIO_WFM_PERSON.processFunction;
  beforeEach(() => jest.clearAllMocks());
  const row = {
    rowNumber: 10,
    attributes: {
      profile_id: 1,
      n_number: "n0263445",
      email: "e.mail@lm.com",
      emp_first_name: "Michael",
      emp_last_name: "Scott"
    },
    businessUnitId: "bu123",
    timeZone: "Americas",
    wfmFirstDayOfWeek: 1,
    wfmPersonStartDate: "2023-03-29",
    wfmTeamId: "T123",
    wfmTeamStartDate: "2023-03-29",
    wfmContractId: "C123",
    wfmContractScheduleId: "CS123",
    wfmPartTimePercentageId: "PTP123",
    wfmBudgetGroupId: "",
    wfmShiftBagId: "",
    wfmAvailabilityId: "A123",
    wfmAvailabilityStartDate: "2023-03-29",
    wfmRoleIds: [],
    wfmWorkflowControlSetId: "WFC123",
    wfmSkillIds: ["S1", "S2"],
    wfmSkillsStartDate: "2023-03-29",
    wfmRotationId: "",
    wfmRotationStartDate: "",
    wfmRotationStartWk: "",
    wfmOptionalColumns: []
  };
  describe("There is an existing WFM person with the same nnumber", () => {
    test("should reject with err", async () => {
      const nNumberDup = { ...row };
      nNumberDup.attributes.n_number = "n1111111";
      try {
        await createWFMProcessFunction(nNumberDup, initialTestState);
      } catch (err) {
        expect(createCalabrioWFMPerson).toHaveBeenCalledTimes(0);
        expect(err).toBe(JSON.stringify({
          rowNumber: 10,
          error: "Failed to create Calabrio WFM person for row 10. Calabrio WFM Record already exists with either this user's email or nNumber for row 10"
        }));
      }
    });
  });
  describe("There is an existing WFM person with the same email", () => {
    test("should reject with err", async () => {
      const emailDup = { ...row };
      emailDup.attributes.email = "Person@libertymutual.com";
      try {
        await createWFMProcessFunction(emailDup, initialTestState);
      } catch (err) {
        expect(createCalabrioWFMPerson).toHaveBeenCalledTimes(0);
        expect(err).toBe(JSON.stringify({
          rowNumber: 10,
          error: "Failed to create Calabrio WFM person for row 10. Calabrio WFM Record already exists with either this user's email or nNumber for row 10"
        }));
      }
    });
  });
  describe("environment is not production", () => {
    beforeEach(() => createCalabrioWFMPerson.mockResolvedValue("yay"));
    test("should resolve", async () => {
      row.attributes.email = "e.mail@lm.com";
      row.attributes.n_number = "n0263445";
      const result = await createWFMProcessFunction(row, initialTestState);
      expect(createCalabrioWFMPerson).toHaveBeenCalledTimes(0);
      expect(result).toEqual("No NP environment for WFM. WFM user not created for n0263445 for row 10");
    });
  });
  describe("createCalabrioWFMPerson succeeds", () => {
    beforeEach(() => createCalabrioWFMPerson.mockResolvedValue("yay"));
    test("should resolve", async () => {
      env.APP_ENV = "production";
      row.attributes.email = "e.mail@lm.com";
      row.attributes.n_number = "n0263445";
      const createTemplates = getCreateTemplates({
        ...initialTestState
      });

      const result = await createTemplates.CREATE_CALABRIO_WFM_PERSON.processFunction(row);
      expect(createCalabrioWFMPerson).toHaveBeenCalledTimes(1);
      expect(createCalabrioWFMPerson).toHaveBeenCalledWith({
        Email: "e.mail@lm.com",
        FirstName: "Michael",
        LastName: "Scott",
        BusinessUnitId: "bu123",
        TimeZoneId: "Americas",
        ApplicationLogon: "e.mail@lm.com",
        NNumber: "n0263445",
        FirstDayOfWeek: 1,
        PersonStartDate: "2023-03-29",
        TeamId: "T123",
        TeamStartDate: "2023-03-29",
        ContractId: "C123",
        ContractScheduleId: "CS123",
        PartTimePercentageId: "PTP123",
        BudgetGroupId: "",
        ShiftBagId: "",
        AvailabilityId: "A123",
        AvailabilityStartDate: "2023-03-29",
        Skills: ["S1", "S2"],
        SkillsStartDate: "2023-03-29",
        RoleIds: [],
        WorkflowControlSetId: "WFC123",
        RotationId: "",
        RotationStartDate: "",
        RotationStartWeek: "",
        OptionalColumns: []
      });
      expect(result).toEqual("Person created in Calabrio WFM for n0263445 for row 10");
    });
  });

  describe("User gateway timeout occurs while waiting for a response from adding a person in createCalabrioWFMPerson", () => {
    beforeEach(() => createCalabrioWFMPerson.mockRejectedValue({ response: { data: { exception: "com.netflix.zuul.exception.ZuulException" }}}));
    test("should reject with err message that timeout occured and user should verify creation in wfm", async () => {
      try {
        await createWFMProcessFunction(row, initialTestState);
      } catch (err) {
        expect(createCalabrioWFMPerson).toHaveBeenCalledTimes(1);
        expect(createCalabrioWFMPerson).toHaveBeenCalledWith({
          Email: "e.mail@lm.com",
          FirstName: "Michael",
          LastName: "Scott",
          BusinessUnitId: "bu123",
          TimeZoneId: "Americas",
          ApplicationLogon: "e.mail@lm.com",
          NNumber: "n0263445",
          FirstDayOfWeek: 1,
          PersonStartDate: "2023-03-29",
          TeamId: "T123",
          TeamStartDate: "2023-03-29",
          ContractId: "C123",
          ContractScheduleId: "CS123",
          PartTimePercentageId: "PTP123",
          BudgetGroupId: "",
          ShiftBagId: "",
          AvailabilityId: "A123",
          AvailabilityStartDate: "2023-03-29",
          Skills: ["S1", "S2"],
          SkillsStartDate: "2023-03-29",
          RoleIds: [],
          WorkflowControlSetId: "WFC123",
          RotationId: "",
          RotationStartDate: "",
          RotationStartWeek: "",
          OptionalColumns: []
        });
        expect(err).toBe(JSON.stringify({
          rowNumber: 10,
          error: "A timeout occured while creating WFM Person Michael Scott for row 10. They may still have been successfully added to WFM. Please verify in WFM."
        }));
      }
    });
  });

  describe("error is thrown on createCalabrioWFMPerson", () => {
    beforeEach(() => createCalabrioWFMPerson.mockRejectedValue("boo"));
    test("should reject with err", async () => {
      try {
        await createWFMProcessFunction(row, initialTestState);
      } catch (err) {
        expect(createCalabrioWFMPerson).toHaveBeenCalledTimes(1);
        expect(createCalabrioWFMPerson).toHaveBeenCalledWith({
          Email: "e.mail@lm.com",
          FirstName: "Michael",
          LastName: "Scott",
          BusinessUnitId: "bu123",
          TimeZoneId: "Americas",
          ApplicationLogon: "e.mail@lm.com",
          NNumber: "n0263445",
          FirstDayOfWeek: 1,
          PersonStartDate: "2023-03-29",
          TeamId: "T123",
          TeamStartDate: "2023-03-29",
          ContractId: "C123",
          ContractScheduleId: "CS123",
          PartTimePercentageId: "PTP123",
          BudgetGroupId: "",
          ShiftBagId: "",
          AvailabilityId: "A123",
          AvailabilityStartDate: "2023-03-29",
          Skills: ["S1", "S2"],
          SkillsStartDate: "2023-03-29",
          RoleIds: [],
          WorkflowControlSetId: "WFC123",
          RotationId: "",
          RotationStartDate: "",
          RotationStartWeek: "",
          OptionalColumns: []
        });
        expect(err).toBe(JSON.stringify({
          rowNumber: 10,
          error: "Failed to create Calabrio WFM person for row 10. boo"
        }));
      }
    });
  });
});
describe("CREATE_MANAGER", () => {
  const createManagerProcessFunction = createTemplates.CREATE_MANAGER.processFunction;
  beforeEach(() => jest.clearAllMocks());
  const row = {
    rowNumber: 2,
    "Manager N Number": "n0003232",
    parentGroupId: 200,
    attributes: {
      profile_id: 1,
      manager_first_name: "Michael",
      manager_last_name: "Scott"
    },
    groupId: 109
  };
  describe("newTeam === true", () => {
    describe("createCalabrioTeam throws an error", () => {
      test("rejected promise is returned", async () => {
        createCalabrioTeam.mockRejectedValue("Aww");
        try {
          await createManagerProcessFunction({
            newTeam: true,
            "Calabrio Team": "New Team",
            ...row
          });
        } catch (e) {
          expect(e).toBe(JSON.stringify({
            rowNumber: 2,
            error: "Failed to create Team for row 2. Aww"
          }));
        }
      });
    });
    describe("createCalabrioTeam is successful", () => {
      test("addManager is called", async () => {
        addManager.mockResolvedValue("Yay!");
        createCalabrioTeam.mockResolvedValue({
          data: {
            groupId: 300
          }
        });
        await createManagerProcessFunction({
          newTeam: true,
          "Calabrio Team": "New Team",
          ...row
        });
        expect(addManager).toHaveBeenCalledTimes(1);
        expect(addManager).toHaveBeenCalledWith({
          manager_first_nme: "Michael",
          manager_last_nme: "Scott",
          manager_n_num: "n0003232",
          profile_id: 1,
          calabrio_team_ids: JSON.stringify([300])
        });
      });
    });
  });
  describe("newTeam === false", () => {
    describe("addManager throws an error", () => {
      test("rejected promise is returned", async () => {
        addManager.mockRejectedValue("Aww!");
        try {
          await createManagerProcessFunction({
            ...row,
            newTeam: false,
            groupId: 101
          });
        } catch (e) {
          expect(addManager).toHaveBeenCalledTimes(1);
          expect(addManager).toHaveBeenCalledWith({
            manager_first_nme: "Michael",
            manager_last_nme: "Scott",
            manager_n_num: "n0003232",
            profile_id: 1,
            calabrio_team_ids: JSON.stringify([101])
          });
          expect(e).toBe(JSON.stringify({
            rowNumber: 2,
            error: "Failed to create Manager for row 2. Aww!"
          }));
        }
      });
    });
    describe("addManager is successful", () => {
      test("promise resolves", async () => {
        addManager.mockResolvedValue("Yay!!");
        await createManagerProcessFunction({
          ...row,
          newTeam: false,
          groupId: 101
        });
        expect(addManager).toHaveBeenCalledTimes(1);
        expect(addManager).toHaveBeenCalledWith({
          manager_first_nme: "Michael",
          manager_last_nme: "Scott",
          manager_n_num: "n0003232",
          profile_id: 1,
          calabrio_team_ids: JSON.stringify([101])
        });
      });
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
      const row = {
        rowNumber: 4,
        workerSid: "WK1234"
      };
      test("should call update user with correct body", async () => {
        const result = await updateWorkerAttributesProcessFunction(row, template);
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith("WK1234", {
          attributes: {
            agent_attribute_1: 3,
            profile_id: 3
          },
          operatingUnitSid: "operatingUnitSid2"
        });
        expect(result).toBe("WK1234 - Worker Attributes updated for row 4");
      });
    });
    describe("location === attributes", () => {
      const template = {
        data: {
          key: "profile_id",
          value: "1",
          location: "attributes"
        }
      };
      const row = {
        rowNumber: 4,
        workerSid: "WK1234"
      };
      test("should call update user with correct body", async () => {
        const result = await updateWorkerAttributesProcessFunction(row, template);
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith("WK1234", {
          attributes: {
            profile_id: 1,
            "agent_attribute_1": 1
          },
          operatingUnitSid: "operatingUnitSid1"
        });
        expect(result).toBe("WK1234 - Worker Attributes updated for row 4");
      });
    });
    describe("location is not of type string", () => {
      const template = {
        data: {
          key: "team",
          value: "spanish",
          location: ["attributes", "routing"]
        }
      };
      const row = {
        rowNumber: 4,
        workerSid: "WK1234",
        attributes: {
          n_number: "n1234",
          routing: {
            levels: []
          }
        }
      };
      test("key is not sales_assoc_workers should call update user with correct body", async () => {
        const result = await updateWorkerAttributesProcessFunction(row, template);
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith("WK1234", {
          attributes: {
            n_number: "n1234",
            routing: {
              levels: [],
              team: "spanish"
            }
          }
        });
        expect(result).toBe("WK1234 - Worker Attributes updated for row 4");
      });
      test("key IS sales_assoc_workers should call update user with correct body", async () => {
        template.data.key = "sales_assoc_workers";
        template.data.value = "boo, yo";
        const result = await updateWorkerAttributesProcessFunction(row, template);
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith("WK1234", {
          attributes: {
            n_number: "n1234",
            routing: {
              levels: [],
              sales_assoc_workers: ["boo", "yo"]
            }
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
      const row = {
        rowNumber: 4,
        workerSid: "WK1234"
      };
      test("should call update user with correct body", async () => {
        const result = await updateWorkerAttributesProcessFunction(row, template);
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
    const template = {
      data: {
        key: "selfServiceAtt",
        value: true,
        location: null
      }
    };
    test("should reject", async () => {
      const row = {
        rowNumber: 4,
        workerSid: "WK1234"
      };
      try {
        await updateWorkerAttributesProcessFunction(row, template);
      } catch (err) {
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(err).toBe(JSON.stringify({
          rowNumber: 4,
          error: "Failed to update Triton Worker Attributes for row 4. Aww"
        }));
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
      const row = {
        rowNumber: 4,
        attributes: {
          profile_id: 1,
          nNumber: "n0399982"
        },
        operatingUnitSid: "operatingUnitSid1",
        workerSid: "WK1234"
      };
      const template = {
        data: {
          nNumber: "n2222224"
        }
      };
      try {
        await updateUsersManagerProcessFunction(row, template, initialTestState);
      } catch (err) {
        expect(updateUser).toHaveBeenCalledTimes(0);
        expect(err).toBe(JSON.stringify({
          rowNumber: 4,
          error: "n2222224 is not a valid manager nNumber for row 4"
        }));
      }
    });
  });
  describe("error is thrown", () => {
    test("should reject", async () => {
      const row = {
        rowNumber: 4,
        workerSid: "WK1234"
      };
      try {
        await updateUsersManagerProcessFunction(row, null);
      } catch (err) {
        expect(updateUser).toHaveBeenCalledTimes(0);
        expect(JSON.parse(err).rowNumber).toBe(4);
        expect(JSON.parse(err).error).toContain("Failed to update Manager and Calabrio Team for user for row 4.");
      }
    });
  });
  describe("error is thrown from getCalabrioUser", () => {
    const row = {
      rowNumber: 4,
      attributes: {
        profile_id: 1,
        n_number: "n0000000"
      },
      operatingUnitSid: "operatingUnitSid1",
      workerSid: "WK1234"
    };
    const template = {
      data: {
        nNumber: "n1234567",
        calabrioTeamId: 105
      }
    };
    test("should reject", async () => {
      getCalabrioUser.mockRejectedValue("Aww");
      try {
        await updateUsersManagerProcessFunction(row, template);
      } catch (err) {
        expect(updateUser).toHaveBeenCalledTimes(0);
        expect(JSON.parse(err).rowNumber).toBe(4);
        expect(JSON.parse(err).error).toContain("No updates made, Failed to fetch calabrio user for row 4. Aww");
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
          rowNumber: 4,
          attributes: {
            n_number: "n13548"
          },
          workerSid: "WK1234"
        };
        const template = {
          data: {
            nNumber: "n1234567",
            calabrioTeamId: 105
          }
        };
        try {
          await updateUsersManagerProcessFunction(row, template, initialTestState);
        } catch (err) {
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
          expect(err).toBe(JSON.stringify({
            rowNumber: 4,
            error: "Errors thrown for row 4. No Calabrio record found."
          }));
        }
      });
    });
    describe("userCalabrioRecord is null", () => {
      test("manager will be updated, calabrio team will not", async () => {
        const row = {
          rowNumber: 4,
          attributes: {
            n_number: "n1111111"
          },
          workerSid: "WK1234"
        };
        const template = {
          data: {
            nNumber: "n1234567",
            calabrioTeamId: 105
          }
        };
        try {
          await updateUsersManagerProcessFunction(row, template, initialTestState);
        } catch (err) {
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
          expect(err).toBe(JSON.stringify({
            rowNumber: 4,
            error: "Errors thrown for row 4. No Calabrio record found."
          }));
        }
      });
    });
    describe("userTritonRecord && userCalabrioRecord are not null", () => {
      test("manager will be updated, calabrio team will not", async () => {
        const row = {
          rowNumber: 4,
          attributes: {
            profile_id: 1,
            n_number: "n0000000"
          },
          operatingUnitSid: "operatingUnitSid1",
          workerSid: "WK1234"
        };
        const template = {
          data: {
            nNumber: "n1234567",
            calabrioTeamId: 105
          }
        };
        const results = await updateUsersManagerProcessFunction(row, template, initialTestState);
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
        rowNumber: 4,
        attributes: {
          n_number: "n0000000"
        },
        workerSid: "WK1234"
      };
      const template = {
        data: {
          nNumber: "n1234567",
          calabrioTeamId: 105
        }
      };
      try {
        await updateUsersManagerProcessFunction(row, template, initialTestState);
      } catch (err) {
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
        expect(err).toBe(JSON.stringify({
          rowNumber: 4,
          error: "Errors thrown for row 4. boo"
        }));
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
        rowNumber: 4,
        attributes: {
          n_number: "n0000000"
        },
        workerSid: "WK1234"
      };
      const template = {
        data: {
          nNumber: "n1234567",
          calabrioTeamId: 105
        }
      };
      try {
        await updateUsersManagerProcessFunction(row, template, initialTestState);
      } catch (err) {
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
        expect(err).toBe(JSON.stringify({
          rowNumber: 4,
          error: "Errors thrown for row 4. boo"
        }));
      }
    });
  });
});
describe("UPDATE_DEFAULT_SKILLS", () => {
  const updateDefaultSkillsProcessFunction = updateTemplates.UPDATE_DEFAULT_SKILLS.processFunction;
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("updateUser is successful", () => {
    beforeEach(() => updateUser.mockResolvedValue("Wowee!"));
    describe("add skill", () => {
      const template = {
        data: {
          key: "default_skills",
          value: {
            skills: ["skillz"],
            levels: {
              skillz: 1
            }
          },
          option: {
            label: "Add Skill",
            value: "ADD"
          }
        }
      };
      const row = {
        rowNumber: 4,
        workerSid: "WK1234",
        attributes: {
          default_skills: {
            skills: ["currentSkill"],
            levels: {}
          }
        }
      };
      test("should call updateUser with correct body", async () => {
        const result = await updateDefaultSkillsProcessFunction(row, template);
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith("WK1234", {
          attributes: {
            default_skills: {
              levels: {
                skillz: 1
              },
              skills: ["currentSkill", "skillz"]
            }
          }
        });
        expect(result).toBe("WK1234 - Default Skills updated for row 4");
      });
    });
    describe("override skill", () => {
      const template = {
        data: {
          key: "default_skills",
          value: {
            skills: ["skillz"],
            levels: {
              skillz: 1
            }
          },
          option: {
            label: "Override Skill",
            value: "OVERRIDE"
          }
        }
      };
      const row = {
        rowNumber: 4,
        workerSid: "WK1234",
        attributes: {
          default_skills: {
            skills: ["currentSkill"],
            levels: {}
          }
        }
      };
      test("should call updateUser with correct body", async () => {
        const result = await updateDefaultSkillsProcessFunction(row, template);
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith("WK1234", {
          attributes: {
            default_skills: {
              levels: {
                skillz: 1
              },
              skills: ["skillz"]
            }
          }
        });
        expect(result).toBe("WK1234 - Default Skills updated for row 4");
      });
    });
    describe("delete skill", () => {
      const template = {
        data: {
          key: "default_skills",
          value: {
            skills: ["deleteThis"],
            levels: {
              deleteThis: 1
            }
          },
          option: {
            label: "Delete Skill",
            value: "DELETE"
          }
        }
      };
      const row = {
        rowNumber: 4,
        workerSid: "WK1234",
        attributes: {
          default_skills: {
            skills: ["currentSkill", "deleteThis"],
            levels: {
              deleteThis: 1,
              currentSkill: 4
            }
          }
        }
      };
      test("should call updateUser with correct body", async () => {
        const result = await updateDefaultSkillsProcessFunction(row, template);
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith("WK1234", {
          attributes: {
            default_skills: {
              levels: {
                currentSkill: 4
              },
              skills: ["currentSkill"]
            }
          }
        });
        expect(result).toBe("WK1234 - Default Skills updated for row 4");
      });
    });
  });
  describe("updateUser throws an error", () => {
    beforeEach(() => updateUser.mockRejectedValue("Aww"));
    const template = {
      data: {
        key: "default_skills",
        value: {
          skills: ["deleteThis"],
          levels: {
            deleteThis: 1
          }
        },
        option: {
          label: "Delete Skill",
          value: "DELETE"
        }
      }
    };
    const row = {
      rowNumber: 4,
      workerSid: "WK1234",
      attributes: {
        default_skills: {
          skills: ["currentSkill", "deleteThis"],
          levels: {
            deleteThis: 1
          }
        }
      }
    };
    test("should reject", async () => {
      try {
        await updateDefaultSkillsProcessFunction(row, template);
      } catch (err) {
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(err).toBe(JSON.stringify({
          rowNumber: 4,
          error: "Failed to update Default Skills for row 4. Aww"
        }));
      }
    });
  });
});
describe("UPDATE_CALLER_STATES", () => {
  const updateCallerStatesProcessFunction = updateTemplates.UPDATE_CALLER_STATES.processFunction;
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("updateUser is successful", () => {
    beforeEach(() => updateUser.mockResolvedValue("Wowee!"));
    describe("add caller states", () => {
      const template = { // Transaction
        data: {
          key: "Not used",
          value: [
            CallerStateAttrDropDownOptions[1],
            CallerStateAttrDropDownOptions[2]
          ],
          option: {
            label: "Add Caller State(s)",
            value: "ADD"
          }
        }
      };
      const row = { // Current attributes
        rowNumber: 4,
        workerSid: "WK1234",
        attributes: {
          routing: {
            callerStates: [CallerStateAttrDropDownOptions[0].value]
          }
        }
      };
      test("should call updateUser with correct body", async () => {
        const result = await updateCallerStatesProcessFunction(row, template);
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith("WK1234", {
          attributes: {
            routing: {
              callerStates: [
                CallerStateAttrDropDownOptions[0].value,
                CallerStateAttrDropDownOptions[1].value,
                CallerStateAttrDropDownOptions[2].value
              ]
            }
          }
        });
        expect(result).toBe("WK1234 - Caller States updated for row 4");
      });
    });
    describe("override caller states", () => {
      const template = {
        data: {
          key: "Not used",
          value: [
            CallerStateAttrDropDownOptions[15],
            CallerStateAttrDropDownOptions[16],
            CallerStateAttrDropDownOptions[17]
          ],
          option: {
            label: "Add Caller State(s)",
            value: "OVERRIDE"
          }
        }
      };
      const row = {
        rowNumber: 4,
        workerSid: "WK1234",
        attributes: {
          routing: {
            callerStates: ["AK"]
          }
        }
      };
      test("should call updateUser with correct body", async () => {
        const result = await updateCallerStatesProcessFunction(row, template);
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith("WK1234", {
          attributes: {
            routing: {
              callerStates: [
                CallerStateAttrDropDownOptions[15].value,
                CallerStateAttrDropDownOptions[16].value,
                CallerStateAttrDropDownOptions[17].value
              ]
            }
          }
        });
        expect(result).toBe("WK1234 - Caller States updated for row 4");
      });
    });
    describe("delete caller states", () => {
      const template = {
        data: {
          key: "Not used",
          value: [
            CallerStateAttrDropDownOptions[15],
            CallerStateAttrDropDownOptions[17]
          ],
          option: {
            label: "Delete Caller State(s)",
            value: "DELETE"
          }
        }
      };
      const row = {
        rowNumber: 4,
        workerSid: "WK1234",
        attributes: {
          routing: {
            callerStates: [
              CallerStateAttrDropDownOptions[15].value,
              CallerStateAttrDropDownOptions[16].value,
              CallerStateAttrDropDownOptions[17].value
            ]
          }
        }
      };
      test("should call updateUser with correct body", async () => {
        const result = await updateCallerStatesProcessFunction(row, template);
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith("WK1234", {
          attributes: {
            routing: {
              callerStates: [
                CallerStateAttrDropDownOptions[16].value
              ]
            }
          }
        });
        expect(result).toBe("WK1234 - Caller States updated for row 4");
      });
    });
  });
  describe("update user fails", () => {
    describe("ADD should fail with an appropriate message", () => {
      beforeEach(() => updateUser.mockRejectedValue("I did a digital face-plant"));
      const template = { // Transaction
        data: {
          key: "Not used",
          value: [
            CallerStateAttrDropDownOptions[1],
            CallerStateAttrDropDownOptions[2]
          ],
          option: {
            label: "Add Caller State(s)",
            value: "ADD"
          }
        }
      };
      const row = { // Current attributes
        rowNumber: 4,
        workerSid: "WK1234",
        attributes: {
          routing: {
            callerStates: [CallerStateAttrDropDownOptions[0].value]
          }
        }
      };
      test("ADD should fail", async () => {
        try {
          await updateCallerStatesProcessFunction(row, template);
          expect("I should").toBe("never get here");
        } catch (err) {
          expect(updateUser).toHaveBeenCalledTimes(1);
          expect(updateUser).toHaveBeenCalledWith("WK1234", {
            attributes: {
              routing: {
                callerStates: [
                  CallerStateAttrDropDownOptions[0].value,
                  CallerStateAttrDropDownOptions[1].value,
                  CallerStateAttrDropDownOptions[2].value
                ]
              }
            }
          });
          expect(err).toBe(JSON.stringify({
            rowNumber: 4,
            error: "Failed to update Caller States for row 4. I did a digital face-plant"
          }));
        }
      });
    });
  });
});
describe("SYNC_HR_ATTRIBUTES", () => {
  const syncHrAttributesProcessFunction = updateTemplates.SYNC_HR_ATTRIBUTES.processFunction;
  beforeEach(() => jest.clearAllMocks());
  describe("sync is not needed", () => {
    const row = {
      rowNumber: 4,
      workerSid: "WK1234",
      "N Number": "n0263786",
      attributes: {
        primary_dept_number: "CRC"
      },
      originalWorker: {
        attributes: {
          primary_dept_number: "CRC"
        }
      }
    };
    test("should call update user with correct body", async () => {
      const result = await syncHrAttributesProcessFunction(row);
      expect(updateUser).toHaveBeenCalledTimes(0);
      expect(result).toBe("Sync not required for row 4. WK1234 : n0263786.");
    });
  });
  describe("sync is needed", () => {
    describe("primary_dept_number does not match", () => {
      beforeEach(() => updateUser.mockResolvedValue("Yay!"));
      const row = {
        rowNumber: 4,
        workerSid: "WK1234",
        attributes: {
          primary_dept_number: "CRC",
          n_number: "n0263786"
        },
        originalWorker: {
          attributes: {
            primary_dept_number: "DRC"
          }
        }
      };
      test("should call update user with correct body", async () => {
        const result = await syncHrAttributesProcessFunction(row);
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith("WK1234", {
          attributes: {
            primary_dept_number: "CRC",
            n_number: "n0263786"
          }
        });
        expect(result).toBe("Successfully synced worker for row 4. WK1234 : undefined.");
      });
    });
    describe("updateUser throws an error", () => {
      beforeEach(() => updateUser.mockRejectedValue("Aww"));
      test("should reject", async () => {
        const row = {
          rowNumber: 4,
          workerSid: "WK1234",
          "N Number": "n0263786",
          attributes: {
            primary_dept_number: "CRC",
            n_number: "n0263786"
          },
          originalWorker: {
            attributes: {
              primary_dept_number: "DRC"
            }
          }
        };
        try {
          await syncHrAttributesProcessFunction(row);
        } catch (err) {
          expect(updateUser).toHaveBeenCalledTimes(1);
          expect(err).toBe(JSON.stringify({
            rowNumber: 4,
            error: "Failed to sync worker for row 4. WK1234 : n0263786. Aww"
          }));
        }
      });
    });
  });
});