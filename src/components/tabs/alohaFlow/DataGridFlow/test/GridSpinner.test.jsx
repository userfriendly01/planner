import GridSpinner from "../GridSpinner";
import React from "react";
import renderer from "react-test-renderer";
import "jest-styled-components";

describe("<GridSpinner />", () => {

  it("renders", () => {
    renderer.create(<GridSpinner />);
  });
});