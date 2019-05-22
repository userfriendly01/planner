import React from "react";
import { render } from "react-testing-library";
import "jest-dom/extend-expect";

import Hello from "../Hello.jsx";

describe("<Hello />", () => {
  test("should render a div with content 'Render a React component'", () => {
    const rendered = render(<Hello />);
    expect(rendered.container).toHaveTextContent("Render a React component");
  });
});
