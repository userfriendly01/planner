import React from "react";
import CallRecordingForm from "./CallRecordingForm";
import CallRecordingScope from "./CallRecordingScope";
import {
  useAdminState,
  useFormState,
  useFormDispatch,
  userFormActions
} from "context";
import {
  act,
  expectOnlyPassedProps,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("./CallRecordingScope", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn(),
  useFormState: jest.fn(),
  useFormDispatch: jest.fn(),
  userFormActions: jest.fn()
}));

const testState = {
  calabrioContext: {
    groups: [],
    teams: [],
    roles: [],
    users: []
  }
};

describe("CallRecordingForm", () => {
  beforeEach(() => {

  });
  describe("User is being created", () => {
    describe("initial render", () => {
      test("Form is rendered as expected", () => {

      });
    });
    describe("Role Dropdown", () => {
      describe("updateValue is called", () => {
        test("setForm is called with the appropriate params", () => {

        });
      });
    });
    describe("Team Dropdown", () => {
      describe("updateValue is called", () => {
        test("setForm is called with the appropriate params", () => {

        });
      });
    });
  });
  describe("User is being updated", () => {
    describe("initial render", () => {
      test("Form is rendered as expected", () => {

      });
    });
  });
});
