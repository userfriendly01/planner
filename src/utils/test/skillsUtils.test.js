import {
  areSkillsDifferent,
  areVhFieldsValid,
  getValidSkillsObject,
  formatWorkerAttributeSkillsToHTML,
  formatWorkerAttributeSkillsToString,
  identifyImpactedWorkers,
  isSkillFormValid,
  isTaskQueueError
} from "../skillsUtils";
import {
  mockSkillFormState, mockSkills, render
} from "testUtils";

describe("skillsUtils", () => {
  describe("isTaskQueueError", () => {
    test("Returns true when target expression with the skill name is unique", () => {
      const skillFormState = {
        ...mockSkillFormState,
        taskQueue: {
          ...mockSkillFormState.taskQueue,
          sid: "TQ123"
        }
      };
      const result = isTaskQueueError(skillFormState, "testskill");
      expect(result).toEqual(true);
    });
    test("Returns false when no taskqueue sid on the skill form", () => {
      const result = isTaskQueueError(mockSkillFormState, "testskill");
      expect(result).toEqual(false);
    });
    test("Returns false when target expression is found with the skill name", () => {
      const skillFormState = {
        ...mockSkillFormState,
        taskQueue: {
          ...mockSkillFormState.taskQueue,
          sid: "TQ123",
          target_workers: "routing.skills HAS \"testskill\""
        }
      };
      const result = isTaskQueueError(skillFormState, "testskill");
      expect(result).toEqual(false);
    });
    test("Returns false when a skill name has no length skill name", () => {
      const skillFormState = {
        ...mockSkillFormState,
        name: "",
        taskQueue: {
          ...mockSkillFormState.taskQueue,
          sid: "TQ123"
        }
      };
      const result = isTaskQueueError(skillFormState, "");
      expect(result).toEqual(false);
    });
  });

  describe("isSkillFormValid", () => {
    describe("returns false", () => {
      test("name is an empty string, returns false", () => {
        const skillForm = {
          ...mockSkillFormState,
          name: ""
        };
        const isValid = isSkillFormValid(mockSkills, skillForm);
        expect(isValid).toEqual(false);
      });
      test("skill name is the same as an existing skill, returns false", () => {
        const skillForm = {
          ...mockSkillFormState,
          name: "aisgL1"
        };
        const isValid = isSkillFormValid(mockSkills, skillForm);
        expect(isValid).toEqual(false);
      });
      test("no profile selected, returns false", () => {
        const skillForm = {
          ...mockSkillFormState,
          profileIds: []
        };
        const isValid = isSkillFormValid(mockSkills, skillForm);
        expect(isValid).toEqual(false);
      });
      test("min level selected, but no max, returns false", () => {
        const skillForm = {
          ...mockSkillFormState,
          levels: {
            min: 1,
            max: ""
          }
        };
        const isValid = isSkillFormValid(mockSkills, skillForm);
        expect(isValid).toEqual(false);
      });
      test("max level selected, but no min, returns false", () => {
        const skillForm = {
          ...mockSkillFormState,
          levels: {
            min: null,
            max: 3
          }
        };
        const isValid = isSkillFormValid(mockSkills, skillForm);
        expect(isValid).toEqual(false);
      });
      describe("taskqueue is new", () => {
        test("friendly name is empty, returns false", () => {
          const skillForm = {
            ...mockSkillFormState,
            taskQueue: {
              ...mockSkillFormState.taskQueue,
              friendly_name: ""
            }
          };
          const isValid = isSkillFormValid(mockSkills, skillForm);
          expect(isValid).toEqual(false);
        });
        test("no operating unit selected, returns false", () => {
          const skillForm = {
            ...mockSkillFormState,
            taskQueue: {
              ...mockSkillFormState.taskQueue,
              friendly_name: "hi",
              operating_unit_sid: null
            }
          };
          const isValid = isSkillFormValid(mockSkills, skillForm);
          expect(isValid).toEqual(false);
        });
      });
      describe("task queue is not new", () => {
        test("no taskqueue sid, returns false", () => {
          const skillForm = {
            ...mockSkillFormState,
            taskQueue: {
              ...mockSkillFormState.taskQueue,
              isNew: false,
              sid: ""
            }
          };
          const isValid = isSkillFormValid(mockSkills, skillForm);
          expect(isValid).toEqual(false);
        });
        test("there is a taskqueue error, returns false", () => {
          const skillForm = {
            ...mockSkillFormState,
            name: "testskill",
            taskQueue: {
              ...mockSkillFormState.taskQueue,
              isNew: false,
              sid: "tq123",
              target_workers: "routing.skills HAS \"boo\""
            }
          };
          const isValid = isSkillFormValid(mockSkills, skillForm);
          expect(isValid).toEqual(false);
        });
      });
      test("time of days are janky", () => {
        const skillForm = {
          ...mockSkillFormState,
          timeOfDays: mockSkillFormState.timeOfDays.slice(1,5)
        };
        const isValid = isSkillFormValid(mockSkills, skillForm);
        expect(isValid).toEqual(false);
      });
      test("applicationId is not a number", () => {
        const skillForm = {
          ...mockSkillFormState,
          applicationId: "NaN"
        };
        const isValid = isSkillFormValid(mockSkills, skillForm);
        expect(isValid).toEqual(false);
      });
    });
    describe("returns true", () => {
      test("all required info is there, taskqueue is new, has a good name and ou is selected", () => {
        const isValid = isSkillFormValid(mockSkills, mockSkillFormState);
        expect(isValid).toEqual(true);
      });
      test("all required info is there, taskqueue is not new, has a sid and is not erroneous", () => {
        const skillForm = {
          ...mockSkillFormState,
          taskQueue: {
            isNew: false,
            sid: "tq123",
            target_workers: "routing.skills HAS \"testskill\""
          }
        };
        const isValid = isSkillFormValid(mockSkills, skillForm);
        expect(isValid).toEqual(true);
      });
    });
  });

  describe("areVhFieldsValid", () => {
    const setMissingFieldsMock = jest.fn();
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("vhCallTarget, vhThreshold and vhTimeOfDayIds are all empty, calls setMissingFields wiht empty array", () => {
      const result = areVhFieldsValid(mockSkillFormState, setMissingFieldsMock);
      expect(setMissingFieldsMock).toBeCalledWith([]);
      expect(result).toEqual(true);
    });
    test("vhCallTarget and vhThreshold have values, but no vhTimeOfDayIds, returns false adn setMissingFields is called with appropriate data", () => {
      const skillForm = {
        ...mockSkillFormState,
        vhCallTarget: "hi",
        vhThreshold: "wat"
      };
      const result = areVhFieldsValid(skillForm, setMissingFieldsMock);
      expect(setMissingFieldsMock).toBeCalledWith([
        "vhTimeOfDay.1",
        "vhTimeOfDay.2",
        "vhTimeOfDay.3",
        "vhTimeOfDay.4",
        "vhTimeOfDay.5",
        "vhTimeOfDay.6",
        "vhTimeOfDay.7"
      ]);
      expect(result).toEqual(false);
    });
    test("vhTimeOfDayIds and vhThreshold have values, but no vhCallTarget, returns false adn setMissingFields is called with appropriate data", () => {
      const skillForm = {
        ...mockSkillFormState,
        vhCallTarget: null,
        vhThreshold: "wat",
        timeOfDays: mockSkillFormState.timeOfDays.map(x => {
          x.vhTimeOfDayId = 1;
          return x;
        })
      };
      const result = areVhFieldsValid(skillForm, setMissingFieldsMock);
      expect(setMissingFieldsMock).toBeCalledWith([
        "vhCallTarget"
      ]);
      expect(result).toEqual(false);
    });
    test("vhCallTarget and vhTimeOfDayIds have values, but no vhThreshold, returns false adn setMissingFields is called with appropriate data", () => {
      const skillForm = {
        ...mockSkillFormState,
        vhCallTarget: "yo!",
        vhThreshold: null,
        timeOfDays: mockSkillFormState.timeOfDays.map(x => {
          x.vhTimeOfDayId = 1;
          return x;
        })
      };
      const result = areVhFieldsValid(skillForm, setMissingFieldsMock);
      expect(setMissingFieldsMock).toBeCalledWith([
        "vhThreshold"
      ]);
      expect(result).toEqual(false);
    });
  });

  describe("identifyImpactedWorkers", () => {
    const workers = [
      {
        sid: "WK12342",
        attributes: {
          routing: {
            skills: ["deleteSkill1", "deleteSkill2", "keepSkill"],
            levels: { deleteSkill2: 4 }
          },
          default_skills: {
            skills: [],
            levels: {
              deleteSkill2: 3,
              keepSkill: 0
            }
          },
          disabled_skills: {
            skills: ["deleteSkill1"],
            levels: { deleteSkill1: 4 }
          }
        }
      },
      {
        sid: "WK12343",
        attributes: {
          routing: {
            skills: [],
            levels: {}
          },
          default_skills: {
            skills: ["deleteSkill2", "deleteSkill3", "skillsShouldStay"],
            levels: {}
          },
          disabled_skills: {
            skills: [],
            levels: {}
          }
        }
      },
      {
        sid: "WK12344",
        attributes: {
          routing: {
            skills: [],
            levels: {}
          },
          default_skills: {
            skills: [],
            levels: {}
          },
          disabled_skills: {
            skills: [],
            levels: {}
          }
        }
      },
      {
        sid: "WK12345",
        attributes: {
          routing: {
            skills: ["skillsShouldStay"],
            levels: { skillsShouldStay: 4 }
          },
          default_skills: {
            skills: ["skillsShouldStay"],
            levels: { skillsShouldStay: 6 }
          },
          disabled_skills: {
            skills: ["skillsShouldStay"],
            levels: { skillsShouldStay: 3 }
          }
        }
      }
    ];
    test("should filter and format workers with skills in the skills list", () => {
      expect(identifyImpactedWorkers(workers, [
        { name: "deleteSkill1" },
        { name: "deleteSkill2" },
        { name: "deleteSkill3" }
      ])).toStrictEqual([
        {
          attributes: {
            default_skills: {
              levels: {
                deleteSkill2: null,
                keepSkill: 0
              },
              skills: []
            },
            disabled_skills: {
              levels: { deleteSkill1: null },
              skills: []
            },
            routing: {
              levels: { deleteSkill2: null },
              skills: [ "keepSkill" ]
            }
          },
          sid: "WK12342"
        },
        {
          attributes: {
            default_skills: {
              levels: {},
              skills: [ "skillsShouldStay" ]
            },
            disabled_skills: {
              levels: {},
              skills: []
            },
            routing: {
              levels: {},
              skills: []
            }
          },
          sid: "WK12343"
        }
      ]);
    });
  });

  describe("formatWorkerAttributeSkillsToHTML()", () => {

    test("if input is undefined, return null", () => {
      expect(formatWorkerAttributeSkillsToHTML(undefined)).toEqual(null);
    });

    test("if routing skills are empty, return null", () => {
      const testData = {
        skills: [],
        levels: {}
      };
      expect(formatWorkerAttributeSkillsToHTML(testData)).toEqual(null);
    });

    test("if routing skills is a string we should return null", () => {
      const testData = {
        skills: "oopsThisIsntGood",
        levels: {
          "466": 3
        }
      };
      expect(formatWorkerAttributeSkillsToHTML(testData)).toEqual(null);
    });

    test("if routing skills exist, we should return the correct formatting, with or without a priority.", () => {
      const testData = {
        skills: ["466", "psuUm"],
        levels: {
          "466": 3
        }
      };
      const rendered = render(formatWorkerAttributeSkillsToHTML(testData));
      expect(rendered.getByText("466", { exact: false })).toBeInTheDocument();
      expect(rendered.getByText("466", { exact: false })).toHaveStyle({ "border-color": "#C0BFC0" });
      expect(rendered.getByText("466", { exact: false })).toHaveStyle({ "border-style": "solid" });
      expect(rendered.getByText("466", { exact: false })).toHaveStyle({ "border-radius": "5px" });
      expect(rendered.getByText("466", { exact: false })).toHaveStyle({ "border-width": "2px" });
      expect(rendered.getByText("psuUm")).toBeInTheDocument();
      expect(rendered.getByText("3", { selector: "span" })).toBeInTheDocument();
      expect(rendered.getByText("3", { selector: "span" })).toHaveStyle({ "color": "#28A3AF" });
    });
  });

  describe("formatWorkerAttributeSkillsToString", () => {
    test("skills/level object formats correctly", () => {
      const testData = {
        "skills": [
          "ccSharedAGLFNOL38",
          "psu-l1"
        ],
        "levels": {
          "ccSharedAGLFNOL38": 1
        }
      };
      expect(formatWorkerAttributeSkillsToString(testData)).toEqual(["ccSharedAGLFNOL38 - 1", "psu-l1"]);
    });

    test("null returns empty string", () => {
      expect(formatWorkerAttributeSkillsToString(null)).toEqual("");
    });
  });

  describe ("areSkillsDifferent", () => {

    test("should return false when default_skills is not defined", () => {
      const attributes = {
        whatever: "cool",
        routing: {
          skills: ["wow"],
          levels: {}
        }
      };
      expect(areSkillsDifferent(attributes)).toEqual(false);
    });
    test("should return false when default_skills is null", () => {
      const attributes = {
        default_skills: null,
        whatever: "cool",
        routing: {
          skills: ["wow"],
          levels: {}
        }
      };
      expect(areSkillsDifferent(attributes)).toEqual(false);
    });
    test("should return false when default_skills matches routing object", () => {
      const attributes = {
        default_skills: {
          skills: ["amazing", "wow", "socool"],
          levels: {
            amazing: 2,
            socool: 1
          }
        },
        whatever: "cool",
        routing: {
          skills: ["amazing", "wow", "socool"],
          levels: {
            amazing: 2,
            socool: 1
          }
        }
      };
      expect(areSkillsDifferent(attributes)).toEqual(false);
    });
    test("should return false when default_skills matches routing object regardless of order of arrays or object keys", () => {
      const attributes = {
        default_skills: {
          skills: ["amazing", "wow", "socool"],
          levels: {
            amazing: 2,
            socool: 1
          }
        },
        whatever: "cool",
        routing: {
          skills: ["wow", "socool", "amazing"],
          levels: {
            socool: 1,
            amazing: 2
          }
        }
      };
      expect(areSkillsDifferent(attributes)).toEqual(false);
    });

    const testTrue = attributes => {
      test("should return true when default_skills differs from routing", () => {
        expect(areSkillsDifferent(attributes)).toEqual(true);
      });
    };
    testTrue({
      default_skills: {
        skills: ["amazing", "wow", "socool"],
        levels: {
          amazing: 2,
          socool: 1
        }
      },
      whatever: "cool",
      routing: {
        skills: ["wow", "socool", "amazing"],
        levels: {
          socool: 1,
          amazing: 3 // diff
        }
      }
    });
    testTrue({
      default_skills: {
        skills: ["amazing", "wow", "socool"],
        levels: {
          amazing: 2,
          socool: 1
        }
        // no routing
      }
    });
    testTrue({
      default_skills: {
        skills: ["amazing", "wow", "socool"],
        levels: {
          amazing: 2,
          socool: 1
        }
      },
      routing: {
        skills: 123456, // not valid array
        routing: 123456 // not obj
      }
    });
    testTrue({
      default_skills: {
        skills: ["amazing", "wow", "socool"],
        levels: {
          amazing: 2,
          socool: 1
        }
      },
      routing: {
        skills: ["amazing", "wow", "socool", "notindefault"], // contains skill not in default
        levels: {
          amazing: 2,
          socool: 1
        }
      }
    });
    testTrue({
      default_skills: {
        skills: ["amazing", "wow", "socool", "notincurrent"], // not in current
        levels: {
          amazing: 2,
          socool: 1
        }
      },
      routing: {
        skills: ["amazing", "wow", "socool"],
        levels: {
          amazing: 2,
          socool: 1
        }
      }
    });
    testTrue({
      default_skills: {
        skills: ["amazing", "wow", "socool"],
        levels: {
          amazing: 2,
          socool: 1,
          notincurrent: 9 // not in current
        }
      },
      routing: {
        skills: ["amazing", "wow", "socool"],
        levels: {
          amazing: 2,
          socool: 1
        }
      }
    });
    testTrue({
      default_skills: {
        skills: ["amazing", "wow", "socool"],
        levels: {
          amazing: 2,
          socool: 1
        }
      },
      routing: {
        skills: ["amazing", "wow", "socool"],
        levels: {
          amazing: 2,
          socool: 1,
          notindefault: 9 // not in default
        }
      }
    });
    testTrue({
      default_skills: {
        skills: ["amazing"],
        levels: {
          amazing: 2
        }
      },
      routing: {
        skills: ["amazing", "wow", "socool"],
        levels: {
          amazing: 2,
          socool: 1
        }
      }
    });
  });

  describe("getValidSkillsObject", () => {

    const defaultObject = {
      skills: [],
      levels: {}
    };

    describe("skillsObject is not a plain object", () => {

      test("should return default object if skillsObject is undefined", () => {
        expect(getValidSkillsObject()).toEqual(defaultObject);
      });
      test("should return default object if skillsObject is null", () => {
        expect(getValidSkillsObject(null)).toEqual(defaultObject);
      });
      test("should return default object if skillsObject is an array", () => {
        expect(getValidSkillsObject([])).toEqual(defaultObject);
      });
      test("should return default object if skillsObject is a string", () => {
        expect(getValidSkillsObject("cool")).toEqual(defaultObject);
      });
      test("should return default object if skillsObject is a number", () => {
        expect(getValidSkillsObject(12345)).toEqual(defaultObject);
      });
      test("should return default object if skillsObject is a boolean", () => {
        expect(getValidSkillsObject(true)).toEqual(defaultObject);
      });
    });

    describe("skillsObject is a plain object", () => {

      describe("skillsObject contains neither levels or skills", () => {

        test("should return default object if skillsObject is an empty object", () => {
          expect(getValidSkillsObject({})).toEqual(defaultObject);
        });
        test("should return default object if skillsObject does not contain levels or skills", () => {
          expect(getValidSkillsObject({
            random: "not cool",
            team: "wahhh",
            caller_states: ["boo"]
          })).toEqual({
            ...defaultObject,
            random: "not cool",
            team: "wahhh",
            caller_states: ["boo"]
          });
        });
      });

      describe("skills is not an array", () => {

        test("should return skills as empty array when skills is an object", () => {
          expect(getValidSkillsObject({
            skills: { wahh: "nooo" }
          }).skills).toEqual([]);
        });
        test("should return skills as empty array when skills is undefined", () => {
          expect(getValidSkillsObject({
            random: "nooo"
          }).skills).toEqual([]);
        });
        test("should return skills as empty array when skills is null", () => {
          expect(getValidSkillsObject({
            skills: null
          }).skills).toEqual([]);
        });
        test("should return skills as empty array when skills is a string", () => {
          expect(getValidSkillsObject({
            skills: "not cool"
          }).skills).toEqual([]);
        });
        test("should return skills as empty array when skills is a number", () => {
          expect(getValidSkillsObject({
            skills: 12345
          }).skills).toEqual([]);
        });
        test("should return skills as empty array when skills is a boolean", () => {
          expect(getValidSkillsObject({
            skills: true
          }).skills).toEqual([]);
        });
      });

      describe("skills is a valid array", () => {

        test("should return skills as empty array when skills is an empty array", () => {
          expect(getValidSkillsObject({
            skills: []
          }).skills).toEqual([]);
        });
        test("should return skills as array with skills when skills is populated", () => {
          expect(getValidSkillsObject({
            skills: ["cool", "wow", "awesome"]
          }).skills).toEqual(["cool", "wow", "awesome"]);
        });
      });

      describe("levels is not a plain object", () => {
        test("should return levels as empty object when levels is undefined", () => {
          expect(getValidSkillsObject({
            something: { wahh: "nooo" }
          }).levels).toEqual({});
        });
        test("should return levels as empty object when levels is string", () => {
          expect(getValidSkillsObject({
            levels: "noooo"
          }).levels).toEqual({});
        });
        test("should return levels as empty object when levels is number", () => {
          expect(getValidSkillsObject({
            levels: 123456
          }).levels).toEqual({});
        });
        test("should return levels as empty object when levels is array", () => {
          expect(getValidSkillsObject({
            levels: [1,2,3,4,5]
          }).levels).toEqual({});
        });
        test("should return levels as empty object when levels is null", () => {
          expect(getValidSkillsObject({
            levels: null
          }).levels).toEqual({});
        });
      });

      describe("levels is a plain object", () => {
        test("should return levels as empty object when levels is empty object", () => {
          expect(getValidSkillsObject({
            levels: {}
          }).levels).toEqual({});
        });
        test("should return levels as object with key values when levels is empty object with valid key value pairs", () => {
          expect(getValidSkillsObject({
            levels: {
              "466": 3,
              "psuL1": 2,
              "psuL2": 1
            }
          }).levels).toEqual({
            "466": 3,
            "psuL1": 2,
            "psuL2": 1
          });
        });
      });

      describe("skills is valid and levels is not", () => {
        test("should return levels as empty object and skills as array", () => {
          expect(getValidSkillsObject({
            levels: "noooo",
            skills: ["cool", "wow"]
          })).toEqual({
            levels: {},
            skills: ["cool", "wow"]
          });
        });
      });

      describe("levels is valid and skills is not", () => {
        test("should return skills as empty array and levels as valid object", () => {
          expect(getValidSkillsObject({
            levels: {
              "466": 3,
              "psuL1": 2,
              "psuL2": 1
            },
            skills: "wahhhh"
          })).toEqual({
            levels: {
              "466": 3,
              "psuL1": 2,
              "psuL2": 1
            },
            skills: []
          });
        });
      });

      describe("levels is valid and skills is valid", () => {
        test("should return same skills and levels", () => {
          expect(getValidSkillsObject({
            levels: {
              "466": 3,
              "psuL1": 2,
              "psuL2": 1
            },
            skills: ["cool", "wow"]
          })).toEqual({
            levels: {
              "466": 3,
              "psuL1": 2,
              "psuL2": 1
            },
            skills: ["cool", "wow"]
          });
        });
      });
    });
  });
});