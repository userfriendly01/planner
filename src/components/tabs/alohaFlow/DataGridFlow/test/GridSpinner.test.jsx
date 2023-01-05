import GridSpinner from "../GridSpinner";
import React from "react";
import renderer from "react-test-renderer";
import "jest-styled-components";

describe("<GridSpinner />", () => {

  it("renders", () => {
    const tree = renderer.create(<GridSpinner />);
    expect(tree).toMatchSnapshot();
  });
});