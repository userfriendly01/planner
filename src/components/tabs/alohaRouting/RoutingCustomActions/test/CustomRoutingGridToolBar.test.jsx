import React from "react";
import { CustomRoutingGridToolBar } from "../CustomRoutingGridToolBar";
import {
  Chip, FormControl, InputLabel, MenuItem, Select, Grid, TextField, Button
} from "@mui/material";
import {
  render, setupMockedComponents, act, adGroupPermissionMapping
} from "testUtils";
import { CACHE_FILTER_ROUTING } from "utils";
import { useAdminState } from "context";
import {
  getAdGroupPermissionMapping
} from "authentication";
import {
  AlohaFlowContainer,
  AlohaRoutingContainer,
  TritonUsersViewWrapper
} from "components";

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

jest.mock("components",()=>({
  AlohaFlowContainer: jest.fn(),
  AlohaRoutingContainer: jest.fn(),
  TritonUsersViewWrapper: jest.fn()
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
const matchedGroupsProd = ["gpi-cct-config-route-readwrite-prod"];
const matchedGroupsNonProd = ["gpi-cct-config-route-readwrite-np"];
const unMatchedGroupsNonProd = ["gpi-cct-config-route-read-np"];

const mockedRoutingFilter = {
  brand: "Liberty Mutual"
};

const initData={
  userContext: {
    pingIdentity: {
      sub: "n0263786",
      groups: [],
      aud: "ciciccttritondev1",
      environment: "development"
    }
  }
};
const initDataProd={
  userContext: {
    pingIdentity: {
      sub: "n0263786",
      groups: [],
      aud: "ciciccttritondev1",
      environment: "production"
    }
  }
};
const renderCustomToolBar = matchedGroups =>{
  const rendered =render(
    <CustomRoutingGridToolBar
      openAddModal={openAddModal}
      openAdvanceSearchModal={openAdvanceSearchModal}
      openPreviewModal={openPreviewModal}
      exportDataFile={exportDataFile}
      applyFilter={applyFilter}
      isAdvanceSearchOpen={isAdvanceSearchModalOpen}
      matchedGroups={matchedGroups}
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
      MenuItem,
      Button,
      AlohaFlowContainer,
      AlohaRoutingContainer,
      TritonUsersViewWrapper
    });
    getAdGroupPermissionMapping.mockReturnValue(adGroupPermissionMapping);
    localStorage.setItem(CACHE_FILTER_ROUTING, JSON.stringify(mockedRoutingFilter));
  });
  afterEach(() => {
    localStorage.removeItem(CACHE_FILTER_ROUTING);
  });
  test("Simulate Custom Routing Toolbar For Routing Export",()=>{
    useAdminState.mockReturnValue(initData);
    renderCustomToolBar(matchedGroupsNonProd);
    const GridMock = Grid.mock.calls[0][0];
    const ExportFlowUI = GridMock.children[1].props.children[0].props.children.props.onClick;
    act(()=>{
      ExportFlowUI();
    });
    expect(GridMock).toBeTruthy();
    expect(exportDataFile).toBeCalledTimes(1);
  });
  test("Simulate Custom Routing Toolbar with production as Env",()=>{
    useAdminState.mockReturnValue(initDataProd);
    renderCustomToolBar(matchedGroupsProd);
    const GridMock = Grid.mock.calls[0][0];
    const ExportFlowUI = GridMock.children[1].props.children[0].props.children.props.onClick;
    act(()=>{
      ExportFlowUI();
    });
    expect(GridMock).toBeTruthy();
    expect(exportDataFile).toBeCalledTimes(1);
  });
  test("Simulate Custom Routing Toolbar Advance Search",()=>{
    renderCustomToolBar(matchedGroupsNonProd);
    const GridMock = Grid.mock.calls[0][0];
    const ActionsAttr = GridMock.children[0].props.children.props.onClick;
    act(()=>{
      ActionsAttr();
    });
    expect(openAdvanceSearchModal).toBeCalledTimes(1);
  });
  test("Simulate Custom Routing Toolbar Add Routing",()=>{
    renderCustomToolBar(unMatchedGroupsNonProd);
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
    renderCustomToolBar(matchedGroupsNonProd);
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
  test("Simulate Existing Filter Delete Functionality", ()=>{
    renderCustomToolBar(matchedGroupsNonProd);
    const GridMock = Grid.mock.calls[1][0];
    const onDelete = GridMock.children[0].props.children.props.InputProps.startAdornment[0].props.onDelete;
    act(()=>{
      onDelete("brand");
    });
    const chipTags = Grid.mock.calls[2][0].children[0].props.children.props.InputProps.startAdornment;
    expect(chipTags.length).toBe(0);
  });
  test("Choose the multi-actions", () => {
    renderCustomToolBar(matchedGroupsNonProd);
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