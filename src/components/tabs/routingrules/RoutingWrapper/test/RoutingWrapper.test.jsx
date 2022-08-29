import RoutingWrapper from "../RoutingWrapper";
import React from "react";
import { render } from "testUtils";

describe("<RoutingWrapper />", () => {
  test("we should show the temporary text.", () => {
    const rendered = render(<RoutingWrapper />);
    expect(rendered.getByText("Routing Rules")).toBeTruthy();
  });
});