import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import {
  act,
  adGroupPermissionMapping,
  initialTestState,
  render,
  setupMockedComponents
} from "testUtils";
import { CustomFlowGridToolBar } from "../CustomFlowGridToolBar";
import React from "react";
import { useAdminState } from "context/appContext";

jest.mock("@mui/material", () => ({
  FormControl: jest.fn(),
  Grid: jest.fn(),
  InputLabel: jest.fn(),
  MenuItem: jest.fn(),
  Select: jest.fn(),
  IconButton: jest.fn(),
  Tooltip: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn()
}));

jest.mock("utils/configUtils", () => ({
  readWriteAccess: jest.fn()
}));

const openPreviewModal=jest.fn();

const renderCustomToolBar = () =>{
  const rendered =render(
    <CustomFlowGridToolBar
      matchedGroups={adGroupPermissionMapping}
      openPreviewModal={openPreviewModal}
    />
  );
  return rendered;
};

describe("<CustomFlowGridToolBar/>",()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
    setupMockedComponents({
      FormControl,
      Grid,
      InputLabel,
      MenuItem,
      Select
    });
    useAdminState.mockReturnValue(initialTestState);
  });

  test("Choose the multi-actions", () => {
    renderCustomToolBar();
    const GridMock = Grid.mock.calls[0][0];
    const ActionsAttr = GridMock.children[2].props.children.props.children[1].props.onChange;

    act(()=>{
      ActionsAttr({
        target: {
          value: "bulkAddFlow"
        }
      });
    });

    expect(GridMock).toBeTruthy();
    expect(openPreviewModal).toBeCalledTimes(1);

  });
});