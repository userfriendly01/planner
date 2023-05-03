import React from "react";
import {
  act,
  render,setupMockedComponents
} from "testUtils";
import { MultiValueTextField } from "../MultiValueTextField";
import {
  Chip, TextField
} from "@mui/material";

const mockedOnChange = jest.fn();

jest.mock("@mui/material",()=>({
  __esModule: true,
  Chip: jest.fn(),
  TextField: jest.fn()
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
      TextField,
      Chip
    });
  });
  test("Simulate onDelete",()=>{
    renderComponent(["test"]);
    const onDelete = TextField.mock.calls[1][0].InputProps.startAdornment[0].props.onDelete;
    act(()=>{
      onDelete();
    });
    const startAdornment = TextField.mock.calls[2][0].InputProps.startAdornment;
    expect(startAdornment.length).toBe(0);
  });
  test("Simulate onKeyPress", ()=>{
    renderComponent(["test"]);
    const onKeyPress = TextField.mock.calls[1][0].onKeyPress;
    act(()=>{
      onKeyPress({
        code: "Space",
        target: {
          value: "Spanish"
        }
      });
    });
    const startAdornment = TextField.mock.calls[2][0].InputProps.startAdornment;
    expect(startAdornment.length).toBe(2);
    expect(startAdornment[1].props.label).toBe("Spanish");
    expect(mockedOnChange).toBeCalledTimes(1);
  });
  test("Simulate onChange", ()=>{
    renderComponent(["test"]);
    const onChange = TextField.mock.calls[1][0].onChange;
    act(()=>{
      onChange({
        target: {
          value: "English"
        }
      });
    });
    const filedValue = TextField.mock.calls[2][0].value;
    expect(filedValue).toBe("English");
  });
  test("Simulate onKeyPress with initial null value", ()=>{
    renderComponent();
    const onKeyPress = TextField.mock.calls[1][0].onKeyPress;
    act(()=>{
      onKeyPress({
        code: "Space",
        target: {
          value: "Property"
        }
      });
    });
    const startAdornment = TextField.mock.calls[2][0].InputProps.startAdornment;
    expect(startAdornment.length).toBe(1);
    expect(startAdornment[0].props.label).toBe("Property");
    expect(mockedOnChange).toBeCalledTimes(1);
  });
  test("Simulate onKeyPress with Random Key", ()=>{
    renderComponent();
    const onKeyPress = TextField.mock.calls[1][0].onKeyPress;
    act(()=>{
      onKeyPress({
        code: "Enter",
        target: {
          value: "Property"
        }
      });
    });
    expect(mockedOnChange).toBeCalledTimes(0);
  });
});