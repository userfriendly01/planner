import React from "react";
import { CustomFlowGridToolBar } from "../CustomFlowGridToolBar";
import {
  render, setupMockedComponents, act, initialTestState
} from "testUtils";
import {
  Chip, FormControl, InputLabel, MenuItem, Select, Grid, TextField
} from "@mui/material";
import {
  CACHE_FILTER_FLOW
} from "utils/alohaFlowUtils";
import { useAdminState } from "context/appContext";

jest.mock("@mui/material", () => ({
  __esModule: true,
  Grid: jest.fn(),
  Chip: jest.fn(),
  TextField: jest.fn(),
  FormControl: jest.fn(),
  InputLabel: jest.fn(),
  Select: jest.fn(),
  MenuItem: jest.fn(),
  Button: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn()
}));

jest.mock("utils/alohaFlowUtils", () => ({
  CACHE_FILTER_FLOW: "SEARCH_FILTER_FLOW",
  getAdvanceFilter: jest.fn()
}));

jest.mock("utils/alohaConfigUtils", () => ({
  readWriteAccess: jest.fn()
}));

const openAddModal=jest.fn();
const openPreviewModal=jest.fn();
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
      openPreviewModal={openPreviewModal}
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
    useAdminState.mockReturnValue(initialTestState);
    localStorage.setItem(CACHE_FILTER_FLOW, JSON.stringify(mockedFlowFilter));
    // getAdvanceFilter.mockImplementation(getAdvanceFilterCopy);
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
    const ExportFlowUI = GridMock.children[1].props.children.props.children.props.onClick;
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
  xtest("Simulate Existing Filter Delete Functionality", ()=>{
    renderCustomToolBar();
    const GridMock = Grid.mock.calls[1][0];
    const onDelete = GridMock.children[0].props.children.props.InputProps.startAdornment[0].props.onDelete;
    act(()=>{
      onDelete("brand");
    });
    const chipTags = Grid.mock.calls[2][0].children[0].props.children.props.InputProps.startAdornment;
    expect(chipTags.length).toBe(0);
  });
  test("Choose the multi-actions", () => {
    renderCustomToolBar();
    const GridMock = Grid.mock.calls[0][0];
    const ActionsAttr = GridMock.children[2].props.children.props.children[1].props.onChange;

    act(()=>{
      ActionsAttr({
        target: {
          value: "bulkDeleteFlow"
        }
      });
    });

    act(()=>{
      ActionsAttr({
        target: {
          value: "bulkAddFlow"
        }
      });
    });
    act(()=>{
      ActionsAttr({
        target: {
          value: "bulkEditFlow"
        }
      });
    });
    expect(GridMock).toBeTruthy();
    expect(openAddModal).toBeCalledTimes(0);
    expect(openPreviewModal).toBeCalledTimes(3);
  });
});