import React from "react";
import { render } from "react-testing-library";

import Hello from "../Hello.jsx";

describe("<Hello />", () => {
  test("should render a div with correct content", () => {
    const rendered = render(<Hello />);
    expect(rendered.container).toHaveTextContent("This page is under construction. Click here to return to Triton");
  });
});