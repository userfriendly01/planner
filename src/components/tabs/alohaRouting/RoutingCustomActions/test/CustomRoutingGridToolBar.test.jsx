import React from "react";
import { CustomRoutingGridToolBar } from "../CustomRoutingGridToolBar";
import {
  Chip, FormControl, InputLabel, MenuItem, Select, Grid, TextField
} from "@mui/material";
import {
  render, setupMockedComponents, act, adGroupPermissionMapping
} from "testUtils";
import {
  CACHE_FILTER_ROUTING,
  getAdvanceFilter,
  readWriteAccess
} from "utils";
import {
  getAdvanceFilter as getAdvanceFilterCopy,
  readWriteAccess as readWriteAccessCopy
} from "../../../../../utils/routingUtils";
import { useAdminState } from "context";

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

jest.mock("utils", () => ({
  CACHE_FILTER_ROUTING: "SEARCH_FILTER_ROUTING",
  getAdvanceFilter: jest.fn(),
  readWriteAccess: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

const openAddModal=jest.fn();
const openPreviewModal=jest.fn();
const openAdvanceSearchModal = jest.fn();
const exportDataFile = jest.fn();
const applyFilter = jest.fn();
const isAdvanceSearchModalOpen = true;

const mockedRoutingFilter = {
  brand: "Liberty Mutual"
};

const initData={
  userContext: {
    nNumber: "n1234567",
    profileId: 10,
    isAdmin: false,
    accessToken: "adsjfhakdf",
    permissions: [adGroupPermissionMapping[0]]
  }
};

const renderCustomToolBar = () =>{
  const rendered =render(
    <CustomRoutingGridToolBar
      openAddModal={openAddModal}
      openAdvanceSearchModal={openAdvanceSearchModal}
      openPreviewModal={openPreviewModal}
      exportDataFile={exportDataFile}
      applyFilter={applyFilter}
      isAdvanceSearchOpen={isAdvanceSearchModalOpen}
      matchedGroups={adGroupPermissionMapping}
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
    getAdvanceFilter.mockImplementation(getAdvanceFilterCopy);
    readWriteAccess.mockImplementation(readWriteAccessCopy);
  });
  afterEach(() => {
    localStorage.removeItem(CACHE_FILTER_ROUTING);
  });
  test("Simulate Custom Routing Toolbar For Routing Export",()=>{
    useAdminState.mockReturnValue(initData);
    renderCustomToolBar();
    const GridMock = Grid.mock.calls[0][0];
    const ExportFlowUI = GridMock.children[1].props.children[0].props.children.props.onClick;
    act(()=>{
      ExportFlowUI();
    });
    expect(GridMock).toBeTruthy();
    expect(exportDataFile).toBeCalledTimes(1);
  });
  test("Simulate Custom Routing Toolbar with production as Env",()=>{
    useAdminState.mockReturnValue(initData);
    renderCustomToolBar();
    const GridMock = Grid.mock.calls[0][0];
    const ExportFlowUI = GridMock.children[1].props.children[0].props.children.props.onClick;
    act(()=>{
      ExportFlowUI();
    });
    expect(GridMock).toBeTruthy();
    expect(exportDataFile).toBeCalledTimes(1);
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
  test("Simulate Custom Routing Toolbar Add Routing",()=>{
    renderCustomToolBar();
    const GridMock = Grid.mock.calls[0][0];
    const ActionsAttr = GridMock.children[2].props.children.props.children[1].props.onChange;
    const eventaddFlowValue = {
      target: {
        value: "addRouting"
      }
    };
    act(()=>{
      ActionsAttr(eventaddFlowValue);
    });
    expect(openAddModal).toBeCalledTimes(1);
  });
  test("Simulate Custom Routing Toolbar Default block",()=>{
    renderCustomToolBar();
    const GridMock = Grid.mock.calls[0][0];
    const ActionsAttr = GridMock.children[2].props.children.props.children[1].props.onChange;
    const eventaddFlowValue = {
      target: {
        value: "default"
      }
    };
    act(()=>{
      ActionsAttr(eventaddFlowValue);
    });
    expect(openAddModal).toBeCalledTimes(0);
  });
  test("Simulate Existing Filter Delete Functionality", async ()=>{
    renderCustomToolBar();
    const GridMock = Grid.mock.calls[0][0];
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
          value: "bulkDeleteRouting"
        }
      });
    });

    act(()=>{
      ActionsAttr({
        target: {
          value: "bulkAddRouting"
        }
      });
    });
    act(()=>{
      ActionsAttr({
        target: {
          value: "bulkEditRouting"
        }
      });
    });
    expect(GridMock).toBeTruthy();
    expect(openAddModal).toBeCalledTimes(0);
    expect(openPreviewModal).toBeCalledTimes(3);

  }); });