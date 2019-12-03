import FlashMessageSidebar from "../FlashMessageSidebar";
import React from "react";
import { render } from "testUtils";

describe("<FlashMessageSidebar />", () => {
  test("the FlashMessageSidebar should simply render a checkbox.", () => {
    const rendered = render(<FlashMessageSidebar />);
    expect(rendered.findAllByLabelText("AISG")).toBeTruthy();
  });
});