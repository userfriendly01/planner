import { useAdminState } from "context/appContext";
import AlohaRoutingContainer from "../AlohaRoutingContainer";
import { DataGridRouting } from "../DataGridRouting/DataGridRouting";
import React from "react";
import {
  initialTestState,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn()
}));

jest.mock("../DataGridRouting/DataGridRouting",()=>({
  __esModule: true,
  DataGridRouting: jest.fn()
}));

describe("<AlohaRoutingContainer />", ()=>{
  beforeEach(()=>{
    setupMockedComponents({
      DataGridRouting
    });

    useAdminState.mockReturnValue(initialTestState);

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    });
  });

  test("Simple Render", () =>{
    render(<AlohaRoutingContainer />);
    expect(DataGridRouting.mock.calls.length).toBe(1);
  });
});
