import { render } from "testUtils";
import React from "react";
import { default as RoutingAttributes } from "../RoutingAttributes";


describe("<RoutingAttributes />", ()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
  });
  const renderComponent = () => {
    return render(
      <RoutingAttributes />
    );
  };
  test("Simulate Component", ()=>{
    const { getByText } = renderComponent();
    expect(getByText("Upcoming Routing Attributes")).toBeInTheDocument();
  });
});