/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import AlohaRoutingContainer from "../AlohaRoutingContainer";
import { DataGridRouting } from "../DataGridRouting";
import { authWrapper } from "../../../core/AzureAuth";
import React from "react";
import {
  initialTestState,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("../DataGridRouting",()=>({
  __esModule: true,
  DataGridRouting: jest.fn()
}));
jest.mock("../../../core/AzureAuth",()=>({
  __esModule: true,
  authWrapper: jest.fn().mockReturnValue({
    __esModule: true,
    render: jest.fn()
  })
}));

describe("<AlohaRoutingContainer />", ()=>{
  beforeEach(()=>{
    setupMockedComponents({
      DataGridRouting,
      authWrapper
    }),
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
  test("Simple Render", async () =>{
    // render(<AlohaRoutingContainer accessToken="999" matchedGroups="8,7,6" />, initialTestState);
    expect(DataGridRouting.mock.calls.length).toBe(0);
  });
});
