import React from "react";
import { render } from "react-testing-library";

import App from "../App.jsx";

describe("<App />", () => {
  test("should render a div with correct content", () => {
    const rendered = render(<App />);
    expect(rendered.container).toHaveTextContent("This page is under construction. Click here to return to Triton");
  });
});