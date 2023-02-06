import {
  areSkillsDifferent,
  getValidSkillsObject,
  formatSkillGroups
} from "../skillsUtils";

describe("skillsUtils", () => {

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
            useless: "wahhh",
            whatever: [1,2,3,4,5]
          })).toEqual(defaultObject);
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

  describe("formatSkillGroups", () => {
    describe("should take skills array return skill groups array containing any skills that are in the skill groups", () => {
      test("If no skills contain skill groups, return empty array", () => {
        const skillsArray = [{
          name: "skill1",
          ctmSkillGroups: []
        },
        {
          name: "skill2",
          ctmSkillGroups: []
        }];
        expect(formatSkillGroups(skillsArray)).toEqual([]);
      });
      test("A skill with more than one skill group will return an array with all skill groups", () => {
        const skillsArray = [{
          name: "skill1",
          levels: [1, 2, 3],
          ctmSkillId: 3,
          ctmSkillGroups: [
            {
              skillGroupId: 1,
              skillGroupNme: "I am a default skill group"
            },
            {
              skillGroupId: 2,
              skillGroupNme: "another skill group"
            }
          ]
        }];
        expect(formatSkillGroups(skillsArray)).toEqual([
          {
            skillGroupId: 1,
            skillGroupNme: "I am a default skill group",
            skills: [{
              name: "skill1",
              levels: [1, 2, 3],
              ctmSkillId: 3
            }]
          },
          {
            skillGroupId: 2,
            skillGroupNme: "another skill group",
            skills: [{
              name: "skill1",
              levels: [1, 2, 3],
              ctmSkillId: 3
            }]
          }
        ]);
      });
      test("skills that share skill groups will be included within the same skill group", () => {
        const skillsArray = [{
          name: "skill1",
          levels: [1, 2, 3],
          ctmSkillId: 3,
          ctmSkillGroups: [
            {
              skillGroupId: 1,
              skillGroupNme: "I am a default skill group"
            }
          ]
        }, {
          name: "skill2",
          levels: [1, 2, 3, 4, 5],
          ctmSkillId: 4,
          ctmSkillGroups: [
            {
              skillGroupId: 1,
              skillGroupNme: "I am a default skill group"
            }
          ]
        }];
        expect(formatSkillGroups(skillsArray)).toEqual([{
          skillGroupId: 1,
          skillGroupNme: "I am a default skill group",
          skills: [
            {
              name: "skill1",
              levels: [1, 2, 3],
              ctmSkillId: 3
            },
            {
              name: "skill2",
              levels: [1, 2, 3, 4, 5],
              ctmSkillId: 4
            }
          ]
        }]);
      });
    });
  });
});