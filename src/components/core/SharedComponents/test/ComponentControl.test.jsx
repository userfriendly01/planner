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
  error: false,
  required: true,
  isBlankFirstValue: true
};

const MultiFieldFromComponentControlProps = {
  type: "text",
  onChange: eventOnChange,
  disabled: false,
  error: false,
  required: false
};

const MultiTextFieldFromComponentControlProps = {
  type: "text",
  onChange: eventOnChange,
  disabled: false,
  error: false,
  required: false
};

const SwitchFromComponentControlProps = {
  type: "checkbox",
  onChange: eventOnChange,
  disabled: false,
  error: false,
  required: false
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

const renderComponentControlForMultiFormField = (name, label, value, formFields) => {
  return render(
    <ComponentControl {...MultiFieldFromComponentControlProps} name={name} label={label} value={value} control="multiField" formFields={formFields}/>
  );
};

const renderComponentControlForMultiTextField = (name, label, value) =>{
  return render(
    <ComponentControl {...MultiTextFieldFromComponentControlProps} name={name} label={label} value={value} control="multiTextField"/>
  );
};

const renderComponentControlForSwitch = (name, label, value) =>{
  return render(
    <ComponentControl {...SwitchFromComponentControlProps} name={name} label={label} value={value} control="switch"/>
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
  test(" Test AutoComplete Component",()=>{
    const { getByDisplayValue } = renderComponentControl("autoComplete","testInput");
    const inputEvent = getByDisplayValue("testInput",{ hidden: true });
    expect(inputEvent).toBeTruthy();
  });
  test("Test MultiFieldContainer", ()=>{
    const {
      getByText
    } = renderComponentControlForMultiFormField("testField", "Test Field", [{
      field1: "Test Field 1",
      number: 1
    }], [{
      label: "Test Field",
      name: "field1",
      type: "input"
    },
    {
      label: "Number",
      name: "number",
      type: "number"
    }]);
    const inputButton = getByText(/Test Field 1 - 1/i);
    expect(inputButton).toBeInTheDocument();
  });
  test("multiTextField", ()=>{
    const {
      getByText
    } = renderComponentControlForMultiTextField("Field1", "field1" ,["#00001", "#00009"]);
    expect(getByText("#00001")).toBeInTheDocument();

  });
  test("switch", ()=>{
    const { getByText } = renderComponentControlForSwitch("Field1", "filed1", false);
    const switchButton = getByText("filed1");
    act(()=>{ fireEvent.click(switchButton); });
    expect(switchButton).toBeInTheDocument();
  });
});