import React from "react";
import {
  InputLabel, MenuItem, Select
} from "@mui/material";
import { CustomFlowRoutingToolBar } from "../CustomRoutingGridToolBar";
import {
  render, initialTestState, setupMockedComponents
} from "testUtils";

jest.mock("@mui/material", ()=>({
  __esModule: true,
  InputLabel: jest.fn(),
  Select: jest.fn(),
  TextField: jest.fn(),
  Button: jest.fn(),
  Tabs: jest.fn(),
  Tab: jest.fn(),
  Paper: jest.fn(),
  Checkbox: jest.fn()
}));

jest.mock("@mui/x-date-pickers/TimePicker", () => ({
  TimePicker: jest.fn()
}));

jest.mock("@mui/x-data-grid", ()=>({
  __esModule: true,
  DataGrid: jest.fn(),
  GridRenderCellParams: jest.fn(),
  GridToolbar: jest.fn()
}));

const openAddModal=jest.fn();
const openAdvanceSearchModal = jest.fn();
const exportDataFile = jest.fn();

const renderCustomToolBar = () =>{
  const rendered =render(
    <CustomFlowRoutingToolBar
      openAddModal={openAddModal}
      openAdvanceSearchModal={openAdvanceSearchModal}
      exportDataFile={exportDataFile}
    />,
    initialTestState
  );
  return rendered;
};
describe("<CustomFlowRoutingToolBar />", ()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
  });
  test("Simulate Custom Routing Toolbar",()=>{
    renderCustomToolBar();
    expect(Select.mock).toBe("Rendered Container?");
  });
});