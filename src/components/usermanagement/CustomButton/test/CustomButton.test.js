import CustomButton from "../CustomButton";
import React from "react";
import { render } from "testUtils";

describe("<CustomButton />", () => {
  const renderButtonComponent = disabled => render(<CustomButton disabled={disabled} />);

  test("when disabled, opacity should be .5", () => {
    const rendered = renderButtonComponent(true);
    expect(rendered.getByRole("button")).toHaveStyleRule("opacity", ".5", { modifier: "&&" });
  });
  test("when not disabled, opacity should be 1", () => {
    const rendered = renderButtonComponent(false);
    expect(rendered.getByRole("button")).toHaveStyleRule("opacity", "1", { modifier: "&&" });
  });
});
