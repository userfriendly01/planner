import {
  getValidSkillsObject
} from "../skillsUtils";

describe("skillsUtils", () => {
  // const skills = [
  //   {
  //     minimum: null,
  //     multivalue: false,
  //     name: "skill1",
  //     maximum: null
  //   },
  //   {
  //     minimum: 0,
  //     multivalue: true,
  //     name: "skill2",
  //     maximum: 3
  //   },
  //   {
  //     minimum: 1,
  //     name: "skill3",
  //     maximum: 3
  //   },
  //   {
  //     minimum: 1,
  //     multivalue: true,
  //     name: "skill4",
  //     maximum: 8
  //   }
  // ];

  const defaultObject = {
    skills: [],
    levels: {}
  };

  describe("getValidSkillsObject", () => {

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
});