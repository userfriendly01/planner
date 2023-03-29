import React from "react";
import {
  fireEvent,
  render,
  act
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
    <ComponentControl {...ComponentControlProps} control={control} value={value} isBlankFirstValue = {isBlankFirstValue}/>
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
    const { getByLabelText } = renderComponentControl("timePicker","testTime");
    const timeEvent = getByLabelText("Choose time",{ hidden: true });
    act(()=>{
      fireEvent.click(timeEvent);
    });
    expect(timeEvent).toBeTruthy();
  });
  test(" Test timePicker Component with null value",()=>{
    const { getByLabelText } = renderComponentControlNullVal("timePicker");
    const timeEvent = getByLabelText("Choose time",{ hidden: true });
    act(()=>{
      fireEvent.click(timeEvent);
    });
    expect(timeEvent).toBeTruthy();
  });
  test(" Test default Component",()=>{
    renderComponentControl("default","default");
    expect(eventOnChange).toBeCalledTimes(0);
  });
  test(" Test input Component",()=>{
    const { getByDisplayValue } = renderComponentControl("input","testInput");
    const inputEvent = getByDisplayValue("testInput",{ hidden: true });
    expect(inputEvent).toBeTruthy();
  });
  test(" Test select Component",()=>{
    const { getByDisplayValue } = renderComponentControl("select","testSelect");
    renderComponentControl("select","testSelect2", false);
    const selectEvent = getByDisplayValue("testSelect",{ hidden: true });
    expect(selectEvent).toBeTruthy();
  });
});