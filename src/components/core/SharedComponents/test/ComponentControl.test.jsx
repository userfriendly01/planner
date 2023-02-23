import React from "react";
import {
  render
} from "testUtils";
import { ComponentControl } from "../../../index";

const eventOnChange = jest.fn();
const ComponentControlProps = {
  dropDownOptions: ["list","list2","list3"],
  name: "testTime",
  label: "test",
  type: "test",
  onChange: eventOnChange,
  disabled: false,
  error: "",
  required: true,
  isBlankFirstValue: true
};

const renderComponentControl  = (control, value, isBlankFirstValue = true) => {
  return render(
    <ComponentControl {...ComponentControlProps} control={control} value={value} isBlankFirstValue = {isBlankFirstValue} />
  );
};

const renderComponentControlNullVal  = control => {
  return render(
    <ComponentControl {...ComponentControlProps} control={control} />
  );
};



describe(" <ComponentControl />",()=>{
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test(" Test timePicker Component",()=>{
    renderComponentControl("timePicker","testTime");
    expect(eventOnChange).toBeCalledTimes(0);
  });
  test(" Test timePicker Component",()=>{
    renderComponentControlNullVal("timePicker");
    expect(eventOnChange).toBeCalledTimes(0);
  });
  test(" Test default Component",()=>{
    renderComponentControl("default","default");
    expect(eventOnChange).toBeCalledTimes(0);
  });
  test(" Test input Component",()=>{
    renderComponentControl("input","testInput");
    expect(eventOnChange).toBeCalledTimes(0);
  });
  test(" Test select Component",()=>{
    renderComponentControl("select","testSelect");
    expect(eventOnChange).toBeCalledTimes(0);
  });
  test(" Test select Component for blank field",()=>{
    renderComponentControl("select","testSelect", false);
    expect(eventOnChange).toBeCalledTimes(0);
  });
});