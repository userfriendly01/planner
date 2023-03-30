import React from "react";
import NavTabs from "../NavTabs";
import { useAdminState } from "context";
import { Link, useNavigate } from "react-router-dom";
import {
  render,
  expectOnlyPassedProps,
  setupMockedComponents,
  initialTestState,
  act,
  authenticationProfileTemplates
} from "testUtils";

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

jest.mock("context", () => ({
    Link: jest.fn(),
    useNavigate: jest.fn()
  }));

const mockNavigate = jest.fn();

describe("NavTabs", () => {
  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
  });
  describe("initial render", () => {

  });
  describe("handleDropdownOpen", () => {

  });
  describe("handleDropdownClosed", () => {

  });
});