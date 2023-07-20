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
  validFormOptions,
  initialTestState
} from "testUtils";
import {
  formatE164PhoneNumber,
  getValidSkillsObject
} from "utils";
import { ExtensionSearchStatuses } from "components/tabs/usermanagement/OnboardNewUser/Extension/ExtensionInput/ExtensionInput.Interfaces";
import { SearchParams } from "components/tabs/usermanagement/OnboardNewUser/Extension/ExtensionSearchParams";
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
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        triton: {
          ...initialUserFormState.triton,
          extension: {
            ...initialUserFormState.triton.extension,
            status: {
              ...initialUserFormState.triton.extension.status,
              searchStatus: ExtensionSearchStatuses.PickANumber,
              message: "Searching..."
            }
          }
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("CHECK_CALABRIO_GROUP", () => {
    const calabrioGroups = [
      {
        id: 1,
        checked: false,
        partial: false
      },
      {
        id: 2,
        checked: false,
        partial: false
      },
      {
        id: 3,
        checked: false,
        partial: false
      }
    ];
    describe("checked box checked", () => {
      const payload = {
        index: 1,
        boxType: "checked",
        checked: true
      };
      test("should change calabrio group state", () => {
        const action = {
          type: userFormActions.CHECK_CALABRIO_GROUP,
          payload
        };
        const initialTestState = {
          ...initialUserFormState,
          calabrio_qm: {
            ...initialUserFormState.calabrio_qm,
            scope: {
              ...initialUserFormState.calabrio_qm.scope,
              groups: calabrioGroups
            }
          }
        };
        const result = userFormReducer(initialTestState, action);
        const expectedFormState = {
          ...initialUserFormState,
          calabrio_qm: {
            ...initialTestState.calabrio_qm,
            updated: true,
            scope: {
              ...initialTestState.calabrio_qm.scope,
              groups: [
                {
                  id: 1,
                  checked: false,
                  partial: false
                },
                {
                  id: 2,
                  checked: true,
                  partial: false
                },
                {
                  id: 3,
                  checked: false,
                  partial: false
                }
              ]
            }
          }
        };
        expect(result).toStrictEqual(expectedFormState);
      });
    });
    describe("partial box checked", () => {
      const payload = {
        index: 0,
        boxType: "partial",
        checked: true
      };
      test("should change calabrio group state", () => {
        const action = {
          type: userFormActions.CHECK_CALABRIO_GROUP,
          payload
        };
        const initialTestState = {
          ...initialUserFormState,
          calabrio_qm: {
            ...initialUserFormState.calabrio_qm,
            scope: {
              ...initialUserFormState.calabrio_qm.scope,
              groups: calabrioGroups
            }
          }
        };
        const result = userFormReducer(initialTestState, action);
        const expectedFormState = {
          ...initialUserFormState,
          calabrio_qm: {
            ...initialTestState.calabrio_qm,
            updated: true,
            scope: {
              ...initialTestState.calabrio_qm.scope,
              groups: [
                {
                  id: 1,
                  checked: false,
                  partial: true
                },
                {
                  id: 2,
                  checked: true, //state carries from prevous test
                  partial: false
                },
                {
                  id: 3,
                  checked: false,
                  partial: false
                }
              ]
            }
          }
        };
        expect(result).toStrictEqual(expectedFormState);
      });
    });
  });

  describe("CHECK_CALABRIO_TEAM", () => {
    const calabrioTeams = [
      {
        id: 1,
        checked: false
      },
      {
        id: 2,
        checked: false
      },
      {
        id: 3,
        checked: false
      }
    ];
    describe("checked box checked", () => {
      const payload = {
        index: 1,
        checked: true
      };
      test("should change calabrio team state", () => {
        const action = {
          type: userFormActions.CHECK_CALABRIO_TEAM,
          payload
        };
        const initialTestState = {
          ...initialUserFormState,
          calabrio_qm: {
            ...initialUserFormState.calabrio_qm,
            scope: {
              ...initialUserFormState.calabrio_qm.scope,
              teams: calabrioTeams
            }
          }
        };
        const result = userFormReducer(initialTestState, action);
        const expectedFormState = {
          ...initialUserFormState,
          calabrio_qm: {
            ...initialTestState.calabrio_qm,
            updated: true,
            scope: {
              ...initialTestState.calabrio_qm.scope,
              teams: [
                {
                  id: 1,
                  checked: false
                },
                {
                  id: 2,
                  checked: true
                },
                {
                  id: 3,
                  checked: false
                }
              ]
            }
          }
        };
        expect(result).toStrictEqual(expectedFormState);
      });
    });
  });

  describe("CLEAR_DISCREPANCY", () => {
    test("should clear extension", () => {
      const message = "I'm a discrepency!";
      const action = {
        type: userFormActions.CLEAR_DISCREPANCY,
        payload: message
      };
      const initialTestState = {
        ...initialUserFormState,
        discrepancies: [{ message }]
      };
      const result = userFormReducer(initialTestState, action);
      const expectedFormState = {
        ...initialTestState,
        discrepancies: []
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("CLEAR_EXTENSION", () => {
    test("should clear extension", () => {
      const action = { type: userFormActions.CLEAR_EXTENSION };
      const initialTestState = {
        ...initialUserFormState,
        triton: {
          ...initialUserFormState.triton,
          extension: {
            ...initialUserFormState.triton.extension,
            value: validFormOptions.extension,
            blurred: true,
            updated: true,
            valid: true
          }
        }
      };
      const result = userFormReducer(initialTestState, action);
      const expectedFormState = {
        ...initialTestState,
        triton: {
          ...initialTestState.triton,
          extension: {
            ...initialTestState.triton.extension,
            value: "",
            valid: false
          }
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
          value: "n0263786",
          nNumberFetchedUser: {
            firstName: "Faith",
            lastName: "Cuneo"
          }
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
      triton: {
        ...initialUserFormState.triton,
        outgoing: {
          whatever: "who cares",
          stuff: "we're gonna clear out"
        }
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
          value: payload.nNumber,
          nNumberFetchedUser: payload.fetchedUser
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("INITIATE_DID_FIELDS - DID User", () => {
    test("should initiate DID fields", () => {
      const action = { type: userFormActions.INITIATE_DID_FIELDS };
      const result = userFormReducer({
        ...initialUserFormState,
        triton: {
          ...initialUserFormState.triton,
          didUser: true
        }
      }, action);
      const expectedFormState = {
        ...initialUserFormState,
        triton: {
          ...initialUserFormState.triton,
          didUser: false,
          zeroOutEnabled: {
            ...initialUserFormState.triton.zeroOutEnabled,
            value: false
          }
        }
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
        triton: {
          ...initialUserFormState.triton,
          didUser: true,
          zeroOutEnabled: {
            ...initialUserFormState.triton.zeroOutEnabled,
            value: false
          }
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
    test("should initiate DID fields and zeroOutEnabled should remain unchanged - true", () => {
      const action = { type: userFormActions.INITIATE_DID_FIELDS };
      const result = userFormReducer({
        ...initialUserFormState,
        triton: {
          ...initialUserFormState.triton,
          zeroOutEnabled: {
            ...initialUserFormState.triton.zeroOutEnabled,
            value: true
          }
        }
      }, action);
      const expectedFormState = {
        ...initialUserFormState,
        triton: {
          ...initialUserFormState.triton,
          didUser: true,
          zeroOutEnabled: {
            ...initialUserFormState.triton.zeroOutEnabled,
            value: true
          }
        }
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
          triton: {
            ...initialUserFormState.triton,
            zeroOutEnabled: {
              updated: true,
              value: true
            }
          }
        };
        expect(result).toStrictEqual(expectedFormState);
      });
    });
    describe("zeroOutEnabled === true", () => {
      test("should initiate zero out fields", () => {
        const action = { type: userFormActions.INITIATE_ZERO_OUT_FIELDS };
        const result = userFormReducer({
          ...initialUserFormState,
          triton: {
            ...initialUserFormState.triton,
            zeroOutEnabled: {
              ...initialUserFormState.triton.zeroOutEnabled,
              value: true
            }
          }
        }, action);
        const expectedFormState = {
          ...initialUserFormState,
          triton: {
            ...initialUserFormState.triton,
            zeroOutEnabled: {
              updated: true,
              value: false
            }
          }
        };
        expect(result).toStrictEqual(expectedFormState);
      });
    });
  });

  describe("UPDATE_SELF_SERVICE_INDICATOR", () => {
    describe("selfServiceInd === false", () => {
      test("should set selfServiceInd to true", () => {
        const action = { type: userFormActions.UPDATE_SELF_SERVICE_INDICATOR };
        const result = userFormReducer(initialUserFormState, action);
        const expectedFormState = {
          ...initialUserFormState,
          triton: {
            ...initialUserFormState.triton,
            selfServiceInd: {
              value: true,
              updated: true
            }
          }
        };
        expect(result).toStrictEqual(expectedFormState);
      });
    });
    describe("selfServiceInd === true", () => {
      test("should initiate selfService fields", () => {
        const action = { type: userFormActions.UPDATE_SELF_SERVICE_INDICATOR  };
        const result = userFormReducer({
          ...initialUserFormState,
          triton: {
            ...initialUserFormState.triton,
            selfServiceInd: {
              value: true,
              updated: false
            }
          }
        }, action);
        const expectedFormState = {
          ...initialUserFormState,
          triton: {
            ...initialUserFormState.triton,
            selfServiceInd: {
              value: false,
              updated: true
            }
          }
        };
        expect(result).toStrictEqual(expectedFormState);
      });
    });
  });

  describe("RESET_FORM", () => {
    test("should reset form to initial state", () => {
      const initialTestState = {
        ...initialUserFormState,
        triton: {
          ...initialUserFormState.triton,
          profileId: {
            value: "2"
          }
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
      triton: {
        ...initialUserFormState.triton,
        userFound: true,
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
        zeroOutEnabled: {
          updated: false,
          value: true
        }
      },
      calabrio_qm: {
        ...initialUserFormState.calabrio_qm,
        userFound: true
      }
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
        triton: {
          ...initialUserFormState.triton,
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
        }
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
        triton: {
          ...initialUserFormState.triton,
          userFound: true,
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
        },
        calabrio_qm: {
          ...initialUserFormState.calabrio_qm,
          userFound: true
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
        triton: {
          ...initialUserFormState.triton,
          userFound: true,
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
        },
        calabrio_qm: {
          ...initialUserFormState.calabrio_qm,
          userFound: true
        }
      });
    });
  });

  describe("SET_BLUR_ON_FIELD", () => {
    test("system is not null - should reset field blurred property to true", () => {
      const payload = {
        field: "outgoing",
        system: "triton"
      };
      const action = {
        type: userFormActions.SET_BLUR_ON_FIELD,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        triton: {
          ...initialUserFormState.triton,
          outgoing: {
            ...initialUserFormState.triton.outgoing,
            blurred: true
          }
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
    test("system is null - should reset field blurred property to true", () => {
      const payload = {
        field: "nNumber",
        system: null
      };
      const action = {
        type: userFormActions.SET_BLUR_ON_FIELD,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        nNumber: {
          ...initialUserFormState.nNumber,
          blurred: true
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("SET_CALABRIO_QM_USER", () => {
    test("should set Calabrio User to Payload", () => {
      const payload = {
        user: "new"
      };
      const action = {
        type: userFormActions.SET_CALABRIO_QM_USER,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_qm: {
          ...payload,
          userFound: true
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("SET_CALABRIO_ROLES", () => {
    test("should set Calabrio User Roles to Payload", () => {
      const payload = [{ role: "Admin" }];
      const action = {
        type: userFormActions.SET_CALABRIO_ROLES,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_qm: {
          ...initialUserFormState.calabrio_qm,
          updated: true,
          roles: payload
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("SET_CALABRIO_TEAM", () => {
    test("should set Calabrio User Roles to Payload", () => {
      const payload = { team: "new" };
      const action = {
        type: userFormActions.SET_CALABRIO_TEAM,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_qm: {
          ...initialUserFormState.calabrio_qm,
          updated: true,
          team: payload
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("SET_CALABRIO_TEAM", () => {
    test("should set Calabrio User Roles to Payload", () => {
      const payload = { timezone: "EST" };
      const action = {
        type: userFormActions.SET_CALABRIO_TIMEZONE,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_qm: {
          ...initialUserFormState.calabrio_qm,
          updated: true,
          timezone: payload
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("SET_DISCREPANCIES", () => {
    test("should set Calabrio User Roles to Payload", () => {
      const payload = {
        type: "Calabrio",
        message: "Missing acdId"
      };
      const action = {
        type: userFormActions.SET_DISCREPANCIES,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        discrepancies: [
          {
            type: "Calabrio",
            message: "Missing acdId"
          }
        ]
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
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        triton: {
          ...initialUserFormState.triton,
          extension: {
            ...initialUserFormState.triton.extension,
            status: {
              ...initialUserFormState.triton.extension.status,
              message: testMessage,
              isError: false
            }
          }
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("SET_EXTENSION_RETRIES", () => {
    describe("remaining === 0", () => {
      test("SET_EXTENSION_RETRIES should decrement retriesRemaining", () => {
        const action = { type: userFormActions.SET_EXTENSION_RETRIES };
        const initialTestState = {
          ...initialUserFormState,
          triton: {
            ...initialUserFormState.triton,
            extension: {
              ...initialUserFormState.triton.extension,
              status: {
                ...initialUserFormState.triton.extension.status,
                searchStatus: ExtensionSearchStatuses.Idle,
                retriesRemaining: 1
              }
            }
          }
        };
        const result = userFormReducer(initialTestState, action);
        const expectedFormState = {
          ...initialTestState,
          triton: {
            ...initialUserFormState.triton,
            extension: {
              ...initialUserFormState.triton.extension,
              status: {
                ...initialUserFormState.triton.extension.status,
                retriesRemaining: 0
              }
            }
          }
        };
        expect(result).toStrictEqual(expectedFormState);
      });
    });
    describe("remaining > 0", () => {
      test("SET_EXTENSION_RETRIES should decrement retriesRemaining", () => {
        const action = { type: userFormActions.SET_EXTENSION_RETRIES };
        const initialTestState = {
          ...initialUserFormState,
          triton: {
            ...initialUserFormState.triton,
            extension: {
              ...initialUserFormState.triton.extension,
              status: {
                ...initialUserFormState.triton.extension.status,
                searchStatus: ExtensionSearchStatuses.PickANumber,
                retriesRemaining: 3
              }
            }
          }
        };
        const result = userFormReducer(initialTestState, action);
        const expectedFormState = {
          ...initialTestState,
          triton: {
            ...initialUserFormState.triton,
            extension: {
              ...initialUserFormState.triton.extension,
              status: {
                ...initialUserFormState.triton.extension.status,
                searchStatus: ExtensionSearchStatuses.PickANumber,
                retriesRemaining: 2
              }
            }
          }
        };
        expect(result).toStrictEqual(expectedFormState);
      });
    });
  });

  describe("SET_EXTENSION_VERIFIED", () => {
    test("SET_EXTENSION_VERIFIED reset search params and a verified message", () => {
      const action = { type: userFormActions.SET_EXTENSION_VERIFIED };
      const initialTestState = {
        ...initialUserFormState,
        triton: {
          ...initialUserFormState.triton,
          extension: {
            ...initialUserFormState.triton.extension,
            status: {
              ...initialUserFormState.triton.extension.status,
              searchStatus: ExtensionSearchStatuses.PickANumber,
              retriesRemaining: 1,
              message: "Some message",
              isError: true
            }
          }
        }
      };
      const result = userFormReducer(initialTestState, action);
      const expectedFormState = {
        ...initialTestState,
        triton: {
          ...initialUserFormState.triton,
          extension: {
            ...initialUserFormState.triton.extension,
            status: {
              ...initialTestState.triton.extension.status,
              searchStatus: ExtensionSearchStatuses.Idle,
              retriesRemaining: searchParams.MaxRetries,
              message: "Verified",
              isError: false
            }
          }
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("SET_UPDATE_TRITON_FORM_STATE for DID User", () => {
    test("should reset form to update state", () => {
      const worker = mockWorkers[2];
      const payload = {
        formMode: formModes.UPDATE,
        worker,
        managers: managerList
      };
      const action = {
        type: userFormActions.SET_UPDATE_TRITON_FORM_STATE,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        formMode: formModes.UPDATE,
        nNumber: {
          ...initialUserFormState.nNumber,
          value: "n"
        },
        triton: {
          ...initialUserFormState.triton,
          userFound: true,
          sid: "WK2",
          attributes: worker.attributes,
          defaultSkills: {
            updated: false,
            ...getValidSkillsObject(worker.attributes.default_skills)
          },
          extension: {
            ...initialUserFormState.triton.extension,
            value: worker.attributes.extension,
            valid: true,
            status: {
              ...initialUserFormState.triton.extension.status,
              originalExtension: worker.attributes.extension || ""
            }
          },
          manager: {
            ...initialUserFormState.triton.manager,
            value: managerList.find(m => m.manager_n_number === worker.attributes.manager_n_number)
          },
          outgoing: {
            ...initialUserFormState.triton.outgoing,
            value: formatE164PhoneNumber(worker.attributes.did),
            valid: true
          },
          profileId: {
            ...initialUserFormState.triton.profileId,
            value: worker.attributes.profile_id
          },
          alternateDid: {
            ...initialUserFormState.triton.alternateDid,
            value: formatE164PhoneNumber(worker.alternateDid),
            valid: true
          },
          directDialNum: {
            ...initialUserFormState.triton.directDialNum,
            value: formatE164PhoneNumber(worker.directDialNum),
            valid: true
          },
          didUser: true,
          zeroOutEnabled: {
            ...initialUserFormState.triton.zeroOutEnabled,
            value: worker.zeroOutEnabled
          },
          selfServiceInd: {
            ...initialUserFormState.triton.selfServiceInd,
            value: worker.selfServiceInd
          }
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("SET_DELETE_FORM_STATE", () => {
    test("should reset form to update state", () => {
      const worker = mockWorkers[2];
      const payload = {
        worker,
        managers: managerList
      };
      const action = {
        type: userFormActions.SET_DELETE_FORM_STATE,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        formMode: formModes.DELETE,
        nNumber: {
          ...initialUserFormState.nNumber,
          value: "n"
        },
        triton: {
          ...initialUserFormState.triton,
          sid: worker.sid,
          attributes: worker.attributes,
          userFound: true,
          defaultSkills: {
            updated: false,
            ...getValidSkillsObject(worker.attributes.default_skills)
          },
          extension: {
            ...initialUserFormState.triton.extension,
            value: worker.attributes.extension,
            valid: true,
            status: {
              ...initialUserFormState.triton.extension.status,
              originalExtension: worker.attributes.extension || ""
            }
          },
          manager: {
            ...initialUserFormState.triton.manager,
            value: managerList.find(m => m.manager_n_number === worker.attributes.manager_n_number)
          },
          outgoing: {
            ...initialUserFormState.triton.outgoing,
            value: formatE164PhoneNumber(worker.attributes.did),
            valid: true
          },
          profileId: {
            ...initialUserFormState.triton.profileId,
            value: worker.attributes.profile_id
          },
          alternateDid: {
            ...initialUserFormState.triton.alternateDid,
            value: formatE164PhoneNumber(worker.alternateDid),
            valid: true
          },
          directDialNum: {
            ...initialUserFormState.triton.directDialNum,
            value: formatE164PhoneNumber(worker.directDialNum),
            valid: true
          },
          didUser: true,
          zeroOutEnabled: {
            ...initialUserFormState.triton.zeroOutEnabled,
            value: worker.zeroOutEnabled
          },
          selfServiceInd: {
            ...initialUserFormState.triton.selfServiceInd,
            value: worker.selfServiceInd
          }
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
    test("should reset form to update state - attributes missing", () => {
      const worker = {...mockWorkers[2]};
      delete worker.attributes.n_number;
      delete worker.attributes.extension;
      delete worker.attributes.did;
      delete worker.directDialNum;
      delete worker.alternateDid;
      delete worker.zeroOutEnabled;
      delete worker.selfServiceInd;

      const payload = {
        worker,
        managers: managerList
      };
      const action = {
        type: userFormActions.SET_DELETE_FORM_STATE,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        formMode: formModes.DELETE,
        nNumber: {
          ...initialUserFormState.nNumber,
          value: "n"
        },
        triton: {
          ...initialUserFormState.triton,
          userFound: true,
          sid: worker.sid,
          attributes: worker.attributes,
          defaultSkills: {
            updated: false,
            ...getValidSkillsObject(worker.attributes.default_skills)
          },
          extension: {
            ...initialUserFormState.triton.extension,
            value: "",
            valid: true,
            status: {
              ...initialUserFormState.triton.extension.status,
              originalExtension: ""
            }
          },
          manager: {
            ...initialUserFormState.triton.manager,
            value: managerList.find(m => m.manager_n_number === worker.attributes.manager_n_number)
          },
          outgoing: {
            ...initialUserFormState.triton.outgoing,
            value: "",
            valid: false
          },
          profileId: {
            ...initialUserFormState.triton.profileId,
            value: worker.attributes.profile_id
          },
          alternateDid: {
            ...initialUserFormState.triton.alternateDid,
            value: "",
            valid: false
          },
          directDialNum: {
            ...initialUserFormState.triton.directDialNum,
            value: "",
            valid: false
          },
          didUser: false,
          zeroOutEnabled: {
            ...initialUserFormState.triton.zeroOutEnabled,
            value: false
          },
          selfServiceInd: {
            ...initialUserFormState.triton.selfServiceInd,
            value: false
          }
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("SET_UPDATE_TRITON_FORM_STATE for NonDID User", () => {
    test("should reset form to update state", () => {
      const worker = mockWorkers[0];
      const payload = {
        worker,
        formMode: formModes.UPDATE,
        managers: managerList
      };
      const action = {
        type: userFormActions.SET_UPDATE_TRITON_FORM_STATE,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        formMode: payload.formMode,
        triton: {
          ...initialUserFormState.triton,
          userFound: true,
          attributes: worker.attributes,
          sid: "WK0",
          defaultSkills: {
            ...getValidSkillsObject(worker.attributes.default_skills),
            updated: false
          },
          extension: {
            ...initialUserFormState.triton.extension,
            value: "",
            valid: true
          },
          manager: {
            ...initialUserFormState.triton.manager,
            value: JSON.stringify(managerList.find(m => m.manager_n_number === worker.attributes.manager_n_number))
          },
          profileId: {
            ...initialUserFormState.triton.profileId,
            value: worker.attributes.profile_id
          }
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
        triton: {
          ...initialUserFormState.triton,
          userPreviouslyAdded: true
        }
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
        triton: {
          ...initialUserFormState.triton,
          defaultSkills: {
            updated: true,
            ...payload
          }
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("UPDATE_EXTENSION", () => {
    describe("Extension is valid", () => {
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
          triton: {
            ...initialUserFormState.triton,
            extension: {
              ...initialUserFormState.triton.extension,
              value: validFormOptions.extension,
              blurred: payload.isValid,
              updated: true,
              valid: payload.isValid,
              status: {
                ...initialUserFormState.triton.extension.status,
                message: "Extension is valid",
                searchStatus: ExtensionSearchStatuses.Idle,
                retriesRemaining: 5
              }
            }
          }
        };
        expect(result).toStrictEqual(expectedFormState);
      });
    });
    describe("Extension is not valid", () => {
      test("should update extension", () => {
        const payload = {
          extension: validFormOptions.extension,
          isValid: false
        };
        const action = {
          type: userFormActions.UPDATE_EXTENSION,
          payload
        };
        const result = userFormReducer(initialUserFormState, action);
        const expectedFormState ={
          ...initialUserFormState,
          triton: {
            ...initialUserFormState.triton,
            extension: {
              ...initialUserFormState.triton.extension,
              value: validFormOptions.extension,
              blurred: payload.isValid,
              updated: true,
              valid: payload.isValid,
              status: {
                ...initialUserFormState.triton.extension.status,
                message: "",
                searchStatus: ExtensionSearchStatuses.Idle,
                retriesRemaining: 5
              }
            }
          }
        };
        expect(result).toStrictEqual(expectedFormState);
      });
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
        triton: {
          ...initialUserFormState.triton,
          inactiveForwardTo: {
            value: payload,
            updated: true
          }
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
        triton: {
          ...initialUserFormState.triton,
          manager: {
            ...initialUserFormState.triton.manager,
            value: payload,
            updated: true
          }
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("UPDATE_ROUTINGTEAM", () => {
    test("should update routing team", () => {
      const payload = {
        routingTeamName:"Sample1"
      };
      const action = {
        type: userFormActions.ROUTING_TEAM,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        triton: {
          ...initialUserFormState.triton,
          routingTeam: {
            ...initialUserFormState.triton.routingTeam,
            updated: true,
            value: "Sample1"
          }
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
        triton: {
          ...initialUserFormState.triton,
          outgoing: {
            ...initialUserFormState.triton.outgoing,
            value: payload.maskedValue,
            e164: payload.e164Number,
            updated: true,
            valid: true
          }
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
        triton: {
          ...initialUserFormState.triton,
          outgoing: {
            ...initialUserFormState.triton.outgoing,
            value: payload.maskedValue,
            e164: payload.e164Number,
            updated: true
          }
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("SET_UPDATE_QM_FORM_STATE", () => {
    test("should update state with the existing calabrio user info", () => {
      const calabrioUser = {
        team: 123,
        timezone: {
          label: "EST",
          value: 173
        },
        roles: ["QM Agent"],
        scope: {
          groups: [{
            name: "group-woot",
            groupId: 13
          }],
          teams: [{
            name: "team-awesome",
            groupId: 22
          }]
        }
      };
      const action = {
        type: userFormActions.SET_UPDATE_QM_FORM_STATE,
        payload: {
          user: calabrioUser,
          formMode: formModes.UPDATE,
        }
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        formMode: formModes.UPDATE,
        calabrio_qm: {
          ...initialUserFormState.calabrio_qm,
          ...calabrioUser,
          userFound: true
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });

  describe("SET_UPDATE_WFM_FORM_STATE", () => {
    test("should update state with the existing calabrio user info", () => {
      const wfmUser = {
        somanyfields: "i don't want to type them",
        Roles: [{ RoleId: "333" }],
        PersonSkills: [{ SkillId: "111" }],
        OptionalColumns: { "111": "misses!" }
      };
      const action = {
        type: userFormActions.SET_UPDATE_WFM_FORM_STATE,
        payload: {
          formMode: formModes.UPDATE,
          user: wfmUser,
          state: initialTestState
        }
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        formMode: formModes.UPDATE,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          somanyfields: "i don't want to type them",
          Roles: [{
            Name: "Role3",
            Id: "333",
            value: "333",
            label: "Role3"
          }],
          PersonSkills: [{
            Name: "Skill1",
            Id: "111",
            label: "Skill1",
            value: "111"
          }],
          OptionalColumns: [{
            Name: "OptionalCol1",
            Id: "111",
            columnValue: "misses!",
            label: "OptionalCol1",
            value: "111"
          }],
          userFound: true
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
    test("should update state with the existing calabrio user info - skills, roles, & columns not available", () => {
      const wfmUser = {
        somanyfields: "i don't want to type them",
        Roles: [{ RoleId: "1125" }],
        PersonSkills: [{ SkillId: "9963" }],
        OptionalColumns: { "0215": "5648" }
      };
      const action = {
        type: userFormActions.SET_UPDATE_WFM_FORM_STATE,
        payload: {
          formMode: formModes.UPDATE,
          user: wfmUser,
          state: initialTestState
        }
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        formMode: formModes.UPDATE,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          somanyfields: "i don't want to type them",
          Roles: [],
          PersonSkills: [],
          OptionalColumns: [],
          userFound: true
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
    test("should update state with the existing calabrio user info - columns is null", () => {
      const wfmUser = {
        somanyfields: "i don't want to type them",
        Roles: [{ RoleId: "1125" }],
        PersonSkills: [{ SkillId: "9963" }],
        OptionalColumns: null
      };
      const action = {
        type: userFormActions.SET_UPDATE_WFM_FORM_STATE,
        payload: {
          formMode: formModes.UPDATE,
          user: wfmUser,
          state: initialTestState
        }
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        formMode: formModes.UPDATE,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          somanyfields: "i don't want to type them",
          Roles: [],
          PersonSkills: [],
          OptionalColumns: [],
          userFound: true
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
          triton: {
            ...initialUserFormState.triton,
            profileId: {
              ...initialUserFormState.triton.profileId,
              value: profileList[0].profile_id
            }
          }
        };
        const result = userFormReducer(initialTestState, action);
        const expectedFormState = {
          ...initialUserFormState,
          triton: {
            ...initialUserFormState.triton,
            profileId: {
              ...initialUserFormState.triton.profileId,
              value: payload.profileId,
              updated: true
            },
            zeroOutEnabled: {
              ...initialUserFormState.triton.zeroOutEnabled,
              value: true
            }
          }
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
          triton: {
            ...initialUserFormState.triton,
            profileId: {
              ...initialUserFormState.triton.profileId,
              value: profileList[1].profile_id
            }
          }
        };
        const result = userFormReducer(initialTestState, action);
        const expectedFormState = {
          ...initialUserFormState,
          triton: {
            ...initialUserFormState.triton,
            profileId: {
              ...initialUserFormState.triton.profileId,
              value: payload.profileId,
              updated: true
            },
            zeroOutEnabled: {
              value: false,
              updated: false
            }
          }
        };
        expect(result).toStrictEqual(expectedFormState);
      });
    });
  });
  describe("SET_WFM_BUSINESS_UNIT", () => {
    test("should set BusinessUnitId in the calabrio_wfm", () => {
      const action = {
        type: userFormActions.SET_WFM_BUSINESS_UNIT,
        payload: "BU-i-am-business-unit"
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          BusinessUnitId: "BU-i-am-business-unit"
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("SET_WFM_AVAILABILITY", () => {
    test("should set AvailabilityId in the calabrio_wfm", () => {
      const action = {
        type: userFormActions.SET_WFM_AVAILABILITY,
        payload: {
          id: "availabilityid",
          startDate: "3-24-2023"
        }
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          AvailabilityId: "availabilityid",
          AvailabilityStartDate: "3-24-2023"
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("SET_WFM_ABSENCE", () => {
    test("should set AbsenceId in the calabrio_wfm", () => {
      const action = {
        type: userFormActions.SET_WFM_ABSENCE,
        payload: "absenceid1"
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          AbsenceId: "absenceid1"
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("SET_WFM_TEAM", () => {
    test("should set TeamId and TeamStartDate in the calabrio_wfm", () => {
      const action = {
        type: userFormActions.SET_WFM_TEAM,
        payload: {
          id: "i-am-team-id",
          startDate: "5-12-2023"
        }
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          TeamId: "i-am-team-id",
          TeamStartDate: "5-12-2023"
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("SET_WFM_SKILLS", () => {
    test("should set PersonSkills and SkillsStartDate in the calabrio_wfm", () => {
      const action = {
        type: userFormActions.SET_WFM_SKILLS,
        payload: {
          skills: ["skill1", "skill2"],
          startDate: "5-12-2023"
        }
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          PersonSkills: ["skill1", "skill2"],
          SkillsStartDate: "5-12-2023"
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("SET_WFM_CONTROL_SET", () => {
    test("should set WorkflowControlSetId in the calabrio_wfm", () => {
      const action = {
        type: userFormActions.SET_WFM_CONTROL_SET,
        payload: "workflow-yo"
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          WorkflowControlSetId: "workflow-yo"
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("SET_WFM_CONTRACT", () => {
    test("should set ContractId in the calabrio_wfm", () => {
      const action = {
        type: userFormActions.SET_WFM_CONTRACT,
        payload: "contract-id-1"
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          ContractId: "contract-id-1"
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("SET_WFM_CONTRACT_SCHEDULE", () => {
    test("should set ContractScheduleId in the calabrio_wfm", () => {
      const action = {
        type: userFormActions.SET_WFM_CONTRACT_SCHEDULE,
        payload: "hi i am contract schedule"
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          ContractScheduleId: "hi i am contract schedule"
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("SET_WFM_BUDGET_GROUP", () => {
    test("should set BudgetGroupId in the calabrio_wfm", () => {
      const action = {
        type: userFormActions.SET_WFM_BUDGET_GROUP,
        payload: "budgetgroup1"
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          BudgetGroupId: "budgetgroup1"
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("SET_WFM_EMP_START_DATE", () => {
    test("should set EmploymentStartDate in the calabrio_wfm", () => {
      const action = {
        type: userFormActions.SET_WFM_EMP_START_DATE,
        payload: "5-12-2023"
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          EmploymentStartDate: "5-12-2023"
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("SET_WFM_PART_TIME_PERCENTAGE", () => {
    test("should set PartTimePercentageId in the calabrio_wfm", () => {
      const action = {
        type: userFormActions.SET_WFM_PART_TIME_PERCENTAGE,
        payload: "hello!"
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          PartTimePercentageId: "hello!"
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("SET_WFM_SHIFT_BAG", () => {
    test("should set ShiftBagId in the calabrio_wfm", () => {
      const action = {
        type: userFormActions.SET_WFM_SHIFT_BAG,
        payload: "shiFFFtbag"
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          ShiftBagId: "shiFFFtbag"
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("SET_WFM_NOTE", () => {
    test("should set Note in the calabrio_wfm", () => {
      const action = {
        type: userFormActions.SET_WFM_NOTE,
        payload: "have a nice day!"
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          Note: "have a nice day!"
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("SET_WFM_ROLES", () => {
    test("should set Roles in the calabrio_wfm", () => {
      const action = {
        type: userFormActions.SET_WFM_ROLES,
        payload: ["role 1", "role2"]
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          Roles: ["role 1", "role2"]
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("SET_WFM_ROTATION", () => {
    test("should set RotationId, RotationStartDate and RotationStartWeek in the calabrio_wfm", () => {
      const action = {
        type: userFormActions.SET_WFM_ROTATION,
        payload: {
          id: "rotationID",
          startDate: "4-5-2023",
          startWeek: 4
        }
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          RotationId: "rotationID",
          RotationStartDate: "4-5-2023",
          RotationStartWeek: 4
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("SET_WFM_FIRST_DAY_OF_WEEK", () => {
    test("should set FirstDayOfWeek in the calabrio_wfm", () => {
      const action = {
        type: userFormActions.SET_WFM_FIRST_DAY_OF_WEEK,
        payload: 1
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          FirstDayOfWeek: 1
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("SET_WFM_OPTIONAL_COLUMNS", () => {
    test("should set OptionalColumns in the calabrio_wfm", () => {
      const action = {
        type: userFormActions.SET_WFM_OPTIONAL_COLUMNS,
        payload: {
          Id: "optional column1",
          Value: "stuff"
        }
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          OptionalColumns: {
            Id: "optional column1",
            Value: "stuff"
          }
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("SET_WFM_IDENTITY", () => {
    test("should set Identity in the calabrio_wfm", () => {
      const action = {
        type: userFormActions.SET_WFM_IDENTITY,
        payload: "email@mail.com"
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          Identity: "email@mail.com"
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("SET_WFM_TERMINATION_DATE", () => {
    test("should set TerminationDate in the calabrio_wfm", () => {
      const action = {
        type: userFormActions.SET_WFM_TERMINATION_DATE,
        payload: "12-12-2012"
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          TerminationDate: "12-12-2012"
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("SET_WFM_USER_DATA", () => {
    test("should set FirstName, LastName, EmploymentNumber, Email, and DisplayName in the calabrio_wfm", () => {
      const action = {
        type: userFormActions.SET_WFM_USER_DATA,
        payload: {
          firstName: "Michael",
          lastName: "Scott",
          nNumber: "n1231231",
          email: "michael.scott@dundermifflin.com",
          fullName: "Michael Scott"
        }
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          FirstName: "Michael",
          LastName: "Scott",
          EmploymentNumber: "n1231231",
          Email: "michael.scott@dundermifflin.com",
          DisplayName: "Michael Scott"
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("UPDATE_USER_FOUND", () => {
    test("system is calabrio_wfm, should set userFound in calabrio_wfm of the state", () => {
      const action = {
        type: userFormActions.UPDATE_USER_FOUND,
        payload: {
          system: "calabrio_wfm",
          isFound: true
        }
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_wfm: {
          ...initialUserFormState.calabrio_wfm,
          userFound: true,
          updated: true
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
    test("system is calabrio_qm, should set userFound in calabrio_qm of the state", () => {
      const action = {
        type: userFormActions.UPDATE_USER_FOUND,
        payload: {
          system: "calabrio_qm",
          isFound: true
        }
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        calabrio_qm: {
          ...initialUserFormState.calabrio_qm,
          userFound: true,
          updated: true
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
    test("system is triton, should set userFound in triton of the state", () => {
      const action = {
        type: userFormActions.UPDATE_USER_FOUND,
        payload: {
          system: "triton",
          isFound: true
        }
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        triton: {
          ...initialUserFormState.triton,
          userFound: true,
          updated: true
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
    test("system is not found in state, should return state without updating", () => {
      const action = {
        type: userFormActions.UPDATE_USER_FOUND,
        payload: {
          system: "fake",
          isFound: true
        }
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
});
