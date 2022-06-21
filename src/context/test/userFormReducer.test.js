import {
  initialUserFormState,
  userFormActions,
  userFormReducer
} from "context";
import { formModes } from "globals";
import {
  managerList,
  mockWorkers,
  profileList,
  validFormOptions
} from "testUtils";
import {
  formatE164PhoneNumber,
  getValidSkillsObject
} from "utils";
import { ExtensionSearchStatuses } from "../../components/usermanagement/UserEntryForm/UserEntryForm.Interfaces";
import { SearchParams } from "../../components/usermanagement/UserEntryForm/ExtensionSearchParams";
const searchParams = SearchParams.getValues();

describe("userFormReducer", () => {

  describe("Default Case", () => {
    test("should return state", () => {
      const action = { type: "default" };
      const result = userFormReducer(initialUserFormState, action);
      expect(result).toStrictEqual(initialUserFormState);
    });
  });

  describe("ASSIGN_EXTENSION", () => {
    test("should change searchStatus state", () => {
      const action = { type: userFormActions.ASSIGN_EXTENSION };
      const initialTestState = {
        ...initialUserFormState,
        extension: {
          ...initialUserFormState.extension
        },
        extensionStatus: {
          ...initialUserFormState.extensionStatus
        }
      };
      const result = userFormReducer(initialTestState, action);
      const expectedFormState = {
        ...initialTestState,
        extensionStatus: {
          ...initialTestState.extensionStatus,
          searchStatus: ExtensionSearchStatuses.PickANumber,
          message: "Searching..."
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("CLEAR_EXTENSION", () => {
    test("should clear extension", () => {
      const action = { type: userFormActions.CLEAR_EXTENSION };
      const initialTestState = {
        ...initialUserFormState,
        extension: {
          ...initialUserFormState.extension,
          value: validFormOptions.extension,
          blurred: true,
          updated: true,
          valid: true
        }
      };
      const result = userFormReducer(initialTestState, action);
      const expectedFormState = {
        ...initialTestState,
        extension: {
          ...initialTestState.extension,
          value: "",
          valid: false
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("CLEAR_N_NUMBER", () => {
    test("should clear nNumber", () => {
      const action = { type: userFormActions.CLEAR_N_NUMBER };
      const startingFormState = {
        ...initialUserFormState,
        nNumber: {
          ...initialUserFormState.nNumber,
          value: "n0263786"
        },
        nNumberFetchedUser: {
          firstName: "Faith",
          lastName: "Cuneo"
        }
      };
      const result = userFormReducer(startingFormState, action);
      expect(result).toStrictEqual(initialUserFormState);
    });
  });

  describe("CLEAR_OUTGOING_NUMBER", () => {
    const action = { type: userFormActions.CLEAR_OUTGOING_NUMBER };
    const startingFormState = {
      ...initialUserFormState,
      outgoing: {
        whatever: "who cares",
        stuff: "we're gonna clear out"
      }
    };
    test("should clear Outgoing Number", () => {
      expect(userFormReducer(startingFormState, action)).toStrictEqual(initialUserFormState);
    });
  });

  describe("COMPLETE_N_NUMBER", () => {
    test("should update fetched user", () => {
      const payload = {
        nNumber: "n0263786",
        fetchedUser: {
          firstName: "Faith",
          lastName: "Cuneo"
        }
      };
      const action = {
        type: userFormActions.COMPLETE_N_NUMBER,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        nNumber: {
          ...initialUserFormState.nNumber,
          value: payload.nNumber
        },
        nNumberFetchedUser: payload.fetchedUser
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("EDIT_PEN_CLICK_FORWARD_TO_TOGGLE", () => {
    test("should set forward to toggle fields", () => {
      const payload = mockWorkers[2];
      const action = {
        type: userFormActions.EDIT_PEN_CLICK_FORWARD_TO_TOGGLE,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        directDialNum: {
          ...initialUserFormState.directDialNum,
          value: formatE164PhoneNumber(mockWorkers[2].directDialNum),
          valid: true
        },
        outgoing: {
          ...initialUserFormState.outgoing,
          value: formatE164PhoneNumber(mockWorkers[2].attributes.did),
          valid: true
        },
        editDisabled: !initialUserFormState.editDisabled
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("EDIT_PEN_CLICK_NO_FORWARD_TO_TOGGLE", () => {
    test("should reset forward to toggle", () => {
      const action = { type: userFormActions.EDIT_PEN_CLICK_NO_FORWARD_TO_TOGGLE };
      const initialTestState = {
        ...initialUserFormState,
        directDialNum: {
          ...initialUserFormState.directDialNum,
          value: formatE164PhoneNumber(mockWorkers[2].directDialNum),
          valid: true
        },
        outgoing: {
          ...initialUserFormState.outgoing,
          value: formatE164PhoneNumber(mockWorkers[2].attributes.did),
          valid: true
        },
        editDisabled: true
      };
      const result = userFormReducer(initialTestState, action);
      expect(result).toStrictEqual({
        ...initialTestState,
        editDisabled: !initialTestState.editDisabled
      });
    });
  });

  describe("INITIATE_DID_FIELDS - DID User", () => {
    test("should initiate DID fields", () => {
      const action = { type: userFormActions.INITIATE_DID_FIELDS };
      const result = userFormReducer({
        ...initialUserFormState,
        didUser: true
      }, action);
      const expectedFormState = {
        ...initialUserFormState,
        didUser: false,
        zeroOutEnabled: false
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("INITIATE_DID_FIELDS - NonDID User", () => {
    test("should initiate DID fields and zeroOutEnabled should remain unchanged - false", () => {
      const action = { type: userFormActions.INITIATE_DID_FIELDS };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        didUser: true,
        zeroOutEnabled: false
      };
      expect(result).toStrictEqual(expectedFormState);
    });
    test("should initiate DID fields and zeroOutEnabled should remain unchanged - true", () => {
      const action = { type: userFormActions.INITIATE_DID_FIELDS };
      const result = userFormReducer({
        ...initialUserFormState,
        zeroOutEnabled: true
      }, action);
      const expectedFormState = {
        ...initialUserFormState,
        didUser: true,
        zeroOutEnabled: true
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("INITIATE_ZERO_OUT_FIELDS", () => {
    describe("zeroOutEnabled === false", () => {
      test("should set zeroOutEnabled to true", () => {
        const action = { type: userFormActions.INITIATE_ZERO_OUT_FIELDS };
        const result = userFormReducer(initialUserFormState, action);
        const expectedFormState = {
          ...initialUserFormState,
          zeroOutEnabled: true,
          zeroOutEnabledUpdated: true
        };
        expect(result).toStrictEqual(expectedFormState);
      });
    });
    describe("zeroOutEnabled === true", () => {
      test("should initiate zero out fields", () => {
        const action = { type: userFormActions.INITIATE_ZERO_OUT_FIELDS };
        const result = userFormReducer({
          ...initialUserFormState,
          zeroOutEnabled: true
        }, action);
        const expectedFormState = {
          ...initialUserFormState,
          zeroOutEnabled: false,
          zeroOutEnabledUpdated: true
        };
        expect(result).toStrictEqual(expectedFormState);
      });
    });
  });

  describe("RESET_FORM", () => {
    test("should reset form to initial state", () => {
      const initialTestState = {
        ...initialUserFormState,
        profileId: {
          value: "2"
        }
      };
      const action = { type: userFormActions.RESET_FORM };
      const result = userFormReducer(initialTestState, action);
      expect(result).toStrictEqual(initialUserFormState);
    });
  });

  describe("RESET_FORM_AFTER_ADD", () => {
    const managerValue = "Jimini Cricket";
    const profileIdValue = "42";
    const updatedOutgoingValues = {
      value: "8007654321",
      e164: "+18007654321"
    };
      // setting blurred & updated to the opposite of what we expect after the action
    const blurred = true;
    const updated = false;
    const initialTestState = {
      ...initialUserFormState,
      manager: {
        value: managerValue,
        blurred,
        updated
      },
      outgoing: {
        value: updatedOutgoingValues.value,
        e164: updatedOutgoingValues.e164,
        blurred,
        updated,
        valid: false
      },
      profileId: {
        value: profileIdValue,
        blurred,
        updated
      },
      // randomly selected values that we expect the action to reset
      extension: {
        value: "not blank",
        blurred: true,
        updated: true,
        valid: true
      },
      directDialNum: {
        value: "a thousand",
        blurred: true,
        e164: "shoelaces",
        updated: true,
        valid: true
      },
      zeroOutEnabled: true
    };
    test("should reset all form fields except Manager, Team & Outbound Number", () => {
      const managerValue = "Jimini Cricket";
      const profileIdValue = "42";
      const updatedOutgoingValues = {
        value: "8007654321",
        e164: "+18007654321"
      };
      // setting blurred & updated to the opposite of what we expect after the action
      const blurred = true;
      const updated = false;
      const initialTestState = {
        ...initialUserFormState,
        manager: {
          value: managerValue,
          blurred,
          updated
        },
        outgoing: {
          value: updatedOutgoingValues.value,
          e164: updatedOutgoingValues.e164,
          blurred,
          updated,
          valid: false
        },
        profileId: {
          value: profileIdValue,
          blurred,
          updated
        },
        // randomly selected values that we expect the action to reset
        extension: {
          value: "not blank",
          blurred: true,
          updated: true,
          valid: true
        },
        directDialNum: {
          value: "a thousand",
          blurred: true,
          e164: "shoelaces",
          updated: true,
          valid: true
        },
        zeroOutEnabled: true
      };
      const action = {
        type: userFormActions.RESET_FORM_AFTER_ADD,
        payload: {
          managerValue,
          profileIdValue,
          outgoing: {
            value: updatedOutgoingValues.value,
            e164: updatedOutgoingValues.e164
          },
          didUser: false
        }
      };
      expect(userFormReducer(initialTestState, action)).toStrictEqual({
        ...initialUserFormState,
        manager: {
          value: managerValue,
          blurred: false,
          updated: true
        },
        outgoing: {
          value: updatedOutgoingValues.value,
          blurred: false,
          e164: updatedOutgoingValues.e164,
          updated: true,
          valid: true
        },
        profileId: {
          value: profileIdValue,
          blurred: false,
          updated: true
        }
      });
    });
    test("should reset all form fields except Manager, Team & DID Toggle", () => {
      const action = {
        type: userFormActions.RESET_FORM_AFTER_ADD,
        payload: {
          managerValue,
          profileIdValue,
          outgoing: {
            value: updatedOutgoingValues.value,
            e164: updatedOutgoingValues.e164
          },
          didUser: true
        }
      };
      expect(userFormReducer(initialTestState, action)).toStrictEqual({
        ...initialUserFormState,
        didUser: true,
        manager: {
          value: managerValue,
          blurred: false,
          updated: true
        },
        outgoing: {
          value: "",
          blurred: false,
          e164: undefined,
          updated: true,
          valid: true
        },
        profileId: {
          value: profileIdValue,
          blurred: false,
          updated: true
        }
      });
    });
  });

  describe("SET_BLUR_ON_FIELD", () => {
    test("should reset field blurred property to true", () => {
      const payload = "outgoing";
      const action = {
        type: userFormActions.SET_BLUR_ON_FIELD,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        outgoing: {
          ...initialUserFormState.outgoing,
          blurred: true
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("SET_EXTENSION_MESSAGE", () => {
    test("SET_EXTENSION_MESSAGE should update message", () => {
      const testMessage = "Test message";
      const action = {
        type: userFormActions.SET_EXTENSION_MESSAGE,
        payload: {
          message: testMessage,
          isError: false
        }
      };
      const initialTestState = {
        ...initialUserFormState
      };
      const result = userFormReducer(initialTestState, action);
      const expectedFormState = {
        ...initialTestState,
        extensionStatus: {
          ...initialTestState.extensionStatus,
          message: testMessage,
          isError: false
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("SET_EXTENSION_RETRIES", () => {
    test("SET_EXTENSION_RETRIES should decrement retriesRemaining", () => {
      const action = { type: userFormActions.SET_EXTENSION_RETRIES };
      const initialTestState = {
        ...initialUserFormState,
        extensionStatus: {
          ...initialUserFormState.extensionStatus,
          searchStatus: ExtensionSearchStatuses.PickANumber,
          retriesRemaining: 3
        }
      };
      const result = userFormReducer(initialTestState, action);
      const expectedFormState = {
        ...initialTestState,
        extensionStatus: {
          ...initialTestState.extensionStatus,
          retriesRemaining: 2
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("SET_EXTENSION_VERIFIED", () => {
    test("SET_EXTENSION_VERIFIED reset search params and a verified message", () => {
      const action = { type: userFormActions.SET_EXTENSION_VERIFIED };
      const initialTestState = {
        ...initialUserFormState,
        extensionStatus: {
          ...initialUserFormState.extensionStatus,
          searchStatus: ExtensionSearchStatuses.PickANumber,
          retriesRemaining: 1,
          message: "Some message",
          isError: true
        }
      };
      const result = userFormReducer(initialTestState, action);
      const expectedFormState = {
        ...initialTestState,
        extensionStatus: {
          ...initialTestState.extensionStatus,
          searchStatus: ExtensionSearchStatuses.Idle,
          retriesRemaining: searchParams.MaxRetries,
          message: "Verified",
          isError: false
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("SET_UPDATE_FORM_STATE for DID User", () => {
    test("should reset form to update state", () => {
      const worker = mockWorkers[2];
      const payload = {
        worker,
        managers: managerList
      };
      const action = {
        type: userFormActions.SET_UPDATE_FORM_STATE,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        formMode: formModes.UPDATE,
        defaultSkills: getValidSkillsObject(worker.attributes.default_skills),
        extension: {
          ...initialUserFormState.extension,
          value: worker.attributes.extension,
          valid: true
        },
        extensionStatus: {
          ...initialUserFormState.extensionStatus,
          originalExtension: worker.attributes.extension || ""
        },
        manager: {
          ...initialUserFormState.manager,
          value: JSON.stringify(managerList.find(m => m.manager_n_number === worker.attributes.manager_n_number))
        },
        nNumber: {
          ...initialUserFormState.nNumber,
          value: "n"
        },
        outgoing: {
          ...initialUserFormState.outgoing,
          value: formatE164PhoneNumber(worker.attributes.did),
          valid: true
        },
        profileId: {
          ...initialUserFormState.profileId,
          value: worker.attributes.profile_id
        },
        alternateDid: {
          ...initialUserFormState.alternateDid,
          value: formatE164PhoneNumber(worker.alternateDid),
          valid: true
        },
        directDialNum: {
          ...initialUserFormState.directDialNum,
          value: formatE164PhoneNumber(worker.directDialNum),
          valid: true
        },
        didUser: true,
        zeroOutEnabled: worker.zeroOutEnabled,
        editDisabled: true
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("SET_UPDATE_FORM_STATE for NonDID User", () => {
    test("should reset form to update state", () => {
      const worker = mockWorkers[0];
      const payload = {
        worker,
        formMode: formModes.UPDATE,
        managers: managerList
      };
      const action = {
        type: userFormActions.SET_UPDATE_FORM_STATE,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        formMode: payload.formMode,
        defaultSkills: getValidSkillsObject(worker.attributes.default_skills),
        extension: {
          ...initialUserFormState.extension,
          value: "",
          valid: true
        },
        manager: {
          ...initialUserFormState.manager,
          value: JSON.stringify(managerList.find(m => m.manager_n_number === worker.attributes.manager_n_number))
        },
        profileId: {
          ...initialUserFormState.profileId,
          value: worker.attributes.profile_id
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("SET_USER_PREVIOUSLY_ADDED_TRUE", () => {
    const action = { type: userFormActions.SET_USER_PREVIOUSLY_ADDED_TRUE };
    test("should set userPreviouslyAdded to true", () => {
      expect(userFormReducer(initialUserFormState, action)).toStrictEqual({
        ...initialUserFormState,
        userPreviouslyAdded: true
      });
    });
  });

  describe("UPDATE_DEFAULT_SKILLS", () => {
    test("should update default skills", () => {
      const payload = mockWorkers[0].default_skills;
      const action = {
        type: userFormActions.UPDATE_DEFAULT_SKILLS,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        defaultSkillsUpdated: true,
        defaultSkills: payload
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("UPDATE_EXTENSION", () => {
    test("should update extension", () => {
      const payload = {
        extension: validFormOptions.extension,
        isValid: true
      };
      const action = {
        type: userFormActions.UPDATE_EXTENSION,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState ={
        ...initialUserFormState,
        extension: {
          ...initialUserFormState.extension,
          value: validFormOptions.extension,
          blurred: payload.isValid,
          updated: true,
          valid: payload.isValid
        },
        extensionStatus: {
          ...initialUserFormState.extensionStatus,
          message: "Extension is valid",
          searchStatus: ExtensionSearchStatuses.Idle,
          retriesRemaining: 5
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("UPDATE_INACTIVE_FORWARD_TO", () => {
    test("should update inactive forward to", () => {
      const payload = "WK1231112";
      const action = {
        type: userFormActions.UPDATE_INACTIVE_FORWARD_TO,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState ={
        ...initialUserFormState,
        inactiveForwardTo: {
          value: payload,
          updated: true
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("UPDATE_MANAGER", () => {
    test("should update manager", () => {
      const payload = {
        manager_first_name: "Rebecca",
        manager_last_name: "Miller",
        manager_n_number: "n0001234"
      };
      const action = {
        type: userFormActions.UPDATE_MANAGER,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        manager: {
          ...initialUserFormState.manager,
          value: payload,
          updated: true
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("UPDATE_N_NUMBER", () => {
    test("should update nNumber", () => {
      const payload = "n0263786";
      const action = {
        type: userFormActions.UPDATE_N_NUMBER,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        nNumber: {
          ...initialUserFormState.nNumber,
          value: payload,
          updated: true
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("UPDATE_PHONE_NUMBER with e164", () => {
    test("should update phone number", () => {
      const payload = {
        field: "outgoing",
        maskedValue: "(603) 851-8200",
        isValid: true,
        e164Number: "+16038518200"
      };
      const action = {
        type: userFormActions.UPDATE_PHONE_NUMBER,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        outgoing: {
          ...initialUserFormState.outgoing,
          value: payload.maskedValue,
          e164: payload.e164Number,
          updated: true,
          valid: true
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("UPDATE_PHONE_NUMBER without e164", () => {
    test("should update phone number", () => {
      const payload = {
        field: "outgoing",
        maskedValue: "(603) 851-8200",
        isValid: true,
        e164Number: ""
      };
      const action = {
        type: userFormActions.UPDATE_PHONE_NUMBER,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        outgoing: {
          ...initialUserFormState.outgoing,
          value: payload.maskedValue,
          e164: payload.e164Number,
          updated: true
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("UPDATE_TEAM", () => {
    describe("Profile is updated from a profile without a zero out skill to one with a zero out skill", () => {
      test("should update team and set zeroOutEnabled to true", () => {
        const payload = {
          profileId: profileList[1].profile_id,
          profiles: profileList
        };
        const action = {
          type: userFormActions.UPDATE_TEAM,
          payload
        };
        const initialTestState = {
          ...initialUserFormState,
          profileId: {
            ...initialUserFormState.profileId,
            value: profileList[0].profile_id
          }
        };
        const result = userFormReducer(initialTestState, action);
        const expectedFormState = {
          ...initialUserFormState,
          profileId: {
            ...initialUserFormState.profileId,
            value: payload.profileId,
            updated: true
          },
          zeroOutEnabled: true
        };
        expect(result).toStrictEqual(expectedFormState);
      });
    });
    describe("Profile is updated from a profile with a zero out skill to one without", () => {
      test("should update team and set zeroOutEnabled to false", () => {
        const payload = {
          profileId: profileList[0].profile_id,
          profiles: profileList
        };
        const action = {
          type: userFormActions.UPDATE_TEAM,
          payload
        };
        const initialTestState = {
          ...initialUserFormState,
          profileId: {
            ...initialUserFormState.profileId,
            value: profileList[1].profile_id
          }
        };
        const result = userFormReducer(initialTestState, action);
        const expectedFormState = {
          ...initialUserFormState,
          profileId: {
            ...initialUserFormState.profileId,
            value: payload.profileId,
            updated: true
          },
          zeroOutEnabled: false
        };
        expect(result).toStrictEqual(expectedFormState);
      });
    });
  });
});
