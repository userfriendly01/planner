import React from "react";
import { CustomFlowGridToolBar } from "../CustomFlowGridToolBar";
import {
  render, setupMockedComponents, act
} from "testUtils";
import {
  Chip, FormControl, InputLabel, MenuItem, Select, Grid, TextField
} from "@mui/material";
import { CACHE_FILTER_FLOW } from "utils";

jest.mock("@mui/material", () => ({
  __esModule: true,
  Grid: jest.fn(),
  Chip: jest.fn(),
  TextField: jest.fn(),
  FormControl: jest.fn(),
  InputLabel: jest.fn(),
  Select: jest.fn(),
  MenuItem: jest.fn()
}));

const openAddModal=jest.fn();
const openAdvanceSearchModal = jest.fn();
const exportDataFile = jest.fn();
const applyFilter = jest.fn();
const isAdvanceSearchModalOpen = true;

const mockedFlowFilter = {
  brand: "Liberty Mutual"
};

const renderCustomToolBar = () =>{
  const rendered =render(
    <CustomFlowGridToolBar
      openAddModal={openAddModal}
      openAdvanceSearchModal={openAdvanceSearchModal}
      exportDataFile={exportDataFile}
      applyFilter={applyFilter}
      isAdvanceSearchOpen={isAdvanceSearchModalOpen}
    />
  );
  return rendered;
};

describe("<CustomFlowGridToolBar/>",()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
    setupMockedComponents({
      Grid,
      TextField,
      FormControl,
      Chip,
      InputLabel,
      Select,
      MenuItem
    });
    localStorage.setItem(CACHE_FILTER_FLOW, JSON.stringify(mockedFlowFilter));
  });
  afterEach(() => {
    localStorage.removeItem(CACHE_FILTER_FLOW);
  });

  test("render component for AddFlow",()=>{
    renderCustomToolBar();
    const GridMock = Grid.mock.calls[0][0];
    const ActionsAttr = GridMock.children[2].props.children.props.children[1].props.onChange;
    const eventAddFlowValue = {
      target: {
        value: "addFlow"
      }
    };
    act(()=>{
      ActionsAttr(eventAddFlowValue);
    });
    expect(GridMock).toBeTruthy();
    expect(openAddModal).toBeCalledTimes(1);
  });
  test("render component for Export",()=>{
    renderCustomToolBar();
    const GridMock = Grid.mock.calls[0][0];
    const ExportFlowUI = GridMock.children[1].props.children[1].props.children.props.children.props.onClick;
    act(()=>{
      ExportFlowUI();
    });
    expect(exportDataFile).toBeCalledTimes(1);
  });
  test("render component for Default",()=>{
    renderCustomToolBar();
    const GridMock = Grid.mock.calls[0][0];
    const ActionsAttr = GridMock.children[2].props.children.props.children[1].props.onChange;
    const eventAddFlowValue = {
      target: {
        value: "default"
      }
    };
    act(()=>{
      ActionsAttr(eventAddFlowValue);
    });
    expect(GridMock).toBeTruthy();
    expect(openAddModal).toBeCalledTimes(0);
  });
  test("render search Component", ()=>{
    renderCustomToolBar();
    const GridMock = Grid.mock.calls[0][0];
    const ActionsAttr = GridMock.children[0].props.children.props.onClick;
    act(()=>{
      ActionsAttr();
    });
    expect(openAdvanceSearchModal).toBeCalledTimes(1);
  });
  test("Simulate Existing Filter Delete Functionality", ()=>{
    renderCustomToolBar();
    const GridMock = Grid.mock.calls[1][0];
    const onDelete = GridMock.children[0].props.children.props.InputProps.startAdornment[0].props.onDelete;
    act(()=>{
      onDelete("brand");
    });
    const chipTags = Grid.mock.calls[2][0].children[0].props.children.props.InputProps.startAdornment;
    expect(chipTags.length).toBe(0);
  });
});