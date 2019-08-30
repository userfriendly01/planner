import CustomButton from "../CustomButton";
import React from "react";
import { render } from "testUtils";

describe("<CustomButton />", () => {
  const renderButtonComponent = disabled => render(<CustomButton disabled={disabled} onClick={() => "whatever"} />);

  test("when diabled, opacity should be .5", () => {
    const rendered = renderButtonComponent(true);
    expect(rendered.container).toHaveStyleRule("opacity", .5, {
      modifier: "&&"
    });
  });
});
