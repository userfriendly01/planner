import { CustomToast } from "../CustomToast";
import React from "react";
import {
  render,
  setupMockedComponents
} from "testUtils";
import { Stack }from "@mui/material";

jest.mock("@mui/material", () => ({
  __esModule: true,
  Stack: jest.fn()
}));

jest.mock("@mui/material/Alert", () => ({
  __esModule: true,
  MuiAlert: jest.fn()
}));

const onCloseChange = jest.fn();
const openChange = true;

const renderCustomToast = () => {
  return render(
    <CustomToast open = {openChange}
      onClose = {onCloseChange}
      msg = "customToast"
      severityType = "success" />
  );
};
describe("CustomToast",()=>{
  beforeEach(()=>{
    setupMockedComponents({
      Stack
    });
  });
  it("Custom Toast",()=>{
    renderCustomToast();
    expect(openChange).toBeTruthy();
  });
  it("Custom Toast onClose",()=>{
    renderCustomToast();
    const onCloseEvent = Stack.mock.calls[0][0].children.props.children.props.onClose;
    onCloseEvent();
    expect(onCloseChange).toBeCalledTimes(1);
  });
});