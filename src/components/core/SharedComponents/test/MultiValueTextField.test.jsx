import React from "react";
import {
  act,
  render,setupMockedComponents
} from "testUtils";
import { MultiValueTextField } from "../MultiValueTextField";
import {
  Chip,Autocomplete
} from "@mui/material";

const mockedOnChange = jest.fn();

jest.mock("@mui/material",()=>({
  __esModule: true,
  Chip: jest.fn(),
  TextField: jest.fn(),
  Autocomplete: jest.fn()
}));

const renderComponent = value =>{
  return render(
    <MultiValueTextField
      name="testField"
      label="Test Field"
      onChange={mockedOnChange}
      value={value}
    />
  );
};

describe("<MultiValueTextField>", ()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
    setupMockedComponents({
      Autocomplete,
      Chip
    });
  });
  function props(){
    return ["test1"];
  }


  test("Simulate onChange", ()=>{
    renderComponent(["test"]);
    const onChange = Autocomplete.mock.calls[1][0].onChange;
    act(()=>{
      onChange({
        target: {
          value: "English"
        }
      });
    });
    const filedValue = Autocomplete.mock.calls[2][0].value;
    expect(filedValue).toStrictEqual(["test", "English"]);
  });

  test("Simulate renderTags", ()=>{
    renderComponent(["test"]);
    const renderTags = Autocomplete.mock.calls[1][0].renderTags;
    const renderInput = Autocomplete.mock.calls[1][0].renderInput;
    act(()=>{
      renderTags(["Test","Test2"],props);
      renderInput();
    });
    expect(renderTags).toBeTruthy();
  });
});