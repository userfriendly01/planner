import { LoginError } from "../LoginError";
import React from "react";
import {
  render,
  initialTestState
} from "testUtils";

const errorMessage = "error 123!";
const renderComponent = () => render(
  <LoginError message={errorMessage} />,
  initialTestState);
describe("<LoginError />", () => {

  it("renders", () => {
    const rendered = renderComponent();

    expect(rendered.getByText(errorMessage)).toBeInTheDocument();
  });
});