import {
  formatWorkerAttributeSkillsToHTML,
  formatWorkerAttributeSkillsToString
} from "utils";
import { render } from "testUtils";

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
    expect(rendered.getByText("466", { exact: false })).toHaveStyleRule("border-color", "#C0BFC0");
    expect(rendered.getByText("466", { exact: false })).toHaveStyleRule("border-style", "solid");
    expect(rendered.getByText("466", { exact: false })).toHaveStyleRule("border-radius", "5px");
    expect(rendered.getByText("466", { exact: false })).toHaveStyleRule("border-width", "2px");
    expect(rendered.getByText("psuUm")).toBeInTheDocument();
    expect(rendered.getByText("3", { selector: "span" })).toBeInTheDocument();
    expect(rendered.getByText("3", { selector: "span" })).toHaveStyleRule("color", "#28A3AF");
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
    }
    expect(formatWorkerAttributeSkillsToString(testData)).toEqual(["ccSharedAGLFNOL38 - 1", "psu-l1"]);
  });

  test("null returns empty string", () => {
    expect(formatWorkerAttributeSkillsToString(null)).toEqual("");
  });
});