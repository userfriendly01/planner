import ManagementWrapper from "../ManagementWrapper";
import React from "react";
import { render } from "react-testing-library";

describe("<ManagementWrapper />", () => {
  test("we should show the temporary text.", () => {
    const rendered = render(<ManagementWrapper />);
    expect(rendered.getByText("Team Management Page")).toBeTruthy();
  });
});