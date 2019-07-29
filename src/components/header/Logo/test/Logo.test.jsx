import Logo from "../Logo";
import React from "react";
import { render } from "react-testing-library";

describe("<Logo />", () => {
  test("the header should render the Triton Admin Logo.", () => {
    const rendered = render(<Logo />);
    expect(rendered.getByAltText("Triton Admin Logo")).toBeTruthy();
  });
});