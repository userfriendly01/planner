import {
  disablePriorityDropDown,
  getPriorityOptionsList
} from "../skillsUtils";

describe("skillsUtils", () => {
  const skills = [
    {
      minimum: null,
      multivalue: false,
      name: "skill1",
      maximum: null
    },
    {
      minimum: 0,
      multivalue: true,
      name: "skill2",
      maximum: 3
    },
    {
      minimum: 1,
      name: "skill3",
      maximum: 3
    },
    {
      minimum: 1,
      multivalue: true,
      name: "skill4",
      maximum: 8
    }
  ];
  describe("disablePriorityDropDown", () => {
    describe("multivalue === true", () => {
      test("should return false", () => {
        expect(disablePriorityDropDown(skills, "skill2")).toBe(false);
      });
    });
    describe("multivalue === false", () => {
      test("should return true", () => {
        expect(disablePriorityDropDown(skills, "skill1")).toBe(true);
      });
    });
  });

  describe("getPriorityOptionsList", () => {
    describe("skillSelected exists", () => {
      describe("minimum & maximum are both null", () => {
        test("should return array with one value: null", () => {
          expect(getPriorityOptionsList(skills, "skill1")).toStrictEqual([null]);
        });
      });
      describe("minimum =0, maximum = 3", () => {
        test("should return array of values 0 through 3", () => {
          expect(getPriorityOptionsList(skills, "skill2")).toStrictEqual([0, 1, 2, 3]);
        });
      });
      describe("minimum = 1, maximum = 8", () => {
        test("should return array of values 1 through 8", () => {
          expect(getPriorityOptionsList(skills, "skill4")).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        });
      });
    });
    describe("skillSelected is undefined", () => {
      test("should return empty array", () => {
        expect(getPriorityOptionsList(skills)).toStrictEqual([]);
      });
    });
  });
});