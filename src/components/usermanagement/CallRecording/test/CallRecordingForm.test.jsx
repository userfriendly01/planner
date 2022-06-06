import React from "react";
import CallRecordingForm from "./CallRecordingForm";
import CallRecordingScope from "./CallRecordingScope";
import {
  useAdminState,
  useFormState,
  useFormDispatch,
  userFormActions
} from "context";

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

describe("CallRecordingForm", () => {

});
