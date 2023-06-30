import React from "react";
import {
  act,render,setupMockedComponents
} from "testUtils";
import {
  Chip,FormControl,TextField
} from "@mui/material";
import {
  MultiFieldContainer
} from "../MultiFieldContainer";
import { MultiFieldContainerModalView } from "../MultiFieldContainerModalView";

const mockUpdateValue = jest.fn();

jest.mock("@mui/material",()=>({
  __esModule: true,
  Chip: jest.fn(),
  TextField: jest.fn(),
  FormControl: jest.fn()
}));

jest.mock("../MultiFieldContainerModalView", ()=>({
  __esModule: true,
  MultiFieldContainerModalView: jest.fn()
}));

const renderComponent = (value, formFields) =>{
  return render(
    <MultiFieldContainer
      error={false}
      name="testName"
      label="testLabel"
      required={false}
      value={value}
      formFields={formFields}
      updateValue={mockUpdateValue}
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

describe("<MultiFieldContainer />", ()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
    setupMockedComponents({
      MultiFieldContainerModalView,
      FormControl,
      TextField,
      Chip
    });
  });
  test("Simulate handleClick on TextField",()=>{
    const value =[{
      label1: "Test001",
      label2: 10
    }];
    renderComponent(value, simpleTestFormField);
    const textFieldOnClick = FormControl.mock.calls[1][0].children.props.onClick;
    act(()=>{
      textFieldOnClick({ event: { currentTarget: MultiFieldContainerModalView }});
    });
    const isOpen = MultiFieldContainerModalView.mock.calls[2][0].isOpen;
    expect(isOpen).toBe(true);
  });
  test("Simulate onEdit on Click of Chip", ()=>{
    const value =[{
      label1: "Test002",
      label2: 10
    }];
    renderComponent(value, simpleTestFormField);
    const chipOnClick = FormControl.mock.calls[1][0].children.props.InputProps.startAdornment[0].props.onClick;
    act(()=>{
      chipOnClick();
    });
    const indexOf = MultiFieldContainerModalView.mock.calls[2][0].indexOf;
    expect(indexOf).toBe(0);
  });
  test("Simulate onDelete on Click of Chip Delete Icon", ()=>{
    const value =[{
      label1: "Test003",
      label2: 10
    }];
    renderComponent(value, simpleTestFormField);
    const chipOnDelete = FormControl.mock.calls[1][0].children.props.InputProps.startAdornment[0].props.onDelete;
    act(()=>{
      chipOnDelete();
    });
    expect(mockUpdateValue).toBeCalledTimes(1);
  });
  test("Simulate onClose of MultiFieldContainerModalView", ()=>{
    const value =[{
      label1: "Test004",
      label2: 10
    }];
    renderComponent(value, simpleTestFormField);
    const textFieldOnClick = FormControl.mock.calls[1][0].children.props.onClick;
    act(()=>{
      textFieldOnClick({ event: { currentTarget: MultiFieldContainerModalView }});
    });
    const onClose = MultiFieldContainerModalView.mock.calls[2][0].onClose;
    act(()=>{
      onClose();
    });
    const isOpen = MultiFieldContainerModalView.mock.calls[3][0].isOpen;
    expect(isOpen).toBe(false);
  });
  test("Simulate handleOnSet of MultiFieldContainerModalView", ()=>{
    const value =[{
      label1: "Test005",
      label2: 10
    }];
    renderComponent(value, simpleTestFormField);
    const handleOnSet = MultiFieldContainerModalView.mock.calls[1][0].handleOnSet;
    act(()=>{
      handleOnSet({
        label1: "Test006",
        label2: 1
      },1);
    });
    expect(mockUpdateValue).toBeCalledTimes(1);
  });
  test("Simulate handleOnSet on existing data of MultiFieldContainerModalView", ()=>{
    const value =[{
      label1: "Test005",
      label2: 10
    }];
    renderComponent(value, simpleTestFormField);
    const handleOnSet = MultiFieldContainerModalView.mock.calls[1][0].handleOnSet;
    act(()=>{
      handleOnSet({
        label1: "Test006",
        label2: 2
      },0);
    });
    const chipLabel = FormControl.mock.calls[2][0].children.props.InputProps.startAdornment[0].props.label;
    expect(chipLabel).toBe("Test006 - 2");
  });

  test("Simulate list of list data to the MultiFieldContainer", ()=>{
    const value =[
      ["Test007", "Test008"]
    ];
    renderComponent(value, simpleTestFormField);
    const chipLabel = FormControl.mock.calls[1][0].children.props.InputProps.startAdornment[0].props.label;
    expect(chipLabel).toBe("Test007, Test008");
  });
  test("Simulate list of string data to the MultiFieldContainer", ()=>{
    const value =[
      "Test009"
    ];
    renderComponent(value, simpleTestFormField);
    const chipLabel = FormControl.mock.calls[1][0].children.props.InputProps.startAdornment[0].props.label;
    expect(chipLabel).toBe("Test009");
  });
});