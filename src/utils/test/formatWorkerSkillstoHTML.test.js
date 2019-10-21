import { formatWorkerSkillsToHTML } from "utils";
import { render } from "testUtils";

describe("formatWorkerSkillsToHTML()", () => {

  test("if input is undefined, return null", () => {
    expect(formatWorkerSkillsToHTML(undefined)).toEqual(null);
  });

  test("if routing skills are empty, return null", () => {
    const testData = {
      skills: [],
      levels: {}
    };
    expect(formatWorkerSkillsToHTML(testData)).toEqual(null);
  });

  test("if routing skills exist, we should return the correct formatting, with or without a priority.", () => {
    const testData = {
      skills: ["466", "psuUm"],
      levels: {
        "466": 3
      }
    };
    const rendered = render(formatWorkerSkillsToHTML(testData));
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