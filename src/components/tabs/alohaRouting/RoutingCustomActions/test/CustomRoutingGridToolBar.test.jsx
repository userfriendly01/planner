import React from "react";
import { CustomRoutingGridToolBar } from "../CustomRoutingGridToolBar";
import {
  Chip, FormControl, InputLabel, MenuItem, Select, Grid, TextField
} from "@mui/material";
import {
  render, setupMockedComponents, act
} from "testUtils";
import { CACHE_FILTER_ROUTING } from "utils";

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

const mockedRoutingFilter = {
  brand: "Liberty Mutual"
};

const renderCustomToolBar = () =>{
  const rendered =render(
    <CustomRoutingGridToolBar
      openAddModal={openAddModal}
      openAdvanceSearchModal={openAdvanceSearchModal}
      exportDataFile={exportDataFile}
      applyFilter={applyFilter}
      isAdvanceSearchOpen={isAdvanceSearchModalOpen}
    />
  );
  return rendered;
};
describe("<CustomRoutingGridToolBar />", ()=>{
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
    localStorage.setItem(CACHE_FILTER_ROUTING, JSON.stringify(mockedRoutingFilter));
  });
  afterEach(() => {
    localStorage.removeItem(CACHE_FILTER_ROUTING);
  });
  test("Simulate Custom Routing Toolbar Add Routing",()=>{
    renderCustomToolBar();
    const GridMock = Grid.mock.calls[0][0];
    const ActionsAttr = GridMock.children[1].props.children.props.children[1].props.onChange;
    const eventAddRoutingValue = {
      target: {
        value: "addRouting"
      }
    };
    act(()=>{
      ActionsAttr(eventAddRoutingValue);
    });
    expect(GridMock).toBeTruthy();
    expect(openAddModal).toBeCalledTimes(1);
  });
  test("Simulate Custom Routing Toolbar Advance Search",()=>{
    renderCustomToolBar();
    const GridMock = Grid.mock.calls[0][0];
    const ActionsAttr = GridMock.children[0].props.children.props.onClick;
    act(()=>{
      ActionsAttr();
    });
    expect(openAdvanceSearchModal).toBeCalledTimes(1);
  });
  test("Simulate Custom Routing Toolbar Export",()=>{
    renderCustomToolBar();
    const GridMock = Grid.mock.calls[0][0];
    const ActionsAttr = GridMock.children[1].props.children.props.children[1].props.onChange;
    const eventExportRoutingValue = {
      target: {
        value: "Export"
      }
    };
    act(()=>{
      ActionsAttr(eventExportRoutingValue);
    });
    expect(exportDataFile).toBeCalledTimes(1);
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