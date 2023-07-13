import CustomToast from "../CustomToast";
import React from "react";
import {
  render,
  setupMockedComponents
} from "testUtils";
import { Stack }from "@mui/material";
jest.mock("@mui/material", () => ({
  __esModule: true,
  Stack:jest.fn()
})); 
const renderCustomToast = () => {
    return render(
      <CustomToast open = {true}
      onClose = {jest.fn()}
      msg = "customToast"
      severityType = "success" />
    );
  };
describe("CustomToast",()=>{
  beforeEach(()=>{
    setupMockedComponents({
      Stack
    })
  })
  it("Custom Toast",()=>{
    renderCustomToast();
    expect(true).toBeTruthy();
  });
  it("Custom Toast onClose",()=>{
    renderCustomToast();
    const StackEvent = Stack.mock;
    const onCloseEvent = Stack.mock.calls[0][0].children.props.children.props.onClose;
    onCloseEvent();
    expect(onCloseEvent).toBeTruthy();
   });
});