import React from "react";
import { CustomFlowGridToolBar } from "../CustomFlowGridToolBar";
import {
  render, initialTestState, setupMockedComponents, act
} from "testUtils";
import {
  FormControl, InputLabel, MenuItem, Select
} from "@mui/material";

jest.mock("@mui/material", () => ({
  __esModule: true,
  FormControl: jest.fn(),
  InputLabel: jest.fn(),
  MenuItem: jest.fn(),
  Select: jest.fn(),
  TextField: jest.fn(),
  Button: jest.fn(),
  Tabs: jest.fn(),
  Tab: jest.fn(),
  Paper: jest.fn(),
  Checkbox: jest.fn()
}));

jest.mock("@mui/x-data-grid", () => ({
  __esModule: true,
  DataGrid: jest.fn(),
  GridToolbar: jest.fn()
}));

jest.mock("@mui/x-date-pickers/TimePicker", () => ({
  __esModule: true,
  TimePicker: jest.fn()
}));

const openAddModal=jest.fn();
const openAdvanceSearchModal = jest.fn();
const exportDataFile = jest.fn();

const renderCustomToolBar = () =>{
  const rendered =render(
    <CustomFlowGridToolBar
      openAddModal={openAddModal}
      openAdvanceSearchModal={openAdvanceSearchModal}
      exportDataFile={exportDataFile}
    />,
    initialTestState
  );
  return rendered;
};

describe("<CustomFlowGridToolBar/>",()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
    setupMockedComponents({
      FormControl,
      InputLabel,
      MenuItem,
      Select
    });
  });

  test("render component for AddFlow",()=>{
    renderCustomToolBar();
    const FlowControlMock = FormControl.mock.calls[0][0];
    const ActionsAttr = FormControl.mock.calls[0][0].children[1].props.onChange;
    const eventAddFlowValue = {
      target: {
        value: "addFlow"
      }
    };
    act(()=>{
      ActionsAttr(eventAddFlowValue);
    });
    expect(FlowControlMock).toBeCalled();
    expect(openAddModal).toBeCalledTimes(1);
  });
  test("render component for Filter",()=>{
    renderCustomToolBar();
    const FlowControlMock = FormControl.mock.calls[0][0];
    const ActionsAttr = FormControl.mock.calls[0][0].children[1].props.onChange;
    const eventFilterFlowValue = {
      target: {
        value: "Filter"
      }
    };
    act(()=>{
      ActionsAttr(eventFilterFlowValue);
    });
    expect(FlowControlMock).toBeCalled();
    expect(openAdvanceSearchModal).toBeCalledTimes(1);
  });
  test("render component for Filter",()=>{
    renderCustomToolBar();
    const FlowControlMock = FormControl.mock.calls[0][0];
    const ActionsAttr = FormControl.mock.calls[0][0].children[1].props.onChange;
    const eventExportFlowValue = {
      target: {
        value: "Export"
      }
    };
    act(()=>{
      ActionsAttr(eventExportFlowValue);
    });
    expect(FlowControlMock).toBeCalled();
    expect(exportDataFile).toBeCalledTimes(1);
  });
  test("render component for Filter",()=>{
    renderCustomToolBar();
    const FlowControlMock = FormControl.mock.calls[0][0];
    const ActionsAttr = FormControl.mock.calls[0][0].children[1].props.onChange;
    const eventDefaultFlowValue = {
      target: {
        value: "defaultFlow"
      }
    };
    act(()=>{
      ActionsAttr(eventDefaultFlowValue);
    });
    expect(FlowControlMock).toBeCalled();
  });
});