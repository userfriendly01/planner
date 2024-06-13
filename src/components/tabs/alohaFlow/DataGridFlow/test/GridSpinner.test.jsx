import GridSpinner from "../GridSpinner";
import React from "react";
import renderer from "react-test-renderer";

describe("<GridSpinner />", () => {

  it("renders", () => {
    renderer.create(<GridSpinner />);
  });
});