import React from "react";
import {
  act,render,setupMockedComponents
} from "testUtils";
import {
  Fade, Paper, Grid,Popper,Button,TextField
} from "@mui/material";
import {
  MultiFieldContainerModalView
} from "../MultiFieldContainerModalView";
import { MultiValueTextField } from "../MultiValueTextField";

const mockOnClose = jest.fn();
const mockHandleOnSet = jest.fn();

jest.mock("@mui/material",()=>({
  __esModule: true,
  Button: jest.fn(),
  Popper: jest.fn(),
  TextField: jest.fn(),
  Fade: jest.fn(),
  Paper: jest.fn(),
  Grid: jest.fn()
}));

jest.mock("../MultiValueTextField", ()=>({
  __esModule: true,
  MultiValueTextField: jest.fn()
}));

const renderComponent = (indexOf, formFields) =>{
  return render(
    <MultiFieldContainerModalView
      isOpen={true}
      anchorEl={<div></div>}
      formLabel="Test Label"
      onClose={mockOnClose}
      handleOnSet={mockHandleOnSet}
      indexOf={indexOf}
      formFields={formFields}
    />
  );
};

const simpleTestFormField = [
  {
    label: "Label1",
    name: "label1",
    type: "text"
  },
  {
    label: "Label2",
    name: "label2",
    type: "number",
    helperText: "min: 1,  max: 100"
  }
];

describe("<MultiFieldContainerModalView />",()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
    setupMockedComponents({
      Popper,
      MultiValueTextField,
      TextField,
      Button,
      Fade,
      Paper,
      Grid
    });
  });
  test("Simulate isOpen true",()=>{
    renderComponent(0,simpleTestFormField);
    const popper = Popper.mock.calls[1][0];
    expect(popper).toBe("?");
  });
});