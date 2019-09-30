import ModalHeader from "../ModalHeader";
import React from "react";
import { render } from "testUtils";

describe("<ModalHeader />", () => {
  describe("font size is passed as a prop", () => {
    const fontSizeProp = "42px";
    test("should render whatever font size is passed", () => {
      const rendered = render(<ModalHeader fontSize={fontSizeProp} />);
      expect(rendered.container.firstChild).toHaveStyleRule("font-size", fontSizeProp);
    });
  });
  describe("font size is not passed as a prop", () => {
    test("should render font size of 3rem", () => {
      const rendered = render(<ModalHeader />);
      expect(rendered.container.firstChild).toHaveStyleRule("font-size", "3rem");
    });
  });
});